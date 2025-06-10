# 🧠 Guía de Usuario - Funcionalidades de IA v0.1.7

## 🚀 Introducción

EPUB Editor v0.1.7 introduce un **asistente de IA nativo** especializado en contenido editorial con soporte para múltiples modelos de IA gratuitos. Esta guía te ayudará a configurar y usar las nuevas funcionalidades de inteligencia artificial.

## 📋 Tabla de Contenidos

1. [Configuración Inicial](#-configuración-inicial)
2. [Selección de Modelos de IA](#-selección-de-modelos-de-ia)
3. [Funcionalidades de IA](#-funcionalidades-de-ia)
4. [Uso Paso a Paso](#-uso-paso-a-paso)
5. [Comandos Disponibles](#-comandos-disponibles)
6. [Solución de Problemas](#-solución-de-problemas)

## ⚙️ Configuración Inicial

### 1. Obtener API Key de OpenRouter

1. **Visita [OpenRouter.ai](https://openrouter.ai)**
2. **Crea una cuenta** o inicia sesión
3. **Ve a API Keys** en tu dashboard
4. **Genera una nueva API Key**
5. **Copia la clave** (formato: `sk-or-v1-...`)

### 2. Configurar en VS Code

#### Opción A: Configuración Automática (Recomendada)
1. Abre la **Paleta de Comandos** (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Busca: **"EPUB AI: Configurar API Key"**
3. Pega tu API Key
4. Confirma guardar en configuración

#### Opción B: Configuración Manual
1. Abre **VS Code Settings** (`Ctrl+,` / `Cmd+,`)
2. Busca: `epub.ai.openrouterApiKey`
3. Pega tu API Key
4. Guarda los cambios

### 3. Verificar Conexión

1. Ejecuta: **"EPUB AI: Probar conexión IA"**
2. Deberías ver: ✅ "Conexión con IA exitosa"

## 🤖 Selección de Modelos de IA

### Modelos Disponibles (Gratuitos)

#### 🥇 **Gemini 2.0 Flash Experimental** (Por defecto)
- **Contexto**: 1M tokens
- **Ventajas**: Modelo más reciente de Google, excelente para textos largos
- **Ideal para**: Novelas, documentos extensos

#### 🏆 **Phi-3 Mini 128K**
- **Contexto**: 128K tokens  
- **Ventajas**: Modelo compacto con gran ventana de contexto
- **Ideal para**: Capítulos largos, corrección detallada

#### 🚀 **Llama 3.2 3B**
- **Contexto**: 128K tokens
- **Ventajas**: Modelo eficiente de Meta, buen balance
- **Ideal para**: Uso general, textos medianos

#### 🌐 **Qwen 2.5 7B**
- **Contexto**: 32K tokens
- **Ventajas**: Excelente para idiomas múltiples
- **Ideal para**: Traducciones, contenido multilingüe

#### ⚡ **Zephyr 7B Beta**
- **Contexto**: 32K tokens
- **Ventajas**: Optimizado para seguimiento de instrucciones
- **Ideal para**: Tareas específicas, prompts personalizados

### Cambiar Modelo de IA

1. **Comando**: `EPUB AI: Seleccionar modelo IA`
2. **Descripción**: Muestra lista de modelos con información detallada
3. **Selección**: Elige el modelo más adecuado para tu tarea
4. **Información**: Usa `EPUB AI: Información del modelo` para ver detalles

## 🤖 Funcionalidades de IA

### 📝 **Mejorar Texto con IA**
- **Qué hace**: Mejora la fluidez narrativa y estilo literario
- **Cuándo usar**: Para pulir párrafos, mejorar expresión y ritmo
- **Ejemplo**: Transforma texto simple en prosa más elegante

### ✏️ **Corrección Ortográfica y Gramatical**
- **Qué hace**: Corrige errores sin cambiar el estilo
- **Cuándo usar**: Revisión final de manuscritos
- **Ejemplo**: Detecta errores sutiles que otros correctores pasan por alto

### 🌐 **Traducción de Texto**
- **Qué hace**: Traduce manteniendo formato EPUB
- **Cuándo usar**: Localización de libros a otros idiomas
- **Ejemplo**: Traduce capítulos completos preservando estructura HTML

### 📖 **Expandir Párrafo**
- **Qué hace**: Añade detalles y enriquece descripciones
- **Cuándo usar**: Cuando necesitas más contenido o profundidad
- **Ejemplo**: Convierte una descripción básica en una rica en detalles

### 📄 **Resumir Texto**
- **Qué hace**: Crea resúmenes concisos manteniendo puntos clave
- **Cuándo usar**: Para sinopsis o resúmenes de capítulos
- **Ejemplo**: Transforma páginas completas en párrafos informativos

## 📚 Uso Paso a Paso

### Para Autores

#### **Escribiendo un Nuevo Capítulo**
1. **Abre tu EPUB** en VS Code con EPUB Editor
2. **Navega al archivo** de capítulo (ej: `Text/capitulo_01.xhtml`)
3. **Escribe tu borrador** inicial
4. **Selecciona párrafos** que quieras mejorar
5. **Clic derecho** → **"🧠 Mejorar texto con IA"**
6. **Revisa el resultado** y acepta o ajusta según necesites

#### **Revisión Final**
1. **Selecciona todo el capítulo** (`Ctrl+A` / `Cmd+A`)
2. **Clic derecho** → **"✏️ Corregir ortografía y gramática"**
3. **Revisa los cambios** y guarda

### Para Editores

#### **Corrección de Manuscritos**
1. **Abre el EPUB** del autor
2. **Revisa párrafo por párrafo**:
   - Selecciona texto problemático
   - Usa **"🧠 Mejorar texto con IA"** para sugerencias
   - Aplica **"✏️ Corregir ortografía y gramática"** donde sea necesario
3. **Documenta cambios** en archivos separados

#### **Localización/Traducción**
1. **Selecciona secciones** para traducir
2. **Clic derecho** → **"🌐 Traducir texto"**
3. **Elige idioma destino**
4. **Revisa y ajusta** la traducción según contexto cultural

### Para Publishers

#### **Creación de Sinopsis**
1. **Selecciona capítulos completos**
2. **Usa "📄 Resumir texto"** para cada capítulo
3. **Combina resúmenes** para crear sinopsis general
4. **Refina con "🧠 Mejorar texto con IA"**

## 🎮 Comandos Disponibles

### Menú Contextual (Clic Derecho)
Disponibles cuando tienes **texto seleccionado** en archivos EPUB:

| Comando | Descripción | Icono |
|---------|-------------|-------|
| **Mejorar texto con IA** | Mejora fluidez y estilo | 🧠 |
| **Corregir ortografía y gramática** | Corrección sin cambiar estilo | ✏️ |
| **Traducir texto** | Traducción contextual | 🌐 |
| **Expandir párrafo** | Añadir detalles y descripción | 📝 |
| **Resumir texto** | Crear resumen conciso | 📄 |

### Paleta de Comandos
Disponibles en **Command Palette** (`Ctrl+Shift+P` / `Cmd+Shift+P`):

| Comando | Descripción | Icono |
|---------|-------------|-------|
| `EPUB AI: Configurar API Key` | Configurar credenciales IA | 🔑 |
| `EPUB AI: Probar conexión IA` | Verificar conectividad | 🧪 |
| `EPUB AI: Seleccionar modelo IA` | Cambiar modelo de IA | 🤖 |
| `EPUB AI: Información del modelo` | Ver detalles del modelo actual | ℹ️ |

### Configuraciones

| Setting | Descripción | Valor Predeterminado |
|---------|-------------|---------------------|
| `epub.ai.openrouterApiKey` | Tu API Key de OpenRouter | `""` |
| `epub.ai.model` | Modelo de IA a utilizar | `"google/gemini-2.0-flash-exp:free"` |
| `epub.ai.defaultLanguage` | Idioma para operaciones IA | `"es"` |
| `epub.ai.enabled` | Habilitar funcionalidades IA | `true` |

## 🔧 Solución de Problemas

### ❌ "API Key de OpenRouter requerida"

**Solución**:
1. Configura tu API Key siguiendo la [Configuración Inicial](#-configuración-inicial)
2. Verifica que la clave sea válida en OpenRouter.ai

### ❌ "Error ejecutando IA: No such file or directory"

**Solución**:
1. Instala Python 3.7+ en tu sistema
2. En macOS: `brew install python3`
3. Verifica con: `python3 --version`

### ❌ "Error procesando respuesta de IA"

**Solución**:
1. Verifica tu conexión a internet
2. Comprueba que tienes créditos en OpenRouter
3. Intenta con texto más corto

### ❌ "Timeout: La operación de IA tardó demasiado"

**Solución**:
1. Reduce la cantidad de texto seleccionado
2. Verifica tu conexión a internet
3. Intenta nuevamente en unos minutos

### ⚠️ Los comandos de IA no aparecen en el menú contextual

**Verificaciones**:
1. Asegúrate de que el archivo tiene esquema `epub://`
2. Debe haber texto seleccionado
3. Verifica que `epub.ai.enabled` esté en `true`

## 💡 Consejos y Mejores Prácticas

### ✨ **Para Mejores Resultados**

1. **Selecciona párrafos completos** en lugar de frases sueltas
2. **Revisa siempre** las sugerencias de IA antes de aceptar
3. **Usa idioma consistente** en tu configuración
4. **Combina comandos**: primero mejora, luego corrige gramática

### 🎯 **Flujo de Trabajo Recomendado**

```
1. Escribir borrador → 2. Mejorar con IA → 3. Corregir gramática → 4. Revisión manual
```

### 💰 **Gestión de Costos**

- **OpenRouter cobra por uso** (muy económico)
- **Selecciona solo texto necesario** para optimizar costos
- **Revisa tu uso** en el dashboard de OpenRouter

## 🆘 Soporte

¿Problemas con las funcionalidades de IA?

1. **Revisa esta guía** completa
2. **Verifica configuración** de API Key
3. **Consulta logs** en VS Code Developer Console
4. **Reporta issues** en GitHub con detalles específicos

---

**🎉 ¡Felicidades! Ya tienes acceso al asistente de IA más avanzado para edición de EPUB.**

> **Próximamente en v0.3.0**: Panel de chat IA, prompts personalizados y plantillas especializadas por género literario.
