local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["6"] = 6,["7"] = 6,["8"] = 6,["10"] = 6,["11"] = 10,["12"] = 11,["13"] = 14,["14"] = 15,["16"] = 19,["17"] = 20,["18"] = 20,["19"] = 20,["20"] = 21,["21"] = 22,["22"] = 20,["23"] = 20,["25"] = 10,["26"] = 30,["27"] = 31,["29"] = 33,["30"] = 33,["31"] = 34,["32"] = 34,["33"] = 34,["34"] = 34,["35"] = 34,["36"] = 34,["37"] = 34,["38"] = 34,["39"] = 43,["40"] = 45,["42"] = 33,["45"] = 30,["46"] = 53,["47"] = 53,["48"] = 60,["49"] = 61,["50"] = 60});
local ____exports = {}
____exports.CreepSpawner = __TS__Class()
local CreepSpawner = ____exports.CreepSpawner
CreepSpawner.name = "CreepSpawner"
function CreepSpawner.prototype.____constructor(self)
end
function CreepSpawner.prototype.startRound(self, config)
    print(("=== Starting Round " .. tostring(config.roundNumber)) .. " ===")
    if config.specialRules then
        self:applySpecialRules(config.specialRules)
    end
    for ____, wave in ipairs(config.creepWaves) do
        Timers:CreateTimer(
            wave.spawnDelay,
            function()
                self:spawnWave(wave)
                return nil
            end
        )
    end
end
function CreepSpawner.prototype.spawnWave(self, wave)
    print((("Spawning " .. tostring(wave.count)) .. "x ") .. wave.unitName)
    do
        local i = 0
        while i < wave.count do
            local creep = CreateUnitByName(
                wave.unitName,
                wave.spawnLocation,
                true,
                nil,
                nil,
                DOTA_TEAM_NEUTRALS
            )
            if creep ~= nil then
                self:setupCreep(creep)
            end
            i = i + 1
        end
    end
end
function CreepSpawner.prototype.setupCreep(self, creep)
end
function CreepSpawner.prototype.applySpecialRules(self, rules)
    print("Applying special rules for round")
end
return ____exports
