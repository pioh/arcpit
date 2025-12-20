### Что это

`kv/` — единая структура “всё по сущности рядом”.

### Герои
`kv/heroes/<heroShort>/`
- `01_dota/` — ваниль из клиента (generated, коммитим)
- `02_custom/` — автогенерация после базового реворка (gitignored)
- `03_custom/` — ваши ручные оверрайды (коммитим)
- `modifiers/` — ваш TS код модификаторов (коммитим)
- `customizers/` — ваш TS код кастомизации/логики (коммитим)

Внутри каждого слоя:
- `npc/` — файл героя `npc_dota_hero_*.json`
- `abilities/` — способности героя `*.json`

### Способности без героя
`kv/unassigned/<abilityName>/` — та же схема `01_dota/02_custom/03_custom` (+ кодовые папки), внутри слой хранит `ability/<abilityName>.json`

### Предметы
`kv/items/<itemName>/` — та же схема `01_dota/02_custom/03_custom`, внутри слой хранит `item/<itemName>.json`


