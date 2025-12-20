import * as path from "node:path";

export function heroShortFromNpc(npcName) {
    return npcName.replace(/^npc_dota_hero_/, "");
}

export function heroFolder(rootKvDir, heroShort) {
    return path.join(rootKvDir, "heroes", heroShort);
}

export function itemFolder(rootKvDir, itemName) {
    return path.join(rootKvDir, "items", itemName);
}

export function unassignedFolder(rootKvDir, abilityName) {
    return path.join(rootKvDir, "unassigned", abilityName);
}

export function layerDir(entityFolder, layer) {
    return path.join(entityFolder, layer);
}

export function heroNpcJsonPath(entityFolder, layer, npcName) {
    return path.join(entityFolder, layer, "npc", `${npcName}.json`);
}

export function heroAbilityJsonPath(entityFolder, layer, abilityName) {
    return path.join(entityFolder, layer, "abilities", `${abilityName}.json`);
}

export function unassignedAbilityJsonPath(entityFolder, layer, abilityName) {
    return path.join(entityFolder, layer, "ability", `${abilityName}.json`);
}

export function itemJsonPath(entityFolder, layer, itemName) {
    return path.join(entityFolder, layer, "item", `${itemName}.json`);
}


