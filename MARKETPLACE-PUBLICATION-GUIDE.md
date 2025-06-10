# 📋 Guía de Publicación en VS Code Marketplace

## Paso 1: Configurar Azure DevOps

### 🔗 Crear Cuenta Azure DevOps
1. Ve a: https://dev.azure.com
2. Haz login con tu cuenta Microsoft
3. Crea una organización (puede ser cualquier nombre)

### 🔑 Crear Personal Access Token
1. En Azure DevOps: **User Settings** → **Personal Access Tokens**
2. **New Token**:
   - **Name**: `VSCode Publishing`
   - **Expiration**: 1 año
   - **Scopes**: **Marketplace** → **Manage** ✅
3. **Copia y guarda el token** (no lo volverás a ver)

## Paso 2: Configurar Publisher

### 🏷️ Crear/Verificar Publisher
```bash
# Crear publisher (solo si no existe)
vsce create-publisher Pishu

# O hacer login si ya existe
vsce login Pishu
# (Aquí ingresarás tu Personal Access Token)
```

### 📦 Verificar Package
```bash
# Verificar que package.json esté correcto
vsce package --dry-run

# Si todo está bien, crear el VSIX
vsce package
```

## Paso 3: Publicar

### 🚀 Publicación Final
```bash
# Publicar en Marketplace
vsce publish

# O si ya tienes el VSIX
vsce publish epub-editor-0.1.8.vsix
```

## Paso 4: Verificación

### ✅ Confirmar Publicación
1. Ve a: https://marketplace.visualstudio.com/
2. Busca "EPUB Editor"
3. Verifica que aparezca tu extensión

## 🔧 Troubleshooting Común

### Error: Publisher no existe
```bash
vsce create-publisher Pishu
```

### Error: Token inválido
- Verifica que el token tenga permisos de **Marketplace → Manage**
- Crea un nuevo token si es necesario

### Error: Package validation
- Verifica que no haya `"private": true` en package.json
- Asegúrate de que todos los archivos necesarios estén incluidos

---

**Nota**: Una vez publicado, tardará unos minutos en aparecer en Marketplace para búsqueda.
