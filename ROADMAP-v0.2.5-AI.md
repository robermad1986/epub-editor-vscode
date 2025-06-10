# 🧠 Roadmap v0.2.5 - Integración del Asistente de Contenido IA

## 🎯 Objetivo Principal
Convertir EPUB Editor en la primera extensión VS Code con asistente de IA nativo para creación de contenido editorial, posicionándola como diferenciador clave en el mercado.

## 🔍 Estado Actual de GitHub Copilot
- ❌ **GitHub Copilot NO está integrado** en la extensión actual
- ✅ **Oportunidad identificada**: Crear nuestro propio asistente IA especializado en contenido editorial
- ✅ **Ventaja competitiva**: IA específica para EPUB/libros vs. IA genérica de código

## 📋 Checklist de Implementación

### 🔗 **1. Puente de Comunicación con Backend Python**
- [ ] **Crear módulo openrouter_client.py**
  - [ ] Implementar cliente para OpenRouter API
  - [ ] Gestionar autenticación con API Key
  - [ ] Manejar diferentes tipos de prompts (corrección, mejora, traducción)
  - [ ] Sistema de fallback y manejo de errores
  
- [ ] **Integración TypeScript ↔ Python**
  - [ ] Implementar lógica child_process en la extensión
  - [ ] Gestionar paso de texto desde TypeScript a Python
  - [ ] Recibir y procesar respuesta del backend
  - [ ] Manejo de timeout y errores de conexión

### 🖱️ **2. Comandos de IA Contextuales**
- [ ] **Menú contextual del editor (clic derecho)**
  - [ ] `epub.ai.improveText` - Mejorar texto con IA
  - [ ] `epub.ai.correctGrammar` - Corregir ortografía y gramática
  - [ ] `epub.ai.translateText` - Traducir texto seleccionado
  - [ ] `epub.ai.expandParagraph` - Expandir párrafo
  - [ ] `epub.ai.summarizeText` - Resumir texto seleccionado

- [ ] **Funcionalidad de reemplazo**
  - [ ] Detectar texto seleccionado
  - [ ] Enviar al backend con prompt específico
  - [ ] Reemplazar texto original con sugerencia IA
  - [ ] Opción de deshacer cambios

### 🎛️ **3. Panel de Interacción con IA**
- [ ] **Nueva Vista en Panel Lateral**
  - [ ] Crear webview panel personalizado
  - [ ] Campo de texto para prompts personalizados
  - [ ] Historial de conversaciones
  - [ ] Botones de acceso rápido a prompts comunes

- [ ] **Prompts Predefinidos para Editorial**
  - [ ] "Mejorar fluidez narrativa"
  - [ ] "Corregir consistencia de personajes"
  - [ ] "Sugerir transiciones entre capítulos"
  - [ ] "Revisar tono y estilo"
  - [ ] "Generar sinopsis del capítulo"

### ⚙️ **4. Configuración de API Key**
- [ ] **Configuración Segura en VS Code**
  - [ ] Nuevo setting: `epub.ai.openrouterApiKey`
  - [ ] Almacenamiento seguro usando Secret Storage API
  - [ ] Validación de API Key al configurar
  - [ ] Mensajes informativos sobre configuración

- [ ] **Gestión de Configuración**
  - [ ] Comando para configurar API Key
  - [ ] Comando para probar conexión
  - [ ] Indicador visual de estado de conexión IA

## 🏗️ Arquitectura Técnica

### 📁 **Estructura de Archivos Nueva**
```
src/
├── extension.ts               # Archivo principal (existente)
├── fileSystemProvider.ts     # Provider EPUB (existente)
├── ai/
│   ├── aiService.ts          # Servicio principal de IA
│   ├── openrouterClient.ts   # Cliente TypeScript para Python
│   ├── aiCommands.ts         # Comandos contextuales IA
│   └── aiPanel.ts           # Panel de chat IA
└── python/
    └── openrouter_client.py  # Backend Python
```

### 🔄 **Flujo de Datos**
1. **Usuario selecciona texto** → Comando IA contextual
2. **TypeScript** → Procesa texto y tipo de operación
3. **child_process** → Llama script Python con parámetros
4. **Python** → Envía request a OpenRouter API
5. **OpenRouter** → Devuelve respuesta IA
6. **Python** → Retorna resultado a TypeScript
7. **TypeScript** → Reemplaza texto en editor

## 🎨 **Comandos del Package.json**
```json
{
  "commands": [
    {
      "command": "epub.ai.improveText",
      "title": "🧠 Mejorar texto con IA",
      "category": "EPUB AI"
    },
    {
      "command": "epub.ai.correctGrammar", 
      "title": "✏️ Corregir ortografía y gramática",
      "category": "EPUB AI"
    },
    {
      "command": "epub.ai.translateText",
      "title": "🌐 Traducir texto",
      "category": "EPUB AI"
    },
    {
      "command": "epub.ai.chatPanel",
      "title": "💬 Abrir chat IA",
      "category": "EPUB AI"
    },
    {
      "command": "epub.ai.configureApiKey",
      "title": "🔑 Configurar API Key",
      "category": "EPUB AI"
    }
  ]
}
```

## 🎯 **Criterios de Éxito v0.2.5**

### ✅ **Funcional**
- [ ] API Key se configura y almacena de forma segura
- [ ] Comandos contextuales funcionan con texto seleccionado
- [ ] Panel de chat IA permite conversaciones fluidas
- [ ] Backend Python se comunica correctamente con OpenRouter
- [ ] Manejo robusto de errores y timeouts

### 🚀 **Experiencia de Usuario**
- [ ] Integración transparente con flujo de edición EPUB
- [ ] Respuestas IA en menos de 5 segundos
- [ ] Interfaz intuitiva y no intrusiva
- [ ] Feedback visual claro durante procesamiento

### 📊 **Técnico**
- [ ] Código modular y mantenible
- [ ] Tests unitarios para funciones críticas
- [ ] Documentación completa de API
- [ ] Compatible con VS Code 1.80.0+

## 🚀 **Fases de Implementación**

### **Fase 1: Backend y Comunicación** (Semana 1)
1. Crear backend Python con OpenRouter
2. Implementar comunicación TypeScript ↔ Python
3. Configuración segura de API Key

### **Fase 2: Comandos Contextuales** (Semana 2)
1. Implementar comandos de menú contextual
2. Integrar con sistema de reemplazo de texto
3. Tests de funcionalidad básica

### **Fase 3: Panel de Chat** (Semana 3)
1. Crear webview panel personalizado
2. Implementar historial de conversaciones
3. Prompts predefinidos para editorial

### **Fase 4: Pulido y Testing** (Semana 4)
1. Testing exhaustivo de todas las funciones
2. Documentación de usuario
3. Preparación para release v0.2.5

## 💡 **Ventajas Competitivas**

1. **Primera extensión EPUB con IA nativa**: Diferenciador único en el mercado
2. **IA especializada en contenido editorial**: No es IA genérica, está optimizada para libros
3. **Integración perfecta con flujo EPUB**: Los usuarios no cambian de herramienta
4. **Feedback temprano**: Lanzar antes que funcionalidades complejas de v0.3.0

## 🎯 **Siguiente Paso**
¿Comenzamos con la **Fase 1** implementando el backend Python y la comunicación con TypeScript?
