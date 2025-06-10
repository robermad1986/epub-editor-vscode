"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AICommands = void 0;
const vscode = require("vscode");
class AICommands {
    constructor(aiService) {
        this.aiService = aiService;
    }
    registerCommands(context) {
        // Comando: Mejorar texto con IA
        context.subscriptions.push(vscode.commands.registerCommand('epub.ai.improveText', async () => {
            await this.handleTextImprovement();
        }));
        // Comando: Corregir gramática
        context.subscriptions.push(vscode.commands.registerCommand('epub.ai.correctGrammar', async () => {
            await this.handleGrammarCorrection();
        }));
        // Comando: Traducir texto
        context.subscriptions.push(vscode.commands.registerCommand('epub.ai.translateText', async () => {
            await this.handleTextTranslation();
        }));
        // Comando: Expandir párrafo
        context.subscriptions.push(vscode.commands.registerCommand('epub.ai.expandParagraph', async () => {
            await this.handleParagraphExpansion();
        }));
        // Comando: Resumir texto
        context.subscriptions.push(vscode.commands.registerCommand('epub.ai.summarizeText', async () => {
            await this.handleTextSummarization();
        }));
        // Comando: Configurar API Key
        context.subscriptions.push(vscode.commands.registerCommand('epub.ai.configureApiKey', async () => {
            await this.configureApiKey();
        }));
        // Comando: Probar conexión IA
        context.subscriptions.push(vscode.commands.registerCommand('epub.ai.testConnection', async () => {
            await this.testConnection();
        }));
        // Comando: Seleccionar modelo IA
        context.subscriptions.push(vscode.commands.registerCommand('epub.ai.selectModel', async () => {
            await this.selectModel();
        }));
        // Comando: Información del modelo
        context.subscriptions.push(vscode.commands.registerCommand('epub.ai.modelInfo', async () => {
            await this.showModelInfo();
        }));
    }
    async getSelectedText() {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('No hay editor activo');
            return undefined;
        }
        const selection = editor.selection;
        if (selection.isEmpty) {
            vscode.window.showWarningMessage('Selecciona el texto que quieres procesar con IA');
            return undefined;
        }
        return editor.document.getText(selection);
    }
    async replaceSelectedText(newText) {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const selection = editor.selection;
        await editor.edit(editBuilder => {
            editBuilder.replace(selection, newText);
        });
    }
    async detectLanguage() {
        // Intentar detectar idioma del archivo o usar configuración
        const config = vscode.workspace.getConfiguration('epub');
        const defaultLanguage = config.get('ai.defaultLanguage') || 'es';
        // TODO: Implementar detección automática de idioma más sofisticada
        return defaultLanguage;
    }
    async handleTextImprovement() {
        const selectedText = await this.getSelectedText();
        if (!selectedText)
            return;
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: '🧠 Mejorando texto con IA...',
            cancellable: false
        }, async () => {
            const language = await this.detectLanguage();
            const response = await this.aiService.improveText(selectedText, language);
            if (response.success && response.content) {
                await this.replaceSelectedText(response.content);
                vscode.window.setStatusBarMessage('✨ Texto mejorado con IA', 3000);
            }
            else {
                vscode.window.showErrorMessage(`Error mejorando texto: ${response.error}`);
            }
        });
    }
    async handleGrammarCorrection() {
        const selectedText = await this.getSelectedText();
        if (!selectedText)
            return;
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: '✏️ Corrigiendo gramática...',
            cancellable: false
        }, async () => {
            const language = await this.detectLanguage();
            const response = await this.aiService.correctGrammar(selectedText, language);
            if (response.success && response.content) {
                await this.replaceSelectedText(response.content);
                vscode.window.setStatusBarMessage('✅ Gramática corregida', 3000);
            }
            else {
                vscode.window.showErrorMessage(`Error corrigiendo gramática: ${response.error}`);
            }
        });
    }
    async handleTextTranslation() {
        const selectedText = await this.getSelectedText();
        if (!selectedText)
            return;
        // Pedir idioma de destino
        const targetLanguage = await vscode.window.showQuickPick([
            { label: 'Inglés', value: 'en' },
            { label: 'Español', value: 'es' },
            { label: 'Francés', value: 'fr' },
            { label: 'Alemán', value: 'de' },
            { label: 'Italiano', value: 'it' },
            { label: 'Portugués', value: 'pt' },
            { label: 'Otro...', value: 'other' }
        ], {
            placeHolder: 'Selecciona el idioma de destino'
        });
        if (!targetLanguage)
            return;
        let finalTargetLanguage = targetLanguage.value;
        if (targetLanguage.value === 'other') {
            const customLang = await vscode.window.showInputBox({
                prompt: 'Ingresa el código del idioma (ej: ja, zh, ru)',
                placeHolder: 'ej: ja'
            });
            if (!customLang)
                return;
            finalTargetLanguage = customLang;
        }
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `🌐 Traduciendo a ${finalTargetLanguage}...`,
            cancellable: false
        }, async () => {
            const response = await this.aiService.translateText(selectedText, finalTargetLanguage);
            if (response.success && response.content) {
                await this.replaceSelectedText(response.content);
                vscode.window.setStatusBarMessage(`🌍 Texto traducido a ${finalTargetLanguage}`, 3000);
            }
            else {
                vscode.window.showErrorMessage(`Error traduciendo texto: ${response.error}`);
            }
        });
    }
    async handleParagraphExpansion() {
        const selectedText = await this.getSelectedText();
        if (!selectedText)
            return;
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: '📝 Expandiendo párrafo...',
            cancellable: false
        }, async () => {
            const language = await this.detectLanguage();
            const response = await this.aiService.expandParagraph(selectedText, language);
            if (response.success && response.content) {
                await this.replaceSelectedText(response.content);
                vscode.window.setStatusBarMessage('📖 Párrafo expandido', 3000);
            }
            else {
                vscode.window.showErrorMessage(`Error expandiendo párrafo: ${response.error}`);
            }
        });
    }
    async handleTextSummarization() {
        const selectedText = await this.getSelectedText();
        if (!selectedText)
            return;
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: '📋 Resumiendo texto...',
            cancellable: false
        }, async () => {
            const language = await this.detectLanguage();
            const response = await this.aiService.summarizeText(selectedText, language);
            if (response.success && response.content) {
                await this.replaceSelectedText(response.content);
                vscode.window.setStatusBarMessage('📄 Texto resumido', 3000);
            }
            else {
                vscode.window.showErrorMessage(`Error resumiendo texto: ${response.error}`);
            }
        });
    }
    async configureApiKey() {
        const apiKey = await vscode.window.showInputBox({
            prompt: 'Ingresa tu API Key de OpenRouter',
            placeHolder: 'sk-or-v1-...',
            password: true,
            ignoreFocusOut: true
        });
        if (!apiKey) {
            return;
        }
        const config = vscode.workspace.getConfiguration('epub');
        await config.update('ai.openrouterApiKey', apiKey, vscode.ConfigurationTarget.Global);
        vscode.window.setStatusBarMessage('🔑 API Key configurada correctamente', 3000);
    }
    async testConnection() {
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: '🧪 Probando conexión con IA...',
            cancellable: false
        }, async () => {
            const isConnected = await this.aiService.testConnection();
            if (isConnected) {
                vscode.window.setStatusBarMessage('✅ Conexión con IA exitosa', 4000);
            }
            else {
                vscode.window.showErrorMessage('❌ No se pudo conectar con IA. Verifica tu API Key.');
            }
        });
    }
    async selectModel() {
        const modelsResponse = await this.aiService.getAvailableModels();
        if (!modelsResponse.success) {
            vscode.window.showErrorMessage('❌ No se pudieron obtener los modelos disponibles');
            return;
        }
        const models = modelsResponse.models;
        const modelItems = Object.keys(models).map(modelId => {
            const model = models[modelId];
            return {
                label: `🤖 ${model.name}`,
                description: `${model.context} • ${model.reasoning ? '🧠 Razonamiento' : '⚡ Estándar'}`,
                detail: model.description,
                id: modelId
            };
        });
        const currentModel = vscode.workspace.getConfiguration('epub').get('ai.model');
        const selectedItem = await vscode.window.showQuickPick(modelItems, {
            placeHolder: `Modelo actual: ${models[currentModel]?.name || currentModel}`,
            title: 'Seleccionar modelo de IA'
        });
        if (selectedItem && selectedItem.id) {
            const config = vscode.workspace.getConfiguration('epub');
            await config.update('ai.model', selectedItem.id, vscode.ConfigurationTarget.Global);
            const selectedModel = models[selectedItem.id];
            vscode.window.showInformationMessage(`🤖 Modelo cambiado a: ${selectedModel.name}`);
        }
    }
    async showModelInfo() {
        const modelInfo = await this.aiService.getCurrentModelInfo();
        vscode.window.showInformationMessage(modelInfo, { modal: true });
    }
}
exports.AICommands = AICommands;
//# sourceMappingURL=aiCommands.js.map