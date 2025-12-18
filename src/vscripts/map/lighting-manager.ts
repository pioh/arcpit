import { buildLayout } from "../shared/arena-layout";

/**
 * Best-effort: добавляем omnidirectional освещение, чтобы арены были "яркими" со всех сторон,
 * а не только от направленного projected texture / spotlight.
 *
 * Важно: это не замена нормальной настройки света в Hammer, но помогает для прототипа.
 */
export class LightingManager {
    private spawned = false;

    ensureLights(): void {
        if (this.spawned) return;
        this.spawned = true;

        const layout = buildLayout({ debug: false, logPrefix: "[arena-layout]" });

        const spawnOmni = (name: string, pos: Vector) => {
            // Не спавним повторно при hot reload.
            const existing = Entities.FindByName(undefined, name);
            if (existing) return;

            // Поднимаем чуть вверх, чтобы не было клиппинга в земле.
            const origin = `${pos.x} ${pos.y} ${pos.z + 320}`;

            // classname может отличаться в разных сборках; пробуем несколько вариантов.
            const kv: any = {
                targetname: name,
                origin,
                // typical Source light keys (best-effort)
                _light: "255 255 255 255",
                brightness: "6",
                distance: "6000",
                quadratic_attn: "1",
                linear_attn: "0",
                constant_attn: "0",
                castshadows: "0",
            };

            const trySpawn = (classname: string) => {
                try {
                    const ent = SpawnEntityFromTableSynchronous(classname as any, kv);
                    if (ent !== undefined) {
                        try { (ent as any).SetName(name); } catch (e) {}
                        return true;
                    }
                } catch (e) {}
                return false;
            };

            if (trySpawn("light_omni")) return;
            if (trySpawn("light_omni2")) return;
        };

        // Нейтралка
        spawnOmni("arcpit_light_neutral", Vector(layout.neutral.center.x, layout.neutral.center.y, layout.neutral.center.z));

        // Арены
        for (const a of layout.arenas) {
            spawnOmni(`arcpit_light_arena_${a.id}`, Vector(a.center.x, a.center.y, a.center.z));
        }
    }
}


