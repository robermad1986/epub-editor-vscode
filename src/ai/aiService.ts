import * as vscode from 'vscode';
import { spawn } from 'child_process';
import * as path from 'path';

export interface AIResponse {
    success: boolean;
    content?: string;
    error?: string;
    originalText?: string;
    action?: string;
}

export interface AIRequest {
    text: string;
    action: 'improve' | 'correct' | 'translate' | 'expand' | 'summarize' | 'custom';
    language?: string;
    targetLanguage?: string;
    customPrompt?: string;
}

export class AIService {
    private pythonPath: string;
    private scriptPath: string;

    constructor(context: vscode.ExtensionContext) {
        // Ruta al script de Python
        this.scriptPath = path.join(context.extensionPath, 'src', 'python', 'openrouter_client.py');
        
        // Determinar ruta de Python basada en el sistema operativo
        this.pythonPath = this.detectPythonPath();
    }

    private detectPythonPath(): string {
        // Intentar diferentes rutas de Python comunes
        const possiblePaths = ['python3', 'python', '/usr/bin/python3', '/usr/local/bin/python3'];
        
        // En producción, usar 'python3' como predeterminado
        // TODO: Implementar detección automática más robusta si es necesario
        return 'python3';
    }

    private async getApiKey(): Promise<string | undefined> {
        // Intentar obtener la API Key de la configuración
        const config = vscode.workspace.getConfiguration('epub');
        let apiKey = config.get<string>('ai.openrouterApiKey');

        if (!apiKey) {
            // Si no hay API Key configurada, pedirla al usuario
            apiKey = await vscode.window.showInputBox({
                prompt: 'Ingresa tu API Key de OpenRouter',
                placeHolder: 'sk-or-v1-...',
                password: true,
                ignoreFocusOut: true
            });

            if (apiKey) {
                // Preguntar si quiere guardar la API Key
                const saveKey = await vscode.window.showQuickPick(['Sí', 'No'], {
                    placeHolder: '¿Guardar API Key en la configuración de VS Code?'
                });

                if (saveKey === 'Sí') {
                    await config.update('ai.openrouterApiKey', apiKey, vscode.ConfigurationTarget.Global);
                    vscode.window.showInformationMessage('API Key guardada en la configuración de VS Code');
                }
            }
        }

        return apiKey;
    }

    private getSelectedModel(): string {
        const config = vscode.workspace.getConfiguration('epub');
        return config.get<string>('ai.model', 'google/gemini-2.0-flash-exp:free');
    }

    async processText(request: AIRequest): Promise<AIResponse> {
        const apiKey = await this.getApiKey();
        
        if (!apiKey) {
            return {
                success: false,
                error: 'API Key de OpenRouter requerida'
            };
        }

        const selectedModel = this.getSelectedModel();

        return new Promise((resolve) => {
            const args = [
                this.scriptPath,
                '--api-key', apiKey,
                '--action', request.action,
                '--text', request.text,
                '--model', selectedModel
            ];

            // Agregar argumentos opcionales
            if (request.language) {
                args.push('--language', request.language);
            }

            if (request.targetLanguage) {
                args.push('--target-language', request.targetLanguage);
            }

            if (request.customPrompt) {
                args.push('--custom-prompt', request.customPrompt);
            }

            console.log('[AI Service] Executing Python script with args:', args);

            const pythonProcess = spawn(this.pythonPath, args, {
                stdio: ['pipe', 'pipe', 'pipe']
            });

            let stdout = '';
            let stderr = '';

            pythonProcess.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            pythonProcess.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            pythonProcess.on('close', (code) => {
                if (code !== 0) {
                    console.error('[AI Service] Python process error:', stderr);
                    resolve({
                        success: false,
                        error: `Error ejecutando IA: ${stderr || 'Proceso terminado con código ' + code}`
                    });
                    return;
                }

                try {
                    const response: AIResponse = JSON.parse(stdout);
                    console.log('[AI Service] Response received:', response);
                    resolve(response);
                } catch (error) {
                    console.error('[AI Service] Error parsing JSON response:', error);
                    resolve({
                        success: false,
                        error: 'Error procesando respuesta de IA'
                    });
                }
            });

            pythonProcess.on('error', (error) => {
                console.error('[AI Service] Process spawn error:', error);
                resolve({
                    success: false,
                    error: `Error iniciando proceso Python: ${error.message}`
                });
            });

            // Timeout de 60 segundos
            setTimeout(() => {
                pythonProcess.kill();
                resolve({
                    success: false,
                    error: 'Timeout: La operación de IA tardó demasiado'
                });
            }, 60000);
        });
    }

    async improveText(text: string, language: string = 'es'): Promise<AIResponse> {
        return this.processText({
            text,
            action: 'improve',
            language
        });
    }

    async correctGrammar(text: string, language: string = 'es'): Promise<AIResponse> {
        return this.processText({
            text,
            action: 'correct',
            language
        });
    }

    async translateText(text: string, targetLanguage: string, sourceLanguage: string = 'auto'): Promise<AIResponse> {
        return this.processText({
            text,
            action: 'translate',
            language: sourceLanguage,
            targetLanguage
        });
    }

    async expandParagraph(text: string, language: string = 'es'): Promise<AIResponse> {
        return this.processText({
            text,
            action: 'expand',
            language
        });
    }

    async summarizeText(text: string, language: string = 'es'): Promise<AIResponse> {
        return this.processText({
            text,
            action: 'summarize',
            language
        });
    }

    async customPrompt(text: string, prompt: string, language: string = 'es'): Promise<AIResponse> {
        return this.processText({
            text,
            action: 'custom',
            customPrompt: prompt,
            language
        });
    }

    async testConnection(): Promise<boolean> {
        const apiKey = await this.getApiKey();
        
        if (!apiKey) {
            return false;
        }

        const testResponse = await this.processText({
            text: 'Test',
            action: 'improve',
            language: 'es'
        });

        return testResponse.success;
    }

    async getAvailableModels(): Promise<any> {
        const apiKey = await this.getApiKey();
        
        if (!apiKey) {
            return { success: false, error: 'API Key requerida' };
        }

        return new Promise((resolve) => {
            const args = [
                this.scriptPath,
                '--api-key', apiKey,
                '--action', 'list-models'
            ];

            const pythonProcess = spawn(this.pythonPath, args, {
                stdio: ['pipe', 'pipe', 'pipe']
            });

            let stdout = '';
            let stderr = '';

            pythonProcess.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            pythonProcess.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            pythonProcess.on('close', (code) => {
                if (code !== 0) {
                    resolve({ success: false, error: stderr });
                    return;
                }

                try {
                    const response = JSON.parse(stdout);
                    resolve(response);
                } catch (error) {
                    resolve({ success: false, error: 'Error parsing models response' });
                }
            });
        });
    }

    async getCurrentModelInfo(): Promise<string> {
        const selectedModel = this.getSelectedModel();
        const modelsResponse = await this.getAvailableModels();
        
        if (!modelsResponse.success) {
            return `Modelo actual: ${selectedModel}`;
        }

        const modelInfo = modelsResponse.models[selectedModel];
        if (modelInfo) {
            return `🤖 **${modelInfo.name}**\n📊 Contexto: ${modelInfo.context}\n🧠 Razonamiento: ${modelInfo.reasoning ? 'Sí' : 'No'}\n📝 ${modelInfo.description}`;
        }

        return `Modelo actual: ${selectedModel} (información no disponible)`;
    }
}
