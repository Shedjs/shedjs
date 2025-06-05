### Actions

- rebuild: `npm run build`
- patch: `npm version patch`
- publish: `npm publish`

### Generates

- install tools: `npm install && npm i --save-dev typedoc`
- generate ./types/ `npx tsc --emitDeclarationOnly --outDir dist/types`
- generate ./docs/ `npx typedoc src --out docs`

### Editor Settings

- Type checking in vscode

```json
{
  "typescript.preferences.checkJs": true,
  "js/ts.implicitProjectConfig.checkJs": true
}
```
