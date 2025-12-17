// EntityScript для GameRules.AddBotPlayerWithEntityScript
// Движок выполняет этот файл в контексте созданного героя (thisEntity).

declare const thisEntity: CDOTA_BaseNPC_Hero;

function BotThink(): number {
    if (!thisEntity || !IsValidEntity(thisEntity)) return 0.5;
    if (!thisEntity.IsAlive()) return 0.5;

    // Не деремся до старта боя
    const addon = (GameRules as any).Addon as { botCombatEnabled?: boolean } | undefined;
    if (!addon?.botCombatEnabled) {
        return 0.5;
    }

    const team = thisEntity.GetTeamNumber();

    // Ищем ближайшего вражеского героя
    const enemies = FindUnitsInRadius(
        team,
        thisEntity.GetAbsOrigin(),
        undefined,
        2500,
        UnitTargetTeam.ENEMY,
        UnitTargetType.HERO,
        UnitTargetFlags.FOW_VISIBLE + UnitTargetFlags.NO_INVIS,
        FindOrder.CLOSEST,
        false
    );

    if (enemies.length > 0) {
        const target = enemies[0];
        ExecuteOrderFromTable({
            UnitIndex: thisEntity.entindex(),
            OrderType: UnitOrder.ATTACK_TARGET,
            TargetIndex: target.entindex(),
        });
        return 0.25;
    }

    return 0.5;
}

// Запускаем think
if (thisEntity && IsValidEntity(thisEntity)) {
    thisEntity.SetContextThink("ArcpitBotThink", BotThink, 0.5);
}


