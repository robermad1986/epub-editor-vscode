# 🖥️ Guía de Testing Visual - EPUB Editor v0.1.8

## 📋 Preparación Inicial

### 1. Abrir VS Code limpio

1. Cierra todas las ventanas de VS Code
2. Abre VS Code fresco
3. Verifica que la extensión está instalada:
   - Ve a la barra lateral izquierda → **Extensions** (icono de cuadrados)
   - Busca "EPUB Editor"
   - Debe aparecer con versión 0.1.7 y estar habilitada

### 2. Preparar archivos de prueba

- Ten listo el archivo `test-epub-valid.epub` en una carpeta accesible
- Ten una carpeta vacía lista para crear nuevos EPUBs

---

## 🧪 TESTING FUNCIONAL VISUAL

### ✅ **TEST 1: Abrir EPUB como Carpeta Virtual**

#### Método 1 - Menú Contextual (Principal)

1. **Abre el Explorer** (Ctrl+Shift+E o Cmd+Shift+E)
2. **Navega** hasta donde está `test-epub-valid.epub`
3. **Haz clic derecho** sobre el archivo .epub
4. **Busca en el menú**:
   - Debe aparecer: `📖 Open as Virtual Folder`
   - Si no aparece, verifica que la extensión está activa

#### Qué verificar:

- [ ] El comando aparece en el menú contextual
- [ ] Al hacer clic, el EPUB se abre como una nueva carpeta en el workspace **SIN** diálogo adicional de selección de archivos ⭐ **NUEVO en v0.1.8**
- [ ] Aparece una nueva sección en el Explorer con el nombre del EPUB
- [ ] Puedes expandir carpetas (META-INF, OEBPS, etc.)
- [ ] Los archivos muestran iconos apropiados (.xhtml, .css, .xml)
- [ ] Las notificaciones aparecen en la barra de estado y desaparecen automáticamente ⭐ **NUEVO en v0.1.8**

#### Método 2 - Command Palette

1. **Abre Command Palette**: `Ctrl+Shift+P` (o `Cmd+Shift+P` en Mac)
2. **Escribe**: "EPUB"
3. **Verifica que aparecen todos estos comandos**:
   ```
   EPUB: Open as Virtual Folder
   EPUB: Create New EPUB
   EPUB: Save EPUB File
   EPUB: List Modified Files
   EPUB: Show EPUB Metadata
   EPUB: EPUB Status
   EPUB: 🔑 Configurar API Key IA
   EPUB: 🤖 Seleccionar modelo IA
   EPUB: ℹ️ Información del modelo
   ```

---

### ✅ **TEST 2: Edición de Archivos**

1. **Expande** las carpetas del EPUB virtual
2. **Navega** a `OEBPS/Text/`
3. **Abre** cualquier archivo `.xhtml` (doble clic)

#### Qué verificar:

- [ ] El archivo se abre en el editor principal
- [ ] Syntax highlighting funciona (HTML/XML coloreado)
- [ ] Puedes editar el contenido normalmente
- [ ] Al escribir, aparece un punto (•) en la pestaña indicando cambios sin guardar
- [ ] El auto-guardado funciona después de 2 segundos (el punto desaparece)

---

### ✅ **TEST 3: Menú Contextual de IA (Clic Derecho en Editor)**

1. **Selecciona texto** en cualquier archivo .xhtml abierto
2. **Haz clic derecho** sobre el texto seleccionado

#### Qué verificar - Deben aparecer estos comandos:

- [ ] `🧠 Mejorar texto con IA`
- [ ] `✏️ Corregir ortografía y gramática`
- [ ] `🌐 Traducir texto`
- [ ] `📝 Expandir párrafo`
- [ ] `📄 Resumir texto`

#### Prueba rápida:

1. Selecciona una palabra con error ortográfico
2. Clic derecho → `✏️ Corregir ortografía y gramática`
3. Si no tienes API Key, debe aparecer un input box pidiendo la clave
4. Puedes cancelar con ESC

---

### ✅ **TEST 4: Crear Nuevo EPUB**

1. **Command Palette** (`Ctrl+Shift+P`)
2. **Ejecuta**: `EPUB: Create New EPUB`

#### Flujo visual a verificar:

1. **Input Box para Título**:

   - [ ] Aparece placeholder: "Enter the book title"
   - [ ] Campo obligatorio (no puede estar vacío)
2. **Input Box para Autor**:

   - [ ] Aparece placeholder: "Enter the author name"
   - [ ] Campo obligatorio
3. **Quick Pick para Idioma**:

   - [ ] Lista desplegable con idiomas comunes
   - [ ] Opción "Other..." al final
   - [ ] Si eliges "Other", aparece input box para código personalizado
4. **Input Box para Publisher** (opcional):

   - [ ] Puede dejarse vacío con ESC
5. **Input Box para Rights** (opcional):

   - [ ] Puede dejarse vacío
6. **Diálogo para guardar**:

   - [ ] Se abre selector de archivos
   - [ ] Extensión .epub preseleccionada
   - [ ] Puedes elegir ubicación y nombre

#### Resultado:

- [ ] El EPUB se crea y abre automáticamente
- [ ] Estructura básica visible en Explorer
- [ ] Archivo chapter1.xhtml con contenido de ejemplo

---

### ✅ **TEST 5: Comandos de Estado y Metadatos**

#### 5.1 EPUB Status

1. Con un EPUB abierto, ejecuta: `EPUB: EPUB Status`
2. **Verificar**:
   - [ ] Aparece notificación con la ruta del EPUB
   - [ ] Muestra número de archivos modificados
   - [ ] Indica estado del auto-save

#### 5.2 Show Metadata

1. Ejecuta: `EPUB: Show EPUB Metadata`
2. **Verificar**:
   - [ ] Se abre panel de OUTPUT
   - [ ] Muestra título, autor, idioma, fecha
   - [ ] Formato legible y bien estructurado

#### 5.3 List Modified Files

1. Haz cambios en 2-3 archivos
2. Ejecuta: `EPUB: List Modified Files`
3. **Verificar**:
   - [ ] Quick Pick muestra lista de archivos modificados
   - [ ] Rutas correctas de los archivos
   - [ ] Al seleccionar uno, se abre ese archivo

---

### ✅ **TEST 6: Sistema de Guardado**

#### 6.1 Guardado Manual

1. Haz cambios en varios archivos
2. Ejecuta: `EPUB: Save EPUB File`
3. **Verificar**:
   - [ ] Notificación: "EPUB saved successfully"
   - [ ] Los indicadores de cambios desaparecen
   - [ ] Si hay backup habilitado, mensaje adicional de backup

#### 6.2 Auto-Save Visual

1. Verifica en la barra de estado (abajo):
   - [ ] Debe mostrar estado del auto-save
2. Haz un cambio y espera 2 segundos:
   - [ ] El punto de "sin guardar" desaparece automáticamente
   - [ ] Posible notificación de auto-guardado

---

### ✅ **TEST 7: Configuración de IA**

#### 7.1 Configurar API Key

1. Ejecuta: `EPUB: 🔑 Configurar API Key IA`
2. **Verificar flujo**:
   - [ ] Input box para ingresar API key
   - [ ] Opción de guardar en configuración (Sí/No)
   - [ ] Mensaje de confirmación si se guarda

#### 7.2 Seleccionar Modelo

1. Ejecuta: `EPUB: 🤖 Seleccionar modelo IA`
2. **Verificar**:
   - [ ] Quick Pick con 5 modelos disponibles
   - [ ] Cada modelo muestra nombre y contexto (tokens)
   - [ ] Descripción breve de cada modelo
   - [ ] Al seleccionar, notificación de confirmación

#### 7.3 Información del Modelo

1. Ejecuta: `EPUB: ℹ️ Información del modelo`
2. **Verificar**:
   - [ ] Notificación muestra modelo actual
   - [ ] Información de contexto y descripción

---

### ✅ **TEST 8: Verificar Configuración**

1. **Abre Settings** (`Ctrl+,` o `Cmd+,`)
2. **Busca**: "epub"
3. **Verificar que aparecen**:
   - [ ] `Epub › Auto Save: Enabled` (checkbox)
   - [ ] `Epub › Auto Save: Delay` (número, default 2000)
   - [ ] `Epub › Backup: Enabled` (checkbox)
   - [ ] `Epub › Backup: Max Count` (número, default 5)
   - [ ] `Epub › Ai: Model` (dropdown con modelos)
   - [ ] `Epub › Ai: Openrouter Api Key` (campo de texto)

---

## 🎨 ASPECTOS VISUALES A VERIFICAR

### Iconos y Temas

- [ ] Los archivos EPUB muestran iconos apropiados
- [ ] La estructura de carpetas es clara y navegable
- [ ] Los comandos de IA tienen emojis distintivos
- [ ] Todo es legible en tema claro y oscuro

### Notificaciones ⭐ **MEJORADO en v0.1.8**

- [ ] Las notificaciones aparecen en la barra de estado (abajo) y se auto-eliminan
- [ ] **NO** aparecen notificaciones persistentes que requieran interacción manual
- [ ] Las notificaciones informativas desaparecen automáticamente (2-5 segundos)
- [ ] Solo errores críticos y diálogos informativos detallados permanecen como modales
- [ ] Los errores se muestran en rojo/naranja
- [ ] Los éxitos en azul/verde

### Performance Visual

- [ ] La apertura de EPUBs es fluida
- [ ] No hay "lag" al navegar archivos
- [ ] El auto-save no congela la interfaz
- [ ] Los comandos responden inmediatamente

---

## 📱 ATAJOS DE TECLADO

Verifica que funcionan estos atajos:

- [ ] `Ctrl+Shift+P` → Command Palette
- [ ] `Ctrl+S` → Guardar archivo actual
- [ ] `Ctrl+Shift+S` → Save EPUB File (si está configurado)

---

## 🐛 PROBLEMAS COMUNES A VERIFICAR

### 1. Si no aparecen comandos EPUB:

- Verifica que hay un EPUB abierto como workspace
- Algunos comandos solo funcionan con EPUB activo

### 2. Si los comandos IA no aparecen:

- Verifica que estás en un archivo de texto (.xhtml, .html)
- Debes tener texto seleccionado

### 3. Si el auto-save no funciona:

- Verifica en Settings que está habilitado
- El delay por defecto es 2 segundos

---

## ✍️ CHECKLIST FINAL

### Funcionalidad Core

- [ ] Puedo abrir EPUBs como carpetas virtuales
- [ ] Puedo editar y guardar cambios
- [ ] El auto-save funciona correctamente
- [ ] Puedo crear nuevos EPUBs
- [ ] Los metadatos se muestran correctamente

### Integración IA

- [ ] Los comandos IA aparecen en el menú contextual
- [ ] Puedo configurar la API key
- [ ] Puedo cambiar entre modelos
- [ ] Los errores se manejan elegantemente

### Experiencia Visual

- [ ] La interfaz es intuitiva
- [ ] Los comandos son fáciles de encontrar
- [ ] Las notificaciones son claras
- [ ] No hay elementos visuales rotos

### Performance

- [ ] Todo responde rápidamente
- [ ] No hay congelamientos
- [ ] La navegación es fluida

---

## 📝 NOTAS PARA REPORTAR PROBLEMAS

Si encuentras algún problema, anota:

1. **Qué intentabas hacer**
2. **Qué pasos seguiste**
3. **Qué esperabas que pasara**
4. **Qué pasó realmente**
5. **Algún mensaje de error**
6. **Screenshot si es posible**

---

¡Buena suerte con el testing! 🚀
