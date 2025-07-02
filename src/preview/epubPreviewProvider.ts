import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export class EpubPreviewProvider implements vscode.WebviewViewProvider {
	public static readonly viewType = 'epub.preview';
	private _view?: vscode.WebviewView;
	private _currentEpubPath?: string;
	private _disposables: vscode.Disposable[] = [];

	constructor(
		private readonly _extensionUri: vscode.Uri,
		private readonly _context: vscode.ExtensionContext
	) {}

	public resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken,
	) {
		this._view = webviewView;

		webviewView.webview.options = {
			enableScripts: true,
			localResourceRoots: [
				this._extensionUri,
				vscode.Uri.file(path.join(this._context.extensionPath, 'node_modules'))
			]
		};

		webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

		// Handle messages from the webview
		webviewView.webview.onDidReceiveMessage(
			message => {
				switch (message.type) {
					case 'ready':
						console.log('[EPUB Preview] WebView ready');
						break;
					case 'error':
						console.error('[EPUB Preview] WebView error:', message.error);
						vscode.window.showErrorMessage(`EPUB Preview Error: ${message.error}`);
						break;
					case 'chapter-changed':
						console.log('[EPUB Preview] Chapter changed to:', message.chapter);
						break;
				}
			},
			null,
			this._disposables
		);
	}

	public async loadEpub(epubPath: string) {
		if (!this._view) {
			vscode.window.showErrorMessage('Vista previa no está disponible');
			return;
		}

		this._currentEpubPath = epubPath;

		try {
			// Read the EPUB file as base64 for the webview
			const epubBuffer = fs.readFileSync(epubPath);
			const epubBase64 = epubBuffer.toString('base64');
			const fileName = path.basename(epubPath, '.epub');

			// Send the EPUB data to the webview
			await this._view.webview.postMessage({
				type: 'load-epub',
				data: epubBase64,
				fileName: fileName
			});

			console.log(`[EPUB Preview] EPUB loaded: ${fileName}`);
			vscode.window.setStatusBarMessage(`📖 Vista previa: ${fileName}`, 3000);

		} catch (error) {
			console.error('[EPUB Preview] Error loading EPUB:', error);
			vscode.window.showErrorMessage(`Error loading EPUB preview: ${error}`);
		}
	}

	public async navigateToChapter(chapterIndex: number) {
		if (!this._view) return;

		await this._view.webview.postMessage({
			type: 'navigate-to-chapter',
			chapterIndex: chapterIndex
		});
	}

	private _getHtmlForWebview(webview: vscode.Webview): string {
		// Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'src', 'preview', 'epubPreview.js'));
		const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'src', 'preview', 'epubPreview.css'));

		// Use a nonce to only allow a specific script to be run.
		const nonce = getNonce();

		return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}' 'unsafe-eval'; font-src ${webview.cspSource}; img-src ${webview.cspSource} data: blob:;">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleUri}" rel="stylesheet">
				<title>EPUB Preview</title>
			</head>
			<body>
				<div id="epub-container">
					<div id="epub-loading" class="loading-state">
						<div class="loading-spinner"></div>
						<p>Cargando vista previa EPUB...</p>
						<p class="loading-hint">Usa el comando "Vista Previa EPUB" para cargar un archivo</p>
					</div>
					<div id="epub-viewer" style="display: none;"></div>
					<div id="epub-controls" style="display: none;">
						<button id="prev-btn" title="Página anterior">‹</button>
						<span id="chapter-info"></span>
						<button id="next-btn" title="Página siguiente">›</button>
					</div>
					<div id="epub-error" class="error-state" style="display: none;">
						<h3>Error al cargar EPUB</h3>
						<p id="error-message"></p>
						<button id="retry-btn">Reintentar</button>
					</div>
				</div>
				
				<!-- Load epub.js from CDN -->
				<script nonce="${nonce}" src="https://cdn.jsdelivr.net/npm/epubjs@0.3.93/dist/epub.min.js"></script>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
	}

	dispose() {
		this._disposables.forEach(d => d.dispose());
	}
}

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}
