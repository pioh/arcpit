local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["7"] = 4,["8"] = 4,["9"] = 4,["11"] = 4,["12"] = 8,["13"] = 9,["14"] = 10,["15"] = 11,["18"] = 15,["21"] = 28,["24"] = 19,["25"] = 19,["26"] = 19,["27"] = 19,["28"] = 19,["29"] = 19,["30"] = 19,["31"] = 24,["32"] = 25,["39"] = 8});
local ____exports = {}
--- Управление торговцем
____exports.ShopkeeperManager = __TS__Class()
local ShopkeeperManager = ____exports.ShopkeeperManager
ShopkeeperManager.name = "ShopkeeperManager"
function ShopkeeperManager.prototype.____constructor(self)
end
function ShopkeeperManager.prototype.ensureShopkeeper(self, spawnLocation)
    local existing = Entities:FindAllByName("arcpit_shopkeeper")
    if existing and #existing > 0 then
        print("Shopkeeper already exists")
        return
    end
    local pos = Vector(spawnLocation.x + 300, spawnLocation.y, spawnLocation.z)
    do
        local function ____catch(e)
            print("Could not spawn ent_dota_shop (might be in tools mode)")
        end
        local ____try, ____hasReturned = pcall(function()
            local shopEnt = SpawnEntityFromTableSynchronous(
                "ent_dota_shop",
                {
                    targetname = "arcpit_shop",
                    origin = (((tostring(pos.x) .. " ") .. tostring(pos.y)) .. " ") .. tostring(pos.z)
                }
            )
            if shopEnt and IsValidEntity(shopEnt) then
                print("✓ ent_dota_shop spawned")
            end
        end)
        if not ____try then
            ____catch(____hasReturned)
        end
    end
end
return ____exports
