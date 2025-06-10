# 🧪 Plan de Testing Completo - EPUB Editor v0.1.8

## 📋 Checklist de Pre-requisitos

### Entorno de Desarrollo
- [ ] Node.js instalado (v14+)
- [ ] Python 3.7+ instalado
- [ ] VS Code instalado (v1.80.0+)
- [ ] Git instalado

### Dependencias del Proyecto
- [ ] Ejecutar `npm install`
- [ ] Verificar que `jszip` está instalado
- [ ] Verificar que `xml2js` está instalado
- [ ] Verificar que `uuid` está instalado

### Dependencias Python
- [ ] Ejecutar `pip install requests`
- [ ] Verificar que el script Python es ejecutable

## 🏗️ Compilación y Build

### 1. Compilar el Proyecto
```bash
# Limpiar build anterior
rm -rf out/

# Compilar TypeScript
npm run compile

# Verificar que no hay errores
```

**Resultado esperado**: 
- [ ] Compilación sin errores
- [ ] Carpeta `out/` creada con archivos JS

### 2. Verificar Estructura de Archivos
```
out/
├── src/
│   ├── extension.js
│   ├── fileSystemProvider.js
│   ├── ai/
│   │   ├── aiService.js
│   │   └── aiCommands.js
│   └── python/
│       └── openrouter_client.py
```

- [ ] Todos los archivos JS generados
- [ ] Script Python copiado correctamente

## 🚀 Testing de Funcionalidades Core

### 1. Apertura de EPUB

#### Test 1.1: Abrir EPUB existente
1. Presionar `F5` para abrir nueva ventana de VS Code
2. Ejecutar comando: `EPUB: Open as Virtual Folder`
3. Seleccionar un archivo EPUB de prueba

**Verificar**:
- [ ] EPUB se abre como carpeta virtual
- [ ] Estructura de carpetas visible (META-INF, OEBPS, etc.)
- [ ] Archivos .xhtml se pueden abrir
- [ ] Archivos .css se pueden abrir
- [ ] Archivo content.opf se puede abrir

#### Test 1.2: Navegación de archivos
- [ ] Expandir/colapsar carpetas funciona
- [ ] Doble clic abre archivos en editor
- [ ] Iconos de archivos se muestran correctamente

### 2. Edición de Contenido

#### Test 2.1: Editar archivo XHTML
1. Abrir un archivo .xhtml del EPUB
2. Hacer un cambio simple (agregar texto)
3. Guardar con `Ctrl+S`

**Verificar**:
- [ ] Archivo se guarda sin errores
- [ ] Indicador de "archivo modificado" aparece
- [ ] Auto-save se activa después de 2 segundos

#### Test 2.2: Editar archivo CSS
1. Abrir un archivo .css
2. Cambiar un color o tamaño
3. Guardar

**Verificar**:
- [ ] Cambios se guardan correctamente
- [ ] No hay errores en la consola

### 3. Sistema de Guardado

#### Test 3.1: Guardado manual
1. Hacer cambios en múltiples archivos
2. Ejecutar comando: `EPUB: Save EPUB File`

**Verificar**:
- [ ] Mensaje de confirmación aparece
- [ ] EPUB se guarda en disco
- [ ] Archivo EPUB se puede abrir con otro lector

#### Test 3.2: Auto-guardado
1. Habilitar auto-save en configuración
2. Hacer un cambio y esperar 2 segundos

**Verificar**:
- [ ] Archivo se guarda automáticamente
- [ ] Notificación de auto-save aparece
- [ ] No hay pérdida de datos

#### Test 3.3: Sistema de Backup
1. Verificar configuración de backup habilitada
2. Hacer cambios y guardar varias veces

**Verificar**:
- [ ] Carpeta `.epub-backups` creada
- [ ] Archivos de backup con timestamp
- [ ] Máximo 5 backups mantenidos

### 4. Comandos Básicos

#### Test 4.1: Listar archivos modificados
1. Modificar 3-4 archivos
2. Ejecutar: `EPUB: List Modified Files`

**Verificar**:
- [ ] Lista muestra todos los archivos modificados
- [ ] Rutas de archivos son correctas

#### Test 4.2: Mostrar metadatos
1. Ejecutar: `EPUB: Show EPUB Metadata`

**Verificar**:
- [ ] Panel muestra título, autor, idioma
- [ ] Información es correcta
- [ ] Formato es legible

#### Test 4.3: Estado del EPUB
1. Ejecutar: `EPUB: EPUB Status`

**Verificar**:
- [ ] Muestra ruta del archivo
- [ ] Muestra número de archivos modificados
- [ ] Muestra estado de auto-save

### 5. Creación de Nuevo EPUB

#### Test 5.1: Crear EPUB desde cero
1. Ejecutar: `EPUB: Create New EPUB`
2. Ingresar metadatos (título, autor, etc.)
3. Seleccionar ubicación para guardar

**Verificar**:
- [ ] EPUB se crea con estructura correcta
- [ ] Metadatos se guardan correctamente
- [ ] Archivo se puede abrir inmediatamente

## 🤖 Testing de Funcionalidades de IA

### 1. Configuración Inicial

#### Test 1.1: Configurar API Key
1. Ejecutar: `EPUB: 🔑 Configurar API Key IA`
2. Ingresar una API key válida de OpenRouter
3. Elegir guardar en configuración

**Verificar**:
- [ ] API key se solicita correctamente
- [ ] Opción de guardar funciona
- [ ] Key se almacena en configuración de VS Code

#### Test 1.2: Verificar Python
```bash
# En terminal
python --version
python -c "import requests; print('requests instalado')"
```

**Verificar**:
- [ ] Python 3.7+ instalado
- [ ] Módulo requests disponible

### 2. Comandos de IA en Menú Contextual

#### Test 2.1: Mejorar texto
1. Seleccionar un párrafo en un archivo .xhtml
2. Clic derecho → `🧠 Mejorar texto con IA`

**Verificar**:
- [ ] Comando aparece en menú contextual
- [ ] Progreso se muestra al ejecutar
- [ ] Texto se reemplaza con versión mejorada
- [ ] No hay errores en la consola

#### Test 2.2: Corregir gramática
1. Escribir texto con errores intencionales
2. Seleccionar y ejecutar: `✏️ Corregir ortografía y gramática`

**Verificar**:
- [ ] Errores son corregidos
- [ ] Formato se mantiene
- [ ] Respuesta es rápida (<30s)

#### Test 2.3: Traducir texto
1. Seleccionar texto en español
2. Ejecutar: `🌐 Traducir texto`
3. Seleccionar idioma destino (ej: inglés)

**Verificar**:
- [ ] Lista de idiomas aparece
- [ ] Traducción es precisa
- [ ] Caracteres especiales se mantienen

#### Test 2.4: Expandir párrafo
1. Seleccionar párrafo corto
2. Ejecutar: `📝 Expandir párrafo`

**Verificar**:
- [ ] Texto se expande coherentemente
- [ ] Mantiene el estilo original
- [ ] Longitud aumenta significativamente

#### Test 2.5: Resumir texto
1. Seleccionar varios párrafos
2. Ejecutar: `📄 Resumir texto`

**Verificar**:
- [ ] Resumen es conciso
- [ ] Mantiene ideas principales
- [ ] Es significativamente más corto

### 3. Gestión de Modelos IA

#### Test 3.1: Seleccionar modelo
1. Ejecutar: `🤖 Seleccionar modelo IA`
2. Ver lista de modelos disponibles

**Verificar**:
- [ ] Lista muestra 5 modelos gratuitos
- [ ] Descripciones son informativas
- [ ] Selección se guarda en configuración

#### Test 3.2: Información del modelo
1. Ejecutar: `ℹ️ Información del modelo`

**Verificar**:
- [ ] Muestra modelo actual
- [ ] Muestra límite de contexto
- [ ] Muestra descripción

#### Test 3.3: Probar conexión
1. Ejecutar: `🧪 Probar conexión IA`

**Verificar**:
- [ ] Prueba de conexión exitosa
- [ ] Mensaje confirma funcionamiento
- [ ] Tiempo de respuesta razonable

### 4. Manejo de Errores IA

#### Test 4.1: Sin API Key
1. Borrar API key de configuración
2. Intentar usar comando de IA

**Verificar**:
- [ ] Solicita API key
- [ ] Permite ingresarla
- [ ] Funciona después de ingresarla

#### Test 4.2: API Key inválida
1. Configurar API key incorrecta
2. Intentar usar comando de IA

**Verificar**:
- [ ] Error claro mostrado
- [ ] Sugiere verificar API key
- [ ] No crashea la extensión

#### Test 4.3: Sin conexión a internet
1. Desconectar internet
2. Intentar usar comando de IA

**Verificar**:
- [ ] Error de conexión mostrado
- [ ] Extensión sigue funcionando
- [ ] Editor no se bloquea

#### Test 4.4: Timeout
1. Seleccionar texto muy largo (>10000 palabras)
2. Intentar mejorarlo con IA

**Verificar**:
- [ ] Timeout después de 60 segundos
- [ ] Mensaje de error claro
- [ ] Posibilidad de reintentar

## 📊 Testing de Rendimiento

### 1. EPUB Grandes
1. Abrir EPUB de >50MB
2. Navegar y editar archivos

**Verificar**:
- [ ] Carga en tiempo razonable (<10s)
- [ ] Navegación fluida
- [ ] Guardado no bloquea UI

### 2. Múltiples EPUBs
1. Abrir 3 EPUBs simultáneamente
2. Editar archivos en cada uno

**Verificar**:
- [ ] Cada EPUB mantiene su estado
- [ ] No hay confusión entre archivos
- [ ] Memoria se gestiona correctamente

## 🐛 Registro de Bugs Encontrados

### Bug #1: [Título]
- **Descripción**: 
- **Pasos para reproducir**:
- **Resultado esperado**:
- **Resultado actual**:
- **Severidad**: Alta/Media/Baja

### Bug #2: [Título]
- **Descripción**: 
- **Pasos para reproducir**:
- **Resultado esperado**:
- **Resultado actual**:
- **Severidad**: Alta/Media/Baja

## 📝 Notas de Testing

### Observaciones Generales:
- 
- 
- 

### Mejoras Sugeridas:
- 
- 
- 

### Problemas de UX:
- 
- 
- 

## ✅ Resumen de Testing

### Estadísticas
- **Total de tests**: 35
- **Tests pasados**: ___
- **Tests fallidos**: ___
- **Bugs críticos**: ___
- **Bugs menores**: ___

### Estado Final
- [ ] Listo para producción
- [ ] Necesita correcciones menores
- [ ] Necesita correcciones mayores

### Firma del Tester
- **Nombre**: 
- **Fecha**: 
- **Versión testeada**: 0.1.8