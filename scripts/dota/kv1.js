// Minimal KeyValues1 (Valve KV / VDF-like) parser + writer for Dota txt files.
// Goals:
// - robust enough for Dota npc_*.txt and localization files
// - deterministic output (stable key order) when requested
// - DOES NOT fully implement Valve preprocessor; #base is handled by caller

function stripBom(s) {
    return s.charCodeAt(0) === 0xfeff ? s.slice(1) : s;
}

function isWs(ch) {
    return ch === " " || ch === "\t" || ch === "\n" || ch === "\r";
}

function isDelimiter(ch) {
    return ch === "{" || ch === "}" || ch === "\"" || isWs(ch);
}

function escapeKvString(s) {
    return String(s).replaceAll("\\", "\\\\").replaceAll("\"", "\\\"");
}

/**
 * Tokenizer that:
 * - supports quoted strings with escapes
 * - supports barewords
 * - skips // line comments (outside quotes)
 */
function tokenizeKV1(input) {
    const s = stripBom(String(input ?? ""));
    let i = 0;
    const tokens = [];

    const len = s.length;
    while (i < len) {
        const ch = s[i];

        // whitespace
        if (isWs(ch)) {
            i++;
            continue;
        }

        // comments: //...
        if (ch === "/" && s[i + 1] === "/") {
            i += 2;
            while (i < len && s[i] !== "\n") i++;
            continue;
        }

        // braces
        if (ch === "{" || ch === "}") {
            tokens.push(ch);
            i++;
            continue;
        }

        // quoted string
        if (ch === "\"") {
            i++;
            let out = "";
            while (i < len) {
                const c = s[i];
                if (c === "\\") {
                    const n = s[i + 1];
                    if (n === "\"" || n === "\\" || n === "n" || n === "r" || n === "t") {
                        if (n === "n") out += "\n";
                        else if (n === "r") out += "\r";
                        else if (n === "t") out += "\t";
                        else out += n;
                        i += 2;
                        continue;
                    }
                    // unknown escape: keep as-is (best effort)
                    out += "\\";
                    i++;
                    continue;
                }
                if (c === "\"") {
                    i++;
                    break;
                }
                out += c;
                i++;
            }
            tokens.push(out);
            continue;
        }

        // bareword token
        let start = i;
        while (i < len && !isDelimiter(s[i]) && s[i] !== "{" && s[i] !== "}") i++;
        tokens.push(s.slice(start, i));
    }

    return tokens;
}

function mergeValue(existing, incoming) {
    // KV допускает повтор ключей. Для дампа это редко важно, но чтобы не терять:
    // - если ключ повторяется -> складываем в массив.
    if (existing === undefined) return incoming;
    if (Array.isArray(existing)) return [...existing, incoming];
    return [existing, incoming];
}

/**
 * Parse KV1 text into JS object.
 * Notes:
 * - Repeated keys become arrays (to avoid data loss).
 * - Values are strings or objects.
 */
export function parseKV1(text) {
    const tokens = tokenizeKV1(text);
    let p = 0;

    function peek() {
        return tokens[p];
    }
    function next() {
        return tokens[p++];
    }

    function parseObject() {
        const obj = {};
        while (p < tokens.length) {
            const t = peek();
            if (t === "}") {
                next();
                break;
            }
            const key = next();
            if (key === undefined) break;
            const v = peek();
            if (v === "{") {
                next(); // {
                const child = parseObject();
                obj[key] = mergeValue(obj[key], child);
                continue;
            }
            const val = next();
            if (val === undefined || val === "{" || val === "}") {
                // best-effort recovery: missing value
                obj[key] = mergeValue(obj[key], "");
                continue;
            }
            obj[key] = mergeValue(obj[key], val);
        }
        return obj;
    }

    // top-level: can be a sequence of key/value pairs or a single root key -> object
    return parseObject();
}

function isPlainObject(v) {
    return v !== null && typeof v === "object" && !Array.isArray(v);
}

export function deepClone(v) {
    if (Array.isArray(v)) return v.map(deepClone);
    if (isPlainObject(v)) {
        const out = {};
        for (const k of Object.keys(v)) out[k] = deepClone(v[k]);
        return out;
    }
    return v;
}

export function deepMerge(base, patch) {
    if (Array.isArray(base) || Array.isArray(patch)) {
        // Для KV массивы чаще всего не нужны; безопаснее "patch wins"
        return deepClone(patch);
    }
    if (isPlainObject(base) && isPlainObject(patch)) {
        const out = deepClone(base);
        for (const k of Object.keys(patch)) {
            if (k in out) out[k] = deepMerge(out[k], patch[k]);
            else out[k] = deepClone(patch[k]);
        }
        return out;
    }
    return deepClone(patch);
}

export function stableSortKeysDeep(v) {
    if (Array.isArray(v)) return v.map(stableSortKeysDeep);
    if (!isPlainObject(v)) return v;
    const out = {};
    for (const k of Object.keys(v).sort()) out[k] = stableSortKeysDeep(v[k]);
    return out;
}

export function stableStringifyJson(v) {
    return JSON.stringify(stableSortKeysDeep(v), null, 2) + "\n";
}

/**
 * Stringify object into KV1 text.
 * - Always quotes keys and string values.
 * - Deterministic ordering when sortKeys=true.
 */
export function stringifyKV1(obj, { sortKeys = true, indent = "    " } = {}) {
    function keysOf(o) {
        const ks = Object.keys(o);
        return sortKeys ? ks.sort() : ks;
    }

    function writeValue(key, value, depth) {
        const pad = indent.repeat(depth);
        const kq = `"${escapeKvString(key)}"`;

        // repeated keys as array -> write each occurrence as separate key
        if (Array.isArray(value)) {
            return value.map((v) => writeValue(key, v, depth)).join("");
        }

        if (isPlainObject(value)) {
            let out = `${pad}${kq}\n${pad}{\n`;
            for (const childKey of keysOf(value)) {
                out += writeValue(childKey, value[childKey], depth + 1);
            }
            out += `${pad}}\n`;
            return out;
        }

        const vq = `"${escapeKvString(value ?? "")}"`;
        return `${pad}${kq}\t\t${vq}\n`;
    }

    let out = "";
    for (const k of keysOf(obj)) {
        out += writeValue(k, obj[k], 0);
    }
    return out;
}

export function extractBaseDirectives(text) {
    // #base "scripts/npc/xxx.txt"
    const s = stripBom(String(text ?? ""));
    const out = [];
    const re = /^\s*#base\s+("?)([^"\r\n]+)\1\s*$/gim;
    let m;
    while ((m = re.exec(s))) {
        out.push(m[2].trim().replaceAll("\\", "/"));
    }
    return out;
}


