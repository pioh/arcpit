import { findSteamAppByName, SteamNotFoundError } from "@moddota/find-steam-app";
import packageJson from "../package.json" with { type: "json" };

export function getAddonName() {
    if (!/^[a-z][\d_a-z]+$/.test(packageJson.name)) {
        throw new Error(
            "Addon name may consist only of lowercase characters, digits, and underscores " +
                "and should start with a letter. Edit `name` field in `package.json` file.",
        );
    }

    return packageJson.name;
}

export async function getDotaPath() {
    try {
        return await findSteamAppByName("dota 2 beta");
    } catch (error) {
        if (!(error instanceof SteamNotFoundError)) {
            throw error;
        }
    }
}
