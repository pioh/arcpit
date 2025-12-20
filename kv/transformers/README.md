### Глобальные KV-трансформеры (02_custom)

Сюда кладём `*.js` трансформеры, которые применяются ко всем JSON из `01_dota` и пишут результат в `02_custom`.

Формат:

```js
export function transform(ctx) {
  // ctx.kind: "hero" | "hero_ability" | "unassigned_ability" | "item"
  // ctx.name: имя сущности (например "pudge_rot" или "pudge" или "item_abyssal_blade")
  // ctx.data: объект JSON (можно мутировать или вернуть новый)
  // return undefined => без изменений
}
```


