# GitHub Actions Debug

## Verificar Status del Workflow

Ve a: https://github.com/robermad1986/epub-editor-vscode/actions

## Verificar Permisos

1. **Settings** → **Actions** → **General**
2. **Workflow permissions**: Debe estar en "Read and write permissions"
3. **Allow GitHub Actions to create and approve pull requests**: ✅

## Verificar Token Permissions

Si sigue fallando, el problema puede ser permisos del GITHUB_TOKEN.

## Solución Rápida

Si el workflow automático no funciona, puedes:

1. **Responder manualmente** al issue de prueba
2. **GitHub Copilot** te ayudará a responder desde la interfaz web
3. **El etiquetado manual** también funciona

## Triggers del Workflow

El workflow se ejecuta cuando:
- Se abre un nuevo issue
- Se edita un issue
- Se añade una etiqueta
- Se añade un comentario

El workflow NO se ejecuta en:
- Push de código
- Pull requests
- Otros eventos
