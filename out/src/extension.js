"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
const vscode = require("vscode");
const fileSystemProvider_1 = require("./fileSystemProvider");
const aiService_1 = require("./ai/aiService");
const aiCommands_1 = require("./ai/aiCommands");
const fs = require("fs");
const path = require("path");
function activate(context) {
    console.log('EPUB Editor activated');
    // Show activation message
    vscode.window.setStatusBarMessage('📚 EPUB Editor activado', 3000);
    // Create the FileSystemProvider at the top level so all commands can access it
    const epubFs = new fileSystemProvider_1.EpubFileSystemProvider(); // Create a status bar item for EPUB files
    const epubStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    epubStatusBarItem.command = 'epub.openAsFolder';
    epubStatusBarItem.text = '📚 Abrir como Carpeta Virtual';
    epubStatusBarItem.tooltip = 'Clic para abrir este archivo EPUB como una carpeta virtual editable';
    context.subscriptions.push(epubStatusBarItem); // Track the current EPUB file and notifications
    let currentEpubFile = '';
    let notifiedFiles = new Set(); // Track files that have already shown notification
    let currentNotification = null; // Track current notification
    let lastCheckTime = 0; // Prevent excessive checks
    let detectionDebounceTimer = null;
    // Initialize AI services
    const aiService = new aiService_1.AIService(context);
    const aiCommands = new aiCommands_1.AICommands(aiService);
    // Register AI commands
    aiCommands.registerCommands(context);
    try {
        context.subscriptions.push(vscode.workspace.registerFileSystemProvider('epub', epubFs, {
            isCaseSensitive: false,
            isReadonly: false
        })); // Function to check if current file is EPUB and show status bar
        function checkCurrentFileForEpub() {
            // Clear any existing timer
            if (detectionDebounceTimer) {
                clearTimeout(detectionDebounceTimer);
            }
            // Debounce the actual check to prevent spam
            detectionDebounceTimer = setTimeout(() => {
                performEpubCheck();
            }, 500);
        }
        // The actual check function (debounced)
        function performEpubCheck() {
            // Prevent excessive checks - limit to once every 3 seconds
            const now = Date.now();
            if (now - lastCheckTime < 3000) {
                console.log(`[EPUB] Check skipped - too soon (${now - lastCheckTime}ms ago)`);
                return false;
            }
            lastCheckTime = now;
            console.log(`[EPUB] Performing EPUB check...`);
            let foundEpub = false;
            let detectedFilePath = '';
            // Check active editor first (most common case)
            const activeEditor = vscode.window.activeTextEditor;
            console.log(`[EPUB] Active editor:`, {
                exists: !!activeEditor,
                scheme: activeEditor?.document.uri.scheme,
                fsPath: activeEditor?.document.uri.fsPath,
                isEpub: activeEditor?.document.uri.fsPath.toLowerCase().endsWith('.epub')
            });
            if (activeEditor && activeEditor.document.uri.scheme === 'file') {
                const filePath = activeEditor.document.uri.fsPath;
                if (filePath.toLowerCase().endsWith('.epub')) {
                    foundEpub = true;
                    detectedFilePath = filePath;
                    console.log(`[EPUB] Found EPUB in active editor: ${filePath}`);
                }
            }
            // Only check visible editors if no active EPUB found
            if (!foundEpub) {
                const visibleEditors = vscode.window.visibleTextEditors;
                console.log(`[EPUB] Checking ${visibleEditors.length} visible editors`);
                for (const editor of visibleEditors) {
                    if (editor.document.uri.scheme === 'file') {
                        const filePath = editor.document.uri.fsPath;
                        console.log(`[EPUB] Visible editor: ${filePath}, isEpub: ${filePath.toLowerCase().endsWith('.epub')}`);
                        if (filePath.toLowerCase().endsWith('.epub')) {
                            foundEpub = true;
                            detectedFilePath = filePath;
                            console.log(`[EPUB] Found EPUB in visible editor: ${filePath}`);
                            break;
                        }
                    }
                }
            }
            // Also check tabs as fallback
            if (!foundEpub && vscode.window.tabGroups) {
                console.log(`[EPUB] Checking tabs as fallback`);
                for (const tabGroup of vscode.window.tabGroups.all) {
                    for (const tab of tabGroup.tabs) {
                        if (tab.input && typeof tab.input === 'object' && 'uri' in tab.input) {
                            const uri = tab.input.uri;
                            if (uri && uri.scheme === 'file' && uri.fsPath.toLowerCase().endsWith('.epub')) {
                                foundEpub = true;
                                detectedFilePath = uri.fsPath;
                                console.log(`[EPUB] Found EPUB in tab: ${uri.fsPath}`);
                                break;
                            }
                        }
                    }
                    if (foundEpub)
                        break;
                }
            }
            console.log(`[EPUB] Check results:`, {
                foundEpub,
                detectedFilePath,
                currentEpubFile,
                isNewFile: detectedFilePath !== currentEpubFile
            });
            // Update UI state only when there's a change
            if (foundEpub && detectedFilePath !== currentEpubFile) {
                console.log(`[EPUB] New EPUB file detected: ${detectedFilePath}`);
                epubStatusBarItem.show();
                vscode.commands.executeCommand('setContext', 'epub.fileOpen', true);
                currentEpubFile = detectedFilePath;
                // Show notification only if this file hasn't been notified before
                if (!notifiedFiles.has(detectedFilePath)) {
                    console.log(`[EPUB] Will show notification for: ${detectedFilePath}`);
                    // Use a small delay to ensure UI is ready
                    setTimeout(() => {
                        showEpubNotification(detectedFilePath);
                    }, 100);
                }
                else {
                    console.log(`[EPUB] File already notified: ${detectedFilePath}`);
                }
            }
            else if (!foundEpub && currentEpubFile !== '') {
                console.log(`[EPUB] No EPUB files detected, hiding status bar`);
                epubStatusBarItem.hide();
                vscode.commands.executeCommand('setContext', 'epub.fileOpen', false);
                currentEpubFile = '';
                currentNotification = null;
            }
            else {
                console.log(`[EPUB] No change in state, skipping update`);
            }
            return foundEpub;
        } // Function to show EPUB notification
        function showEpubNotification(filePath) {
            console.log(`[EPUB] showEpubNotification called for: ${filePath}`);
            if (currentNotification) {
                console.log(`[EPUB] Notification already active, skipping`);
                return;
            }
            const fileName = path.basename(filePath);
            console.log(`[EPUB] Creating notification for file: ${fileName}`);
            try {
                const notificationPromise = vscode.window.showInformationMessage(`📚 Archivo EPUB detectado: "${fileName}". ¿Quieres abrirlo como una carpeta virtual editable?`, 'Abrir como Carpeta Virtual', 'No mostrar más para este archivo');
                currentNotification = notificationPromise;
                console.log(`[EPUB] Notification displayed successfully`);
                notificationPromise.then((selection) => {
                    console.log(`[EPUB] Notification response: ${selection || 'dismissed'}`);
                    currentNotification = null; // Clear the reference
                    if (selection === 'Abrir como Carpeta Virtual') {
                        console.log(`[EPUB] User chose to open as virtual folder`);
                        // Add to notified files to prevent future notifications
                        notifiedFiles.add(filePath);
                        // Open as virtual folder
                        vscode.commands.executeCommand('epub.openAsFolder', vscode.Uri.file(filePath));
                    }
                    else if (selection === 'No mostrar más para este archivo') {
                        console.log(`[EPUB] User chose not to show again for this file`);
                        // Add to notified files to prevent future notifications
                        notifiedFiles.add(filePath);
                    }
                    // If user dismisses without clicking, don't add to notified files
                    // so notification can appear again if they reopen the file
                    return selection;
                });
            }
            catch (error) {
                console.error(`[EPUB] Error creating notification:`, error);
                currentNotification = null;
            }
        } // Listen for opened text documents to detect EPUB files
        context.subscriptions.push(vscode.workspace.onDidOpenTextDocument((document) => {
            if (document.uri.scheme === 'file' &&
                document.uri.fsPath.toLowerCase().endsWith('.epub')) {
                console.log('[EPUB] EPUB file opened via document:', document.uri.fsPath);
                checkCurrentFileForEpub();
            }
        }));
        // Listen for visible editors changes
        context.subscriptions.push(vscode.window.onDidChangeVisibleTextEditors(() => {
            checkCurrentFileForEpub();
        }));
        // Listen for active editor changes
        context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(() => {
            checkCurrentFileForEpub();
        }));
        // Check current file immediately on activation
        console.log('[EPUB] Initial immediate check on activation');
        checkCurrentFileForEpub();
        // Also check with a delay in case immediate check is too early
        setTimeout(() => {
            console.log('[EPUB] Delayed check on activation (1s)');
            checkCurrentFileForEpub();
        }, 1000);
        // Final check with longer delay for slower systems
        setTimeout(() => {
            console.log('[EPUB] Final delayed check on activation (3s)');
            checkCurrentFileForEpub();
        }, 3000);
        console.log('FileSystemProvider registered successfully');
        console.log('AI services initialized'); // Command to open an EPUB file as virtual folder
        context.subscriptions.push(vscode.commands.registerCommand('epub.openAsFolder', async (uri) => {
            let epubPath;
            console.log(`[EPUB] openAsFolder command called`);
            if (uri) {
                console.log(`[EPUB] URI provided:`, {
                    scheme: uri.scheme,
                    fsPath: uri.fsPath,
                    toString: uri.toString(),
                    path: uri.path
                });
            }
            // If URI is provided (from context menu or notification), use it directly
            if (uri) {
                if (uri.scheme === 'file') {
                    epubPath = uri.fsPath;
                    console.log(`[EPUB] Using file URI fsPath: ${epubPath}`);
                }
                else {
                    // Fallback: extract path from URI string
                    const uriString = uri.toString();
                    if (uriString.startsWith('file://')) {
                        epubPath = decodeURIComponent(uriString.substring(7));
                        console.log(`[EPUB] Using decoded URI path: ${epubPath}`);
                    }
                    else {
                        console.error(`[EPUB] Unsupported URI scheme: ${uri.scheme}`);
                        vscode.window.showErrorMessage(`URI scheme no soportado: ${uri.scheme}`);
                        return;
                    }
                }
            }
            else {
                // Try to get the currently active editor's document as fallback
                const activeEditor = vscode.window.activeTextEditor;
                if (activeEditor && activeEditor.document.uri.scheme === 'file' &&
                    activeEditor.document.uri.fsPath.toLowerCase().endsWith('.epub')) {
                    epubPath = activeEditor.document.uri.fsPath;
                    console.log(`[EPUB] Using active editor file: ${epubPath}`);
                }
                else {
                    // Otherwise, show file picker dialog
                    const options = {
                        canSelectMany: false,
                        openLabel: 'Open EPUB File',
                        filters: {
                            'EPUB files': ['epub']
                        }
                    };
                    const fileUri = await vscode.window.showOpenDialog(options);
                    if (!fileUri || !fileUri[0]) {
                        return; // User cancelled
                    }
                    epubPath = fileUri[0].fsPath;
                    console.log(`[EPUB] Using file picker result: ${epubPath}`);
                }
            }
            // Validate it's an EPUB file
            if (!epubPath || !epubPath.toLowerCase().endsWith('.epub')) {
                vscode.window.showErrorMessage('Por favor selecciona un archivo EPUB válido.');
                return;
            }
            // Check if file exists
            console.log(`[EPUB] Checking if file exists: ${epubPath}`);
            if (!fs.existsSync(epubPath)) {
                console.error(`[EPUB] File not found at path: ${epubPath}`);
                vscode.window.showErrorMessage(`Archivo EPUB no encontrado: ${epubPath}`);
                return;
            }
            // Clear any existing notification for this file since user is opening it
            if (currentNotification) {
                currentNotification = null;
            }
            // Mark this file as processed to prevent future notifications
            notifiedFiles.add(epubPath);
            console.log(`[EPUB] Opening EPUB file: ${epubPath}`);
            try {
                // First load the EPUB file into the FileSystemProvider
                await epubFs.loadEpubFile(epubPath);
                const epubName = path.basename(epubPath, '.epub');
                console.log(`[EPUB] EPUB loaded successfully, name: ${epubName}`);
                // Wait a small amount to ensure FileSystemProvider is fully synchronized
                // This prevents race conditions where VS Code tries to access the virtual file system
                // before currentEpubName is properly set
                await new Promise(resolve => setTimeout(resolve, 100));
                // Create the workspace folder with the correct URI format
                const workspaceFolder = {
                    uri: vscode.Uri.parse(`epub:/${epubName}`), // Note: single slash after scheme
                    name: `EPUB: ${epubName}`
                };
                console.log(`[EPUB] Adding workspace folder:`, workspaceFolder);
                console.log(`[EPUB] Workspace folder URI: ${workspaceFolder.uri.toString()}`);
                console.log(`[EPUB] Workspace folder URI scheme: ${workspaceFolder.uri.scheme}`);
                console.log(`[EPUB] Workspace folder URI path: "${workspaceFolder.uri.path}"`);
                console.log(`[EPUB] Workspace folder URI authority: "${workspaceFolder.uri.authority}"`);
                const result = vscode.workspace.updateWorkspaceFolders(vscode.workspace.workspaceFolders?.length || 0, 0, workspaceFolder);
                console.log(`[EPUB] Workspace folder update result:`, result);
                // Force a refresh of the file explorer after a short delay
                setTimeout(async () => {
                    try {
                        // Force refresh the file explorer
                        await vscode.commands.executeCommand('workbench.files.action.refreshFilesExplorer');
                        // Test reading the root directory
                        const files = await vscode.workspace.fs.readDirectory(workspaceFolder.uri);
                        console.log(`[EPUB] Root directory contents after folder creation:`, files);
                        if (files.length > 0) {
                            // Use status bar message with timeout instead of persistent notification
                            vscode.window.setStatusBarMessage(`📚 EPUB "${epubName}" opened successfully with ${files.length} files!`, 4000);
                        }
                        else {
                            vscode.window.setStatusBarMessage(`⚠️ EPUB opened but no files visible. Try refreshing.`, 5000);
                        }
                    }
                    catch (error) {
                        console.error(`[EPUB] Error reading root directory:`, error);
                        vscode.window.showErrorMessage(`Error reading EPUB folder: ${error}`);
                    }
                }, 500);
                // Use status bar message with timeout instead of persistent notification
                vscode.window.setStatusBarMessage(`📚 EPUB file "${epubName}" loading...`, 2000);
            }
            catch (error) {
                console.error(`[EPUB] Error opening EPUB:`, error);
                vscode.window.showErrorMessage(`Failed to open EPUB file: ${error}`);
            }
        }));
        // Command to close EPUB file
        context.subscriptions.push(vscode.commands.registerCommand('epub.closeFile', async () => {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (workspaceFolders) {
                const epubFolders = workspaceFolders.filter(folder => folder.uri.scheme === 'epub');
                if (epubFolders.length > 0) {
                    // Remove all EPUB workspace folders
                    for (let i = workspaceFolders.length - 1; i >= 0; i--) {
                        if (workspaceFolders[i].uri.scheme === 'epub') {
                            vscode.workspace.updateWorkspaceFolders(i, 1);
                        }
                    }
                    epubFs.clearLoadedFiles();
                    vscode.window.setStatusBarMessage('📚 EPUB files closed', 3000);
                }
                else {
                    vscode.window.setStatusBarMessage('No EPUB files are currently open', 3000);
                }
            }
        }));
        // Command to save EPUB file
        context.subscriptions.push(vscode.commands.registerCommand('epub.saveFile', async () => {
            try {
                const modifiedCount = epubFs.getModifiedFilesCount();
                if (modifiedCount === 0) {
                    vscode.window.setStatusBarMessage('No changes to save.', 3000);
                    return;
                }
                await epubFs.saveAllChanges();
                vscode.window.setStatusBarMessage(`📚 EPUB saved successfully! (${modifiedCount} files updated)`, 4000);
            }
            catch (error) {
                vscode.window.showErrorMessage(`Failed to save EPUB file: ${error}`);
            }
        }));
        // Command to save EPUB file with confirmation
        context.subscriptions.push(vscode.commands.registerCommand('epub.saveFileWithConfirmation', async () => {
            try {
                const modifiedCount = epubFs.getModifiedFilesCount();
                if (modifiedCount === 0) {
                    vscode.window.setStatusBarMessage('No changes to save.', 3000);
                    return;
                }
                const result = await vscode.window.showWarningMessage(`Save EPUB with ${modifiedCount} modified file${modifiedCount > 1 ? 's' : ''}?`, { modal: true }, 'Save', 'Cancel');
                if (result === 'Save') {
                    await epubFs.saveAllChanges();
                    vscode.window.setStatusBarMessage(`📚 EPUB saved successfully! (${modifiedCount} files updated)`, 4000);
                }
            }
            catch (error) {
                vscode.window.showErrorMessage(`Failed to save EPUB file: ${error}`);
            }
        }));
        // Command to check EPUB status
        context.subscriptions.push(vscode.commands.registerCommand('epub.status', async () => {
            try {
                const fileCount = epubFs.getFileCount();
                const modifiedCount = epubFs.getModifiedFilesCount();
                const isModified = modifiedCount > 0;
                const statusMessage = `EPUB Status:\n` +
                    `📁 Total files: ${fileCount}\n` +
                    `✏️ Modified files: ${modifiedCount}\n` +
                    `💾 Status: ${isModified ? 'Has unsaved changes' : 'All changes saved'}`;
                vscode.window.showInformationMessage(statusMessage);
            }
            catch (error) {
                vscode.window.showErrorMessage(`Failed to get EPUB status: ${error}`);
            }
        }));
        // Command to list modified files
        context.subscriptions.push(vscode.commands.registerCommand('epub.listModifiedFiles', async () => {
            try {
                const modifiedFiles = epubFs.getModifiedFilesList();
                if (modifiedFiles.length === 0) {
                    vscode.window.setStatusBarMessage('No files have been modified.', 3000);
                    return;
                }
                const fileList = modifiedFiles.map((file) => `• ${file}`).join('\n');
                const message = `Modified files (${modifiedFiles.length}):\n\n${fileList}`;
                vscode.window.showInformationMessage(message, { modal: true });
            }
            catch (error) {
                vscode.window.showErrorMessage(`Failed to list modified files: ${error}`);
            }
        }));
        // Command to refresh EPUB content
        context.subscriptions.push(vscode.commands.registerCommand('epub.refresh', async () => {
            try {
                await vscode.commands.executeCommand('workbench.files.action.refreshFilesExplorer');
                vscode.window.setStatusBarMessage('📚 EPUB refreshed!', 2000);
            }
            catch (error) {
                vscode.window.showErrorMessage(`Failed to refresh EPUB: ${error}`);
            }
        })); // Command to show EPUB metadata
        context.subscriptions.push(vscode.commands.registerCommand('epub.showMetadata', async () => {
            try {
                const metadata = await epubFs.getEpubMetadata();
                const metadataText = `
EPUB Metadata:
Title: ${metadata.title || 'N/A'}
Author: ${metadata.author || 'N/A'}
Language: ${metadata.language || 'N/A'}
Publisher: ${metadata.publisher || 'N/A'}
Identifier: ${metadata.identifier || 'N/A'}
			`.trim();
                vscode.window.showInformationMessage(metadataText, { modal: true });
            }
            catch (error) {
                vscode.window.showErrorMessage(`Failed to get EPUB metadata: ${error}`);
            }
        }));
        // Command to create new EPUB
        context.subscriptions.push(vscode.commands.registerCommand('epub.createNew', async () => {
            try {
                // Collect metadata from user
                const metadata = await collectEpubMetadata();
                if (!metadata) {
                    return; // User cancelled
                }
                // Show save dialog
                const saveOptions = {
                    defaultUri: vscode.Uri.file(`${metadata.title || 'New Book'}.epub`),
                    filters: {
                        'EPUB files': ['epub']
                    },
                    saveLabel: 'Create EPUB'
                };
                const fileUri = await vscode.window.showSaveDialog(saveOptions);
                if (!fileUri) {
                    return; // User cancelled
                }
                // Show progress notification
                await vscode.window.withProgress({
                    location: vscode.ProgressLocation.Notification,
                    title: 'Creating EPUB',
                    cancellable: false
                }, async (progress) => {
                    progress.report({ increment: 0, message: 'Generating EPUB structure...' });
                    // Create the new EPUB
                    await epubFs.createNewEpub(metadata, fileUri.fsPath);
                    progress.report({ increment: 50, message: 'Loading into workspace...' });
                    // Load the newly created EPUB into workspace
                    await epubFs.loadEpubFile(fileUri.fsPath);
                    const epubName = path.basename(fileUri.fsPath, '.epub');
                    // Wait a small amount to ensure FileSystemProvider is fully synchronized
                    await new Promise(resolve => setTimeout(resolve, 100));
                    // Create workspace folder
                    const workspaceFolder = {
                        uri: vscode.Uri.parse(`epub:/${epubName}`),
                        name: `EPUB: ${epubName}`
                    };
                    progress.report({ increment: 80, message: 'Setting up workspace...' });
                    vscode.workspace.updateWorkspaceFolders(vscode.workspace.workspaceFolders?.length || 0, 0, workspaceFolder);
                    progress.report({ increment: 100, message: 'Complete!' });
                });
                vscode.window.setStatusBarMessage(`📚 New EPUB "${metadata.title}" created successfully!`, 5000);
            }
            catch (error) {
                console.error('[EPUB] Error creating new EPUB:', error);
                vscode.window.showErrorMessage(`Failed to create new EPUB: ${error}`);
            }
        }));
        // Command for the toolbar button (same functionality as openAsFolder)
        context.subscriptions.push(vscode.commands.registerCommand('epub.openAsFolderButton', async (uri) => {
            // Reuse the same logic as the main command
            await vscode.commands.executeCommand('epub.openAsFolder', uri);
        }));
        // Quick command for current file
        context.subscriptions.push(vscode.commands.registerCommand('epub.quickOpen', async () => {
            const activeEditor = vscode.window.activeTextEditor;
            if (activeEditor && activeEditor.document.uri.scheme === 'file' &&
                activeEditor.document.uri.fsPath.toLowerCase().endsWith('.epub')) {
                await vscode.commands.executeCommand('epub.openAsFolder', activeEditor.document.uri);
            }
            else {
                // Fallback: show file picker
                await vscode.commands.executeCommand('epub.openAsFolder');
            }
        }));
        console.log('All EPUB commands registered successfully');
        // Auto-save handler: Save EPUB when individual files are saved
        context.subscriptions.push(vscode.workspace.onDidSaveTextDocument(async (document) => {
            // Check if the saved document is from an EPUB scheme
            if (document.uri.scheme === 'epub') {
                console.log(`[EPUB] File saved: ${document.uri.toString()}`);
                try {
                    // Automatically save the entire EPUB when any file is saved
                    await epubFs.saveAllChanges();
                    console.log(`[EPUB] EPUB auto-saved successfully after editing ${document.uri.path}`);
                    // Show a subtle notification
                    vscode.window.setStatusBarMessage('📚 EPUB saved', 3000);
                }
                catch (error) {
                    console.error(`[EPUB] Auto-save failed:`, error);
                    vscode.window.showErrorMessage(`Failed to auto-save EPUB: ${error}`);
                }
            }
        }));
    }
    catch (error) {
        console.error('Failed to activate EPUB Editor extension:', error);
        vscode.window.showErrorMessage(`Failed to activate EPUB Editor: ${error}`);
    }
}
// Function to collect EPUB metadata from user input
async function collectEpubMetadata() {
    try {
        // Title (required)
        const title = await vscode.window.showInputBox({
            prompt: 'Enter the book title',
            placeHolder: 'e.g., My Great Novel',
            validateInput: (value) => {
                return value && value.trim() ? null : 'Title is required';
            }
        });
        if (!title)
            return undefined;
        // Author (required)
        const author = await vscode.window.showInputBox({
            prompt: 'Enter the author name',
            placeHolder: 'e.g., John Doe',
            validateInput: (value) => {
                return value && value.trim() ? null : 'Author is required';
            }
        });
        if (!author)
            return undefined;
        // Language (optional, default to 'en')
        const language = await vscode.window.showQuickPick([
            { label: 'English', value: 'en' },
            { label: 'Spanish', value: 'es' },
            { label: 'French', value: 'fr' },
            { label: 'German', value: 'de' },
            { label: 'Italian', value: 'it' },
            { label: 'Portuguese', value: 'pt' },
            { label: 'Other...', value: 'other' }
        ], {
            placeHolder: 'Select book language',
            ignoreFocusOut: true
        });
        let finalLanguage = 'en';
        if (language) {
            if (language.value === 'other') {
                const customLang = await vscode.window.showInputBox({
                    prompt: 'Enter language code (e.g., ja, zh, ru)',
                    placeHolder: 'e.g., ja'
                });
                finalLanguage = customLang || 'en';
            }
            else {
                finalLanguage = language.value;
            }
        }
        // Publisher (optional)
        const publisher = await vscode.window.showInputBox({
            prompt: 'Enter publisher name (optional)',
            placeHolder: 'e.g., My Publishing House'
        });
        // Description (optional)
        const description = await vscode.window.showInputBox({
            prompt: 'Enter book description (optional)',
            placeHolder: 'e.g., A thrilling adventure...'
        });
        // Subject/Genre (optional)
        const subject = await vscode.window.showInputBox({
            prompt: 'Enter subject or genre (optional)',
            placeHolder: 'e.g., Fiction, Science Fiction, Biography'
        });
        // Rights (optional)
        const rights = await vscode.window.showInputBox({
            prompt: 'Enter copyright information (optional)',
            placeHolder: 'e.g., Copyright © 2025 John Doe'
        });
        return {
            title: title.trim(),
            author: author.trim(),
            language: finalLanguage,
            publisher: publisher?.trim() || '',
            identifier: '', // Will be auto-generated with UUID
            description: description?.trim() || '',
            subject: subject?.trim() || '',
            rights: rights?.trim() || ''
        };
    }
    catch (error) {
        console.error('Error collecting metadata:', error);
        vscode.window.showErrorMessage(`Error collecting metadata: ${error}`);
        return undefined;
    }
}
//# sourceMappingURL=extension.js.map