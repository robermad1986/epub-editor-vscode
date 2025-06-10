# Instrucciones de Contexto para GitHub Copilot - EPUB Editor

## 1. Objetivo del Proyecto

El objetivo de este repositorio es construir una extensión para Visual Studio Code llamada "EPUB Editor" que permite a los usuarios:

- **Abrir, crear y editar archivos .epub** como si fueran directorios de un espacio de trabajo virtual
- **Editar contenido EPUB** (XHTML, CSS, XML) directamente en VS Code
- **Usar funciones de IA** para mejorar contenido editorial con múltiples modelos de lenguaje
- **Auto-guardar cambios** con sistema de backup automático
- **Validar y gestionar metadatos** EPUB de forma interactiva

## 2. Arquitectura y Patrones Clave

### Sistema de Archivos Virtual

La arquitectura central se basa en la implementación de un **FileSystemProvider** de la API de VS Code. Esta es la pieza más importante del proyecto. **NO estamos usando** un CustomEditorProvider ni una WebView como vista principal. La experiencia de usuario debe ser la de un sistema de archivos nativo.

- **Lectura de EPUB**: Se utiliza la librería `jszip` para leer el contenido del archivo .epub (que es un ZIP) en memoria
- **Escritura de EPUB**: Cuando un usuario guarda un archivo interno, el FileSystemProvider actualiza el objeto JSZip en memoria y escribe el archivo .epub completo de vuelta al disco
- **Auto-guardado**: Sistema automático que detecta cambios y guarda después de 2 segundos de inactividad
- **Backup**: Mantiene hasta 5 copias de backup con marca de tiempo

### Integración de IA

- **Backend Python**: Script `openrouter_client.py` que maneja las llamadas a la API de OpenRouter
- **Comunicación**: Uso de `child_process.spawn` para ejecutar Python desde TypeScript
- **Modelos soportados**: 5 modelos gratuitos (Gemini 2.0, Phi-3, Llama 3.2, Qwen 2.5, Zephyr 7B)
- **Funciones**: Mejora de texto, corrección gramatical, traducción, expansión y resumen

## 3. Pila Tecnológica

### Core

- **Lenguaje**: TypeScript (estricto)
- **Framework**: API de Visual Studio Code (vscode)
- **Runtime**: Node.js

### Librerías principales

- **jszip**: Manejo de archivos EPUB (ZIP)
- **uuid**: Generación de identificadores únicos
- **xml2js**: Parsing de archivos XML de metadatos

### Backend IA

- **Python 3.7+**: Backend para procesamiento de IA
- **requests**: Cliente HTTP para OpenRouter API
- **json**: Manejo de respuestas API

### Herramientas de desarrollo

- **vsce**: Empaquetado de la extensión
- **TypeScript Compiler**: Compilación y type checking
- **ESLint**: Linting del código

## 4. Archivos Importantes

### Core de la extensión

- `src/extension.ts`: Punto de entrada principal. Registra el FileSystemProvider, comandos y servicios de IA
- `src/fileSystemProvider.ts`: El corazón del proyecto. Contiene toda la lógica de lectura/escritura del EPUB
- `package.json`: Define contribuciones, comandos, configuraciones y metadatos de la extensión

### Sistema de IA

- `src/ai/aiService.ts`: Servicio principal de IA que gestiona la comunicación con Python
- `src/ai/aiCommands.ts`: Comandos de IA registrados en VS Code
- `src/python/openrouter_client.py`: Cliente Python para la API de OpenRouter

### Documentación

- `readme.md`: Documentación principal con features, instalación y uso
- `CHANGELOG.md`: Historial detallado de cambios por versión
- `AI-USER-GUIDE.md`: Guía completa de uso de funcionalidades de IA
- `prompt.md`: Este archivo - contexto para asistentes de IA

### Archivos de seguimiento

- `ROADMAP-v0.2.5-AI.md`: Planificación de funcionalidades de IA
- `SAVE-FUNCTIONALITY-COMPLETE.md`: Documentación de la funcionalidad de guardado
- `test-*.md`: Documentación de pruebas y validación

## 5. Convenciones de Código

### TypeScript

- **Tipado estricto**: Siempre usar tipos explícitos, evitar `any`
- **async/await**: Para todas las operaciones asíncronas
- **Interfaces**: Definir interfaces para todos los objetos de datos
- **Enums**: Usar enums para constantes relacionadas

### Documentación

- **JSDoc**: Comentarios para todas las funciones y clases públicas
- **Comentarios inline**: En inglés, explicando lógica compleja
- **TODOs**: Marcar con `// TODO:` las mejoras pendientes

### Nomenclatura

- **Variables y funciones**: camelCase en inglés
- **Clases e interfaces**: PascalCase
- **Constantes**: UPPER_SNAKE_CASE
- **Archivos**: camelCase para TypeScript, kebab-case para documentación

### Estructura de archivos

```
src/
├── extension.ts          # Punto de entrada
├── fileSystemProvider.ts # Core del sistema de archivos
├── ai/                   # Módulo de IA
│   ├── aiService.ts     # Servicio principal
│   └── aiCommands.ts    # Comandos VS Code
└── python/              # Backend Python
    └── openrouter_client.py
```

## 6. Flujos de Trabajo Principales

### Abrir un EPUB

1. Usuario ejecuta comando "Open as Virtual Folder"
2. `extension.ts` llama a `epubFs.loadEpubFile()`
3. `fileSystemProvider.ts` lee el archivo con JSZip
4. Se construye la estructura de directorios virtual
5. VS Code muestra el EPUB como carpeta de trabajo

### Editar y Guardar

1. Usuario edita un archivo en el editor
2. `FileSystemProvider.writeFile()` actualiza el contenido en memoria
3. Auto-save se activa después de 2 segundos
4. `saveAllChanges()` escribe el EPUB al disco
5. Se crea backup automático si está habilitado

### Usar IA

1. Usuario selecciona texto y hace clic derecho
2. Elige una función de IA del menú contextual
3. `AICommands` procesa la solicitud
4. `AIService` ejecuta el script Python con los parámetros
5. Python llama a OpenRouter API y devuelve el resultado
6. El texto se reemplaza en el editor

## 7. Estado Actual del Proyecto

### ✅ Completado (v0.1.8)

- Sistema de archivos virtual completo
- Creación y edición de EPUBs
- Auto-guardado con backups
- Integración de IA con 5 modelos
- Comandos contextuales de IA
- Gestión de metadatos
- **🆕 Notificaciones no intrusivas**
- **🆕 Apertura directa desde menú contextual**
- Documentación completa

### 🚧 En Desarrollo (v0.2.0)

- Vista previa en tiempo real
- Validación con epubcheck
- Editor visual de metadatos
- Gestión avanzada de contenido

### 🔮 Planificado (v0.3.0)

- Plantillas de EPUB
- Soporte multimedia
- Exportación a otros formatos
- Herramientas avanzadas de autor

## 8. Consideraciones Especiales

### Rendimiento

- Los EPUBs grandes (>50MB) pueden tardar en cargar
- El auto-save está optimizado para no bloquear la UI
- Las operaciones de IA tienen timeout de 60 segundos

### Compatibilidad

- Requiere VS Code 1.80.0 o superior
- Python 3.7+ para funciones de IA
- Compatible con EPUB 2.0 y 3.0

### Seguridad

- Las API keys se almacenan en la configuración de VS Code
- No se envían datos a servicios externos sin consentimiento
- Los backups se almacenan localmente

## 9. Debugging y Testing

### Comandos útiles

```bash
# Compilar la extensión
npm run compile

# Ejecutar en modo desarrollo
F5 en VS Code

# Empaquetar la extensión
vsce package

# Instalar localmente
code --install-extension epub-editor-0.1.7.vsix
```

### Logs importantes

- Buscar `[EPUB]` en la consola para logs del FileSystemProvider
- Buscar `[AI Service]` para logs de operaciones de IA
- Los errores de Python se muestran en stderr

## 10. Contribuir al Proyecto

Al trabajar en este proyecto:

1. Mantén la arquitectura basada en FileSystemProvider
2. Documenta nuevas funcionalidades en los archivos .md correspondientes
3. Actualiza el CHANGELOG.md con cada cambio significativo
4. Asegúrate de que el código compile sin warnings
5. Prueba con EPUBs reales de diferentes tamaños y estructuras

---

**Nota para Copilot**: Este proyecto prioriza la experiencia nativa de VS Code. Todas las sugerencias deben mantener la filosofía de trabajar con EPUBs como si fueran carpetas normales, sin interfaces web complejas o editores personalizados.
