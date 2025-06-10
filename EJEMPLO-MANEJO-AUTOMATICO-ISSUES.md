# Ejemplo de Bug Report que Activaría el Sistema Automático

## 📝 Issue Original del Usuario:

**Título:** `[BUG] AI features not working - API key error`

**Contenido:**
```
**🐛 Describe the bug**
When I try to use any AI feature, I get an error saying "API key not configured" even though I set it up.

**📋 To Reproduce**
1. Go to Command Palette
2. Run "EPUB AI: Configure API Key"
3. Enter my OpenRouter API key
4. Select text in an EPUB file
5. Right-click → "Improve Text with AI"
6. See error: "API key not configured"

**✅ Expected behavior**
The AI should process my text and improve it.

**📱 Environment:**
- VS Code Version: 1.85.0
- Extension Version: 0.1.8
- OS: macOS 14.0
- Python Version: 3.9.0

**🤖 AI Features**
- Selected AI model: Gemini 2.0
- Operation attempted: text improvement
- Text length: 150 characters

**📄 Additional context**
I got my API key from OpenRouter.ai and it shows active in my dashboard.
```

---

## 🤖 Respuesta Automática del Sistema:

### 1. **Auto-etiquetado aplicado:**
- `bug` ✅ (detecta "[BUG]" en título y "error" en contenido)
- `ai` ✅ (detecta "ai model", "api key")
- `backend` ✅ (detecta "python", "api key")

### 2. **Comentario automático generado:**

```markdown
🤖 **AI Issue Detected** - GitHub Copilot Analysis:

🔑 **API Key Issue Detected**

Common solutions:
1. Verify API key is correctly set: `Ctrl+Shift+P` → "EPUB AI: Configure API Key"
2. Test connection: `Ctrl+Shift+P` → "EPUB AI: Test AI Connection"
3. Check OpenRouter account has credits/free tier access
4. Ensure API key has Marketplace permissions

📚 **Additional Resources:**
- [Complete AI Setup Guide](https://github.com/robermad1986/epub-editor-vscode/blob/main/AI-USER-GUIDE.md)
- [Troubleshooting Section](https://github.com/robermad1986/epub-editor-vscode/blob/main/AI-USER-GUIDE.md#troubleshooting)

We'll investigate further and provide a personalized solution soon!
```

### 3. **Si es primera vez del usuario:**

```markdown
👋 Welcome to EPUB Editor! Thanks for your first issue.

🤖 **GitHub Copilot is helping us respond quickly** to issues and feature requests.

📋 **What happens next:**
- We'll review your issue within 24-48 hours
- For bugs: we'll attempt to reproduce and provide a fix
- For features: we'll evaluate feasibility and add to our roadmap

🚀 **Quick resources:**
- [User Guide](https://github.com/robermad1986/epub-editor-vscode/blob/main/readme.md)
- [AI Setup Guide](https://github.com/robermad1986/epub-editor-vscode/blob/main/AI-USER-GUIDE.md)
- [Changelog](https://github.com/robermad1986/epub-editor-vscode/blob/main/CHANGELOG.md)

Feel free to provide additional details if needed!
```

---

## 🎯 Resultado Final:

El usuario recibe **inmediatamente**:
1. ✅ Issue correctamente etiquetado
2. ✅ Respuesta con soluciones específicas para su problema
3. ✅ Enlaces a documentación relevante
4. ✅ Expectativa clara de seguimiento manual

## 📊 Beneficios para ti como mantenedor:

1. **Issues pre-clasificados** por tipo y componente
2. **Soluciones comunes ya proporcionadas** automáticamente
3. **Usuarios educados** sobre recursos disponibles
4. **Reducción de issues duplicados** (usuarios pueden resolver solos)
5. **Más tiempo para problemas complejos** (rutinarios ya resueltos)

## 🔄 Seguimiento Manual con Copilot:

Para casos que requieren tu intervención, tendrás:
- Issue ya etiquetado y categorizado
- Información estructurada del usuario
- Contexto inicial ya proporcionado
- GitHub Copilot disponible para ayudarte a responder

¿Quieres que hagamos una prueba real creando un issue de ejemplo en tu repositorio?
