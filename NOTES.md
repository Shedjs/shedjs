### Generates

- install tools: `npm install && npm i --save-dev typedoc`
- generate ./types/ `npx tsc --emitDeclarationOnly --outDir dist/types`
- generate ./docs/ `npx typedoc src --out docs`

### Actions

- rebuild: `npm run build`
- SemVer: https://gist.github.com/sadiqui/2f12484b729348dc087a146f54da8c3f #_If_buit_code_changed
- test: `npm pack --dry-run`
- publish: `npm publish`

### Editor Settings

- Type checking in vscode

```json
{
  "typescript.preferences.checkJs": true,
  "js/ts.implicitProjectConfig.checkJs": true
}
```
