# 📖 Vista Previa EPUB con epub.js

## Características Implementadas

### ✨ Funcionalidades
- **Vista previa en tiempo real** de archivos EPUB
- **Navegación interactiva** por páginas y capítulos
- **Controles intuitivos** con botones y atajos de teclado
- **Integración completa** con VS Code (temas, colores)
- **Panel dedicado** en la interfaz de VS Code

### 🎮 Controles de Navegación
- **Botones:** Anterior ◄ / Siguiente ►
- **Teclado:** Flechas izquierda/derecha
- **Mouse/Touch:** Clic en lado izquierdo/derecho de la página
- **Información:** Muestra capítulo actual y total

### 🔧 Comandos Disponibles
- `EPUB: Vista Previa EPUB` - Abre la vista previa
- Menú contextual en archivos .epub
- Botón en toolbar del editor

## Arquitectura Técnica

### 📁 Estructura de Archivos
```
src/preview/
├── epubPreviewProvider.ts  # WebView Provider
├── epubPreview.html        # Template HTML (generado)
├── epubPreview.js          # Lógica JavaScript
└── epubPreview.css         # Estilos CSS
```

### 🔄 Flujo de Datos
1. **Usuario ejecuta comando** → Selecciona archivo EPUB
2. **Extension lee archivo** → Convierte a base64
3. **WebView recibe datos** → epub.js procesa el archivo
4. **Rendition se crea** → Muestra contenido en pantalla
5. **Usuario navega** → Eventos se sincronizan

### 📦 Dependencias
- **epub.js v0.3.93** - Renderizado EPUB
- **VS Code WebView API** - Interfaz de usuario
- **FileSystem API** - Lectura de archivos

## Integración con EPUB Editor

### 🔗 Conexiones Existentes
- **Compatible** con FileSystemProvider EPUB
- **Reutiliza** lógica de detección de archivos
- **Mantiene** consistencia de UI/UX
- **Respeta** configuraciones de usuario

### 🎨 Temas y Estilos
- **Auto-adapta** a tema claro/oscuro de VS Code
- **Variables CSS** de VS Code integradas
- **Consistencia visual** con resto de la extensión

## Uso

### 📖 Abrir Vista Previa
1. **Archivo EPUB en explorer** → Clic derecho → "Vista Previa EPUB"
2. **Archivo EPUB abierto** → Botón en toolbar
3. **Command Palette** → "EPUB: Vista Previa EPUB"

### 🎯 Navegación
- **Páginas:** Usar controles o teclas de flecha
- **Capítulos:** Información mostrada automáticamente
- **Zoom:** Manejado por epub.js automáticamente

## Próximas Mejoras

### 🔮 Funcionalidades Futuras
- [ ] Sincronización con editor activo
- [ ] Marcadores y notas
- [ ] Búsqueda dentro del EPUB
- [ ] Split view (editor + preview)
- [ ] Tabla de contenidos interactiva
- [ ] Configuraciones de lectura (fuente, tamaño)

### 🛠️ Mejoras Técnicas
- [ ] Caching de EPUBs cargados
- [ ] Lazy loading de capítulos
- [ ] Optimización de rendimiento
- [ ] Soporte offline completo

---

**Estado:** ✅ Implementado y funcional  
**Versión:** v0.1.14  
**Fecha:** Julio 2, 2025
