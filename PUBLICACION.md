# 🚀 Guía de Publicación - EPUB Editor

## Paso 1: Subir a GitHub

### 1.1 Crear el repositorio en GitHub

1. Ve a [github.com](https://github.com) y haz login
2. Haz clic en el botón "+" → "New repository"
3. Configura el repositorio:
   - **Repository name**: `epub-editor-vscode`
   - **Description**: `A powerful VS Code extension for editing EPUB files with AI assistance`
   - **Visibility**: Public ✅
   - **Initialize**: NO marques ninguna opción (ya tenemos archivos)

### 1.2 Configurar el repositorio local

```bash
# En terminal, desde /Users/rober/EPUB_VSC
git remote add origin https://github.com/TU_USERNAME/epub-editor-vscode.git
git branch -M main
git add .
git commit -m "Initial release: EPUB Editor v0.1.8 with AI integration"
git push -u origin main
```

### 1.3 Crear el primer release

1. Ve a tu repositorio en GitHub
2. Haz clic en "Releases" → "Create a new release"
3. Configura el release:
   - **Tag version**: `v0.1.8`
   - **Release title**: `🚀 EPUB Editor v0.1.8 - AI-Powered EPUB Editing`
   - **Description**: Copia el contenido de CHANGELOG.md para v0.1.8
   - **Attach binaries**: Sube el archivo `epub-editor-0.1.8.vsix`

## Paso 2: Habilitar GitHub Copilot para Issues

### 2.1 Configurar GitHub Actions (opcional pero recomendado)

Crear `.github/workflows/copilot-assist.yml`:

```yaml
name: GitHub Copilot Issue Assistant

on:
  issues:
    types: [opened, edited]
  issue_comment:
    types: [created]

jobs:
  copilot-assist:
    runs-on: ubuntu-latest
    permissions:
      issues: write
      contents: read
    steps:
      - uses: actions/checkout@v4
      - name: Copilot Issue Assistant
        uses: github/copilot-cli-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

### 2.2 Configurar templates de issues

Crear `.github/ISSUE_TEMPLATE/bug_report.md`:

```markdown
---
name: Bug report
about: Create a report to help us improve
title: '[BUG] '
labels: bug
assignees: ''
---

**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Environment:**
- VS Code Version: [e.g. 1.85.0]
- Extension Version: [e.g. 0.1.8]
- OS: [e.g. macOS, Windows, Linux]
- Python Version (for AI features): [e.g. 3.9.0]

**Additional context**
Add any other context about the problem here.
```

## Paso 3: Preparar para VS Code Marketplace

### 3.1 Verificar cuenta Microsoft

1. Ve a [dev.azure.com](https://dev.azure.com)
2. Haz login con tu cuenta Microsoft
3. Si no tienes organización, créala
4. Anota el nombre de tu organización

### 3.2 Generar Personal Access Token

1. En Azure DevOps: User Settings → Personal Access Tokens
2. New Token:
   - **Name**: `VSCode Extension Publishing`
   - **Expiration**: 1 año
   - **Scopes**: Marketplace → Manage
3. Copia y guarda el token de forma segura

### 3.3 Configurar vsce publisher

```bash
# Instalar vsce globalmente si no está instalado
npm install -g vsce

# Crear publisher (solo primera vez)
vsce create-publisher TU_PUBLISHER_NAME

# Hacer login
vsce login TU_PUBLISHER_NAME
# Ingresa tu Personal Access Token cuando te lo pida
```

### 3.4 Actualizar package.json

Asegúrate de que `package.json` tenga:

```json
{
  "publisher": "TU_PUBLISHER_NAME",
  "repository": {
    "type": "git",
    "url": "https://github.com/TU_USERNAME/epub-editor-vscode.git"
  },
  "bugs": {
    "url": "https://github.com/TU_USERNAME/epub-editor-vscode/issues"
  },
  "homepage": "https://github.com/TU_USERNAME/epub-editor-vscode#readme"
}
```

## Paso 4: Publicación Dual

### 4.1 Publicar en VS Code Marketplace

```bash
# Compilar y empaquetar
npm run compile
vsce package

# Publicar
vsce publish
```

### 4.2 Actualizar GitHub Release

1. Sube también el nuevo `.vsix` al release de GitHub
2. Actualiza la descripción del release
3. Marca como "Latest release"

## Comandos de Referencia Rápida

```bash
# GitHub workflow
git add .
git commit -m "Descripción del cambio"
git push

# Crear nueva versión
npm version patch  # 0.1.8 → 0.1.9
npm version minor  # 0.1.8 → 0.2.0
npm version major  # 0.1.8 → 1.0.0

# VS Code Marketplace
vsce package
vsce publish

# GitHub release
git tag v0.1.9
git push origin v0.1.9
```

## Beneficios de la Publicación Dual

### GitHub:
- ✅ Control total del código
- ✅ Issue tracking con Copilot
- ✅ Community contributions
- ✅ Release notes automáticas
- ✅ Distribución manual del .vsix

### VS Code Marketplace:
- ✅ Descubrimiento automático
- ✅ Instalación con un clic
- ✅ Actualizaciones automáticas
- ✅ Estadísticas de uso
- ✅ Audiencia masiva

## Próximos Pasos Recomendados

1. **Subir a GitHub primero** para empezar a usar Copilot
2. **Probar la extensión** con usuarios beta
3. **Recopilar feedback** via GitHub Issues
4. **Iterar rápidamente** con ayuda de Copilot
5. **Publicar en Marketplace** cuando esté estable

¿Comenzamos con GitHub?
