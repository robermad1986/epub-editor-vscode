"use strict";
/*---------------------------------------------------------------------------------------------
 * EPUB Editor for VS Code
 * FileSystemProvider implementation for EPUB files
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.EpubFileSystemProvider = exports.Directory = exports.File = void 0;
const path = require("path");
const vscode = require("vscode");
const JSZip = require("jszip");
const fs = require("fs");
const uuid_1 = require("uuid");
class File {
    constructor(name, data) {
        this.type = vscode.FileType.File;
        this.ctime = Date.now();
        this.mtime = Date.now();
        this.size = data ? data.length : 0;
        this.name = name;
        this.data = data;
    }
}
exports.File = File;
class Directory {
    constructor(name) {
        this.type = vscode.FileType.Directory;
        this.ctime = Date.now();
        this.mtime = Date.now();
        this.size = 0;
        this.name = name;
        this.entries = new Map();
    }
}
exports.Directory = Directory;
class EpubFileSystemProvider {
    constructor() {
        this.root = new Directory('');
        this._emitter = new vscode.EventEmitter();
        this._bufferedEvents = [];
        this.isModified = false;
        this.modifiedFiles = new Set(); // Track which files have been modified
        this.pendingSave = false; // Track if a save operation is in progress
        this.onDidChangeFile = this._emitter.event;
    }
    // --- Status and tracking methods ---
    updateStatusBar() {
        const modifiedCount = this.modifiedFiles.size;
        if (modifiedCount > 0) {
            vscode.window.setStatusBarMessage(`📚 EPUB: ${modifiedCount} file${modifiedCount > 1 ? 's' : ''} modified`, 3000);
        }
    }
    getModifiedFilesCount() {
        return this.modifiedFiles.size;
    }
    getModifiedFilesList() {
        return Array.from(this.modifiedFiles);
    }
    isFileModified(uri) {
        const zipPath = this._getZipPathFromUri(uri);
        return this.modifiedFiles.has(zipPath);
    }
    // --- EPUB-specific methods ---
    async loadEpubFile(epubPath) {
        try {
            console.log(`[EPUB] Loading EPUB file: ${epubPath}`);
            // Read the EPUB file
            const epubBuffer = fs.readFileSync(epubPath);
            console.log(`[EPUB] File read successfully, size: ${epubBuffer.length} bytes`);
            this.epubZip = await JSZip.loadAsync(epubBuffer);
            console.log(`[EPUB] ZIP loaded successfully`);
            this.originalEpubPath = epubPath;
            this.currentEpubName = path.basename(epubPath, '.epub');
            // Clear existing entries
            this.root = new Directory('');
            // Build file system structure from ZIP contents
            await this.buildFileSystemFromZip();
            console.log(`[EPUB] File system structure built successfully`);
            this.isModified = false;
            // Fire change events to notify VS Code of the new file structure
            this.triggerWorkspaceRefresh();
        }
        catch (error) {
            console.error(`[EPUB] Error loading EPUB file:`, error);
            throw new Error(`Failed to load EPUB file: ${error}`);
        }
    }
    async buildFileSystemFromZip() {
        if (!this.epubZip) {
            throw new Error('No EPUB file loaded');
        }
        console.log(`[EPUB] Building file system from ZIP...`);
        // Create directory structure and files
        let fileCount = 0;
        let dirCount = 0;
        for (const [relativePath, zipEntry] of Object.entries(this.epubZip.files)) {
            console.log(`[EPUB] Processing: ${relativePath}, isDir: ${zipEntry.dir}`);
            if (!zipEntry.dir) {
                // It's a file
                const content = await zipEntry.async('uint8array');
                this.createFileFromPath(relativePath, content);
                fileCount++;
            }
            else {
                // It's a directory
                this.createDirectoryFromPath(relativePath);
                dirCount++;
            }
        }
        console.log(`[EPUB] Created ${fileCount} files and ${dirCount} directories`);
        console.log(`[EPUB] Root directory contents:`, Array.from(this.root.entries.keys()));
    }
    createFileFromPath(filePath, content) {
        const pathParts = filePath.split('/').filter(part => part.length > 0);
        let current = this.root;
        // Create intermediate directories
        for (let i = 0; i < pathParts.length - 1; i++) {
            const dirName = pathParts[i];
            if (!current.entries.has(dirName)) {
                current.entries.set(dirName, new Directory(dirName));
            }
            current = current.entries.get(dirName);
        }
        // Create the file
        const fileName = pathParts[pathParts.length - 1];
        current.entries.set(fileName, new File(fileName, content));
    }
    createDirectoryFromPath(dirPath) {
        const pathParts = dirPath.split('/').filter(part => part.length > 0);
        let current = this.root;
        for (const dirName of pathParts) {
            if (!current.entries.has(dirName)) {
                current.entries.set(dirName, new Directory(dirName));
            }
            current = current.entries.get(dirName);
        }
    }
    async saveAllChanges() {
        if (!this.epubZip || !this.originalEpubPath || !this.isModified) {
            console.log(`[EPUB] saveAllChanges: No changes to save or EPUB not loaded`);
            return;
        }
        try {
            console.log(`[EPUB] Starting save process for: ${this.originalEpubPath}`);
            // Create backup before saving
            await this.createBackup();
            // Update ZIP with current file system state
            await this.updateZipFromFileSystem();
            // Write the modified EPUB back to disk
            const content = await this.epubZip.generateAsync({
                type: 'nodebuffer',
                compression: 'DEFLATE',
                compressionOptions: { level: 6 }
            });
            fs.writeFileSync(this.originalEpubPath, content);
            this.isModified = false;
            this.modifiedFiles.clear(); // Clear the list of modified files
            console.log(`[EPUB] EPUB saved successfully: ${this.originalEpubPath}`);
        }
        catch (error) {
            console.error(`[EPUB] Save failed:`, error);
            throw new Error(`Failed to save EPUB file: ${error}`);
        }
    }
    async createBackup() {
        if (!this.originalEpubPath) {
            return;
        }
        try {
            const backupPath = this.originalEpubPath + '.backup.' + Date.now();
            console.log(`[EPUB] Creating backup: ${backupPath}`);
            fs.copyFileSync(this.originalEpubPath, backupPath);
            // Keep only the last 5 backups
            await this.cleanupOldBackups();
        }
        catch (error) {
            console.warn(`[EPUB] Failed to create backup:`, error);
            // Don't throw here - backup failure shouldn't prevent saving
        }
    }
    async cleanupOldBackups() {
        if (!this.originalEpubPath) {
            return;
        }
        try {
            const epubDir = path.dirname(this.originalEpubPath);
            const epubBasename = path.basename(this.originalEpubPath);
            const files = fs.readdirSync(epubDir);
            // Find all backup files for this EPUB
            const backupFiles = files
                .filter(file => file.startsWith(epubBasename + '.backup.'))
                .map(file => ({
                name: file,
                path: path.join(epubDir, file),
                mtime: fs.statSync(path.join(epubDir, file)).mtime
            }))
                .sort((a, b) => b.mtime.getTime() - a.mtime.getTime()); // Sort by modification time, newest first
            // Keep only the 5 most recent backups
            if (backupFiles.length > 5) {
                for (let i = 5; i < backupFiles.length; i++) {
                    try {
                        fs.unlinkSync(backupFiles[i].path);
                        console.log(`[EPUB] Cleaned up old backup: ${backupFiles[i].name}`);
                    }
                    catch (error) {
                        console.warn(`[EPUB] Failed to cleanup backup ${backupFiles[i].name}:`, error);
                    }
                }
            }
        }
        catch (error) {
            console.warn(`[EPUB] Failed to cleanup old backups:`, error);
        }
    }
    async updateZipFromFileSystem() {
        if (!this.epubZip) {
            return;
        }
        // Clear the ZIP and rebuild from file system
        this.epubZip = new JSZip();
        this.addDirectoryToZip(this.root, '');
    }
    addDirectoryToZip(directory, basePath) {
        if (!this.epubZip) {
            return;
        }
        for (const [name, entry] of directory.entries) {
            const fullPath = basePath ? `${basePath}/${name}` : name;
            if (entry instanceof File && entry.data) {
                this.epubZip.file(fullPath, entry.data);
            }
            else if (entry instanceof Directory) {
                this.addDirectoryToZip(entry, fullPath);
            }
        }
    }
    async validateEpubStructure() {
        const errors = [];
        try {
            // Check for required files
            const requiredFiles = ['META-INF/container.xml', 'mimetype'];
            for (const file of requiredFiles) {
                if (!this._fileExists(file)) {
                    errors.push(`Missing required file: ${file}`);
                }
            }
            // Check mimetype content
            const mimetypeFile = this._getFileByPath('mimetype');
            if (mimetypeFile?.data) {
                const content = new TextDecoder().decode(mimetypeFile.data).trim();
                if (content !== 'application/epub+zip') {
                    errors.push(`Invalid mimetype: expected 'application/epub+zip', got '${content}'`);
                }
            }
            // Additional validations can be added here
        }
        catch (error) {
            errors.push(`Validation error: ${error}`);
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    async getEpubMetadata() {
        const metadata = {};
        try {
            // Parse container.xml to find OPF file
            const containerFile = this._getFileByPath('META-INF/container.xml');
            if (containerFile?.data) {
                const containerXml = new TextDecoder().decode(containerFile.data);
                const opfMatch = containerXml.match(/full-path="([^"]+)"/);
                if (opfMatch) {
                    const opfPath = opfMatch[1];
                    const opfFile = this._getFileByPath(opfPath);
                    if (opfFile?.data) {
                        const opfXml = new TextDecoder().decode(opfFile.data);
                        // Extract metadata from OPF
                        metadata.title = this._extractXmlValue(opfXml, 'dc:title');
                        metadata.author = this._extractXmlValue(opfXml, 'dc:creator');
                        metadata.language = this._extractXmlValue(opfXml, 'dc:language');
                        metadata.publisher = this._extractXmlValue(opfXml, 'dc:publisher');
                        metadata.identifier = this._extractXmlValue(opfXml, 'dc:identifier');
                    }
                }
            }
        }
        catch (error) {
            console.error('Error getting EPUB metadata:', error);
        }
        return metadata;
    }
    _extractXmlValue(xml, tagName) {
        const regex = new RegExp(`<${tagName}[^>]*>([^<]+)</${tagName}>`, 'i');
        const match = xml.match(regex);
        return match ? match[1].trim() : undefined;
    }
    _fileExists(filePath) {
        try {
            this._getFileByPath(filePath);
            return true;
        }
        catch {
            return false;
        }
    }
    _getFileByPath(filePath) {
        const pathParts = filePath.split('/').filter(part => part.length > 0);
        let current = this.root;
        for (const part of pathParts) {
            if (current instanceof Directory) {
                const child = current.entries.get(part);
                if (!child) {
                    return undefined;
                }
                current = child;
            }
            else {
                return undefined;
            }
        }
        return current instanceof File ? current : undefined;
    }
    clearLoadedFiles() {
        this.root = new Directory('');
        this.epubZip = undefined;
        this.originalEpubPath = undefined;
        this.currentEpubName = undefined;
        this.isModified = false;
        this.modifiedFiles.clear();
        this.pendingSave = false;
    }
    // Public method to get file count for debugging
    getFileCount() {
        return this._countFiles(this.root);
    }
    _countFiles(directory) {
        let count = 0;
        for (const [, entry] of directory.entries) {
            if (entry instanceof File) {
                count++;
            }
            else if (entry instanceof Directory) {
                count += this._countFiles(entry);
            }
        }
        return count;
    }
    // Public method to trigger file change events
    triggerRefresh(uri) {
        console.log(`[EPUB] triggerRefresh called for: ${uri.toString()}`);
        this._fireSoon({ type: vscode.FileChangeType.Changed, uri });
    }
    // Method to trigger workspace refresh after loading EPUB
    triggerWorkspaceRefresh() {
        if (this.currentEpubName) {
            const workspaceUri = vscode.Uri.parse(`epub:/${this.currentEpubName}`);
            console.log(`[EPUB] Triggering workspace refresh for: ${workspaceUri.toString()}`);
            console.log(`[EPUB] Root directory has ${this.root.entries.size} entries:`, Array.from(this.root.entries.keys()));
            // Fire a change event to notify VS Code that the file system has been updated
            this._fireSoon({ type: vscode.FileChangeType.Changed, uri: workspaceUri });
            // Also fire creation events for the root directory contents
            setTimeout(() => {
                for (const [name] of this.root.entries) {
                    const childUri = vscode.Uri.parse(`epub:/${this.currentEpubName}/${name}`);
                    this._fireSoon({ type: vscode.FileChangeType.Created, uri: childUri });
                }
                console.log(`[EPUB] Fired creation events for ${this.root.entries.size} root entries`);
            }, 50);
        }
    }
    // --- VS Code FileSystemProvider interface implementation ---
    watch(uri, options) {
        console.log(`[EPUB] watch() called for: ${uri.toString()}`);
        // ignore, fires for all changes...
        return new vscode.Disposable(() => { });
    }
    stat(uri) {
        console.log(`[EPUB] stat() called for: ${uri.toString()}`);
        return this._lookup(uri, false);
    }
    readDirectory(uri) {
        console.log(`[EPUB] === readDirectory called ===`);
        console.log(`[EPUB] URI: ${uri.toString()}`);
        console.log(`[EPUB] URI scheme: ${uri.scheme}`);
        console.log(`[EPUB] URI path: "${uri.path}"`);
        console.log(`[EPUB] URI authority: "${uri.authority}"`);
        console.log(`[EPUB] Root has ${this.root.entries.size} entries:`, Array.from(this.root.entries.keys()));
        try {
            const entry = this._lookupAsDirectory(uri, false);
            const result = [];
            for (const [name, child] of entry.entries) {
                result.push([name, child.type]);
            }
            console.log(`[EPUB] readDirectory returning ${result.length} entries:`, result.map(([name, type]) => `${name} (${type})`));
            return result;
        }
        catch (error) {
            console.error(`[EPUB] readDirectory error:`, error);
            throw error;
        }
    }
    createDirectory(uri) {
        const basename = path.posix.basename(uri.path);
        const dirname = uri.with({ path: path.posix.dirname(uri.path) });
        const parent = this._lookupAsDirectory(dirname, false);
        const entry = new Directory(basename);
        parent.entries.set(entry.name, entry);
        parent.mtime = Date.now();
        parent.size += 1;
        this._fireSoon({ type: vscode.FileChangeType.Changed, uri: dirname }, { type: vscode.FileChangeType.Created, uri });
        this.isModified = true;
    }
    readFile(uri) {
        const data = this._lookupAsFile(uri, false).data;
        if (data) {
            return data;
        }
        throw vscode.FileSystemError.FileNotFound();
    }
    writeFile(uri, content, options) {
        console.log(`[EPUB] writeFile() called for: ${uri.toString()}`);
        console.log(`[EPUB] Content size: ${content.byteLength} bytes`);
        const basename = path.posix.basename(uri.path);
        const parent = this._lookupParentDirectory(uri);
        let entry = parent.entries.get(basename);
        if (entry instanceof Directory) {
            throw vscode.FileSystemError.FileIsADirectory(uri);
        }
        if (!entry && !options.create) {
            throw vscode.FileSystemError.FileNotFound(uri);
        }
        if (entry && options.create && !options.overwrite) {
            throw vscode.FileSystemError.FileExists(uri);
        }
        const isNewFile = !entry;
        if (!entry) {
            entry = new File(basename);
            parent.entries.set(basename, entry);
            this._fireSoon({ type: vscode.FileChangeType.Created, uri });
            console.log(`[EPUB] Created new file: ${basename}`);
        }
        else {
            console.log(`[EPUB] Updating existing file: ${basename}`);
        }
        // Update file metadata and content
        entry.mtime = Date.now();
        entry.size = content.byteLength;
        entry.data = content;
        // Track this file as modified
        const zipPath = this._getZipPathFromUri(uri);
        this.modifiedFiles.add(zipPath);
        // Update the ZIP in memory if it exists
        if (this.epubZip && this.currentEpubName) {
            try {
                console.log(`[EPUB] Updating ZIP entry: ${zipPath}`);
                this.epubZip.file(zipPath, content);
            }
            catch (error) {
                console.error(`[EPUB] Error updating ZIP entry:`, error);
            }
        }
        this._fireSoon({ type: vscode.FileChangeType.Changed, uri });
        this.isModified = true;
        // Update status bar to show pending changes
        this.updateStatusBar();
        console.log(`[EPUB] File written successfully, EPUB marked as modified (${this.modifiedFiles.size} files modified)`);
    }
    delete(uri, options) {
        const dirname = uri.with({ path: path.posix.dirname(uri.path) });
        const basename = path.posix.basename(uri.path);
        const parent = this._lookupAsDirectory(dirname, false);
        if (!parent.entries.has(basename)) {
            throw vscode.FileSystemError.FileNotFound(uri);
        }
        const entry = parent.entries.get(basename);
        if (entry instanceof Directory && entry.entries.size > 0 && !options.recursive) {
            throw vscode.FileSystemError.NoPermissions('Cannot delete non-empty directory');
        }
        parent.entries.delete(basename);
        parent.mtime = Date.now();
        parent.size -= 1;
        this._fireSoon({ type: vscode.FileChangeType.Changed, uri: dirname }, { uri, type: vscode.FileChangeType.Deleted });
        this.isModified = true;
    }
    rename(oldUri, newUri, options) {
        if (!options.overwrite && this._lookup(newUri, true)) {
            throw vscode.FileSystemError.FileExists(newUri);
        }
        const entry = this._lookup(oldUri, false);
        const oldParent = this._lookupParentDirectory(oldUri);
        const newParent = this._lookupParentDirectory(newUri);
        const newName = path.posix.basename(newUri.path);
        oldParent.entries.delete(entry.name);
        entry.name = newName;
        newParent.entries.set(newName, entry);
        this._fireSoon({ type: vscode.FileChangeType.Deleted, uri: oldUri }, { type: vscode.FileChangeType.Created, uri: newUri });
        this.isModified = true;
    }
    _lookup(uri, silent) {
        console.log(`[EPUB] === _lookup called ===`);
        console.log(`[EPUB] URI: ${uri.toString()}`);
        console.log(`[EPUB] URI path: "${uri.path}"`);
        console.log(`[EPUB] URI authority: "${uri.authority}"`);
        console.log(`[EPUB] Current EPUB name: "${this.currentEpubName}"`);
        console.log(`[EPUB] Root entries: ${this.root.entries.size}`);
        // Extract EPUB name from URI path if currentEpubName is not set
        let epubName = this.currentEpubName;
        if (!epubName && uri.path) {
            // The URI path starts with the EPUB name: /{epubName}/...
            const pathMatch = uri.path.match(/^\/([^\/]+)/);
            if (pathMatch) {
                epubName = decodeURIComponent(pathMatch[1]);
                console.log(`[EPUB] Extracted EPUB name from URI: "${epubName}"`);
                // Set the currentEpubName if it's not set
                if (!this.currentEpubName) {
                    this.currentEpubName = epubName;
                    console.log(`[EPUB] Set currentEpubName to: "${this.currentEpubName}"`);
                }
            }
        }
        // Handle the authority part - if present, it should match the current EPUB
        if (uri.authority && epubName && uri.authority !== epubName) {
            console.log(`[EPUB] Authority mismatch: ${uri.authority} !== ${epubName}`);
            if (!silent) {
                throw vscode.FileSystemError.FileNotFound(uri);
            }
            return undefined;
        }
        let pathToProcess = uri.path;
        // If the path starts with the EPUB name (e.g., /BookName/file.txt), remove the EPUB name
        if (epubName && pathToProcess.startsWith(`/${epubName}/`)) {
            pathToProcess = pathToProcess.substring(epubName.length + 1);
        }
        else if (epubName && pathToProcess === `/${epubName}`) {
            pathToProcess = '/';
        }
        const parts = pathToProcess.split('/').filter(part => part.length > 0);
        console.log(`[EPUB] Path parts after processing:`, parts);
        // Handle root URI (epub://BookName or epub://BookName/)
        if (parts.length === 0) {
            console.log(`[EPUB] Returning root directory with ${this.root.entries.size} entries`);
            return this.root;
        }
        // Navigate through the directory structure
        let entry = this.root;
        for (const part of parts) {
            console.log(`[EPUB] Looking for part: "${part}"`);
            let child;
            if (entry instanceof Directory) {
                child = entry.entries.get(part);
                console.log(`[EPUB] Found child: ${child ? child.name : 'undefined'}`);
            }
            if (!child) {
                if (!silent) {
                    console.error(`[EPUB] File not found at: ${uri.toString()}, failed at part: ${part}`);
                    throw vscode.FileSystemError.FileNotFound(uri);
                }
                else {
                    console.log(`[EPUB] File not found (silent): ${uri.toString()}`);
                    return undefined;
                }
            }
            entry = child;
        }
        console.log(`[EPUB] _lookup returning:`, entry instanceof File ? 'File' : 'Directory', entry.name);
        return entry;
    }
    _lookupAsDirectory(uri, silent) {
        const entry = this._lookup(uri, silent);
        if (entry instanceof Directory) {
            return entry;
        }
        throw vscode.FileSystemError.FileNotADirectory(uri);
    }
    _lookupAsFile(uri, silent) {
        const entry = this._lookup(uri, silent);
        if (entry instanceof File) {
            return entry;
        }
        throw vscode.FileSystemError.FileIsADirectory(uri);
    }
    _lookupParentDirectory(uri) {
        const dirname = uri.with({ path: path.posix.dirname(uri.path) });
        return this._lookupAsDirectory(dirname, false);
    }
    // --- manage file events ---
    _getZipPathFromUri(uri) {
        // Extract the file path relative to the EPUB root
        let pathToProcess = uri.path;
        // Remove the EPUB name prefix if present (e.g., /BookName/file.txt -> file.txt)
        if (this.currentEpubName && pathToProcess.startsWith(`/${this.currentEpubName}/`)) {
            pathToProcess = pathToProcess.substring(this.currentEpubName.length + 1);
        }
        // Remove leading slash if present
        if (pathToProcess.startsWith('/')) {
            pathToProcess = pathToProcess.substring(1);
        }
        console.log(`[EPUB] Converting URI path "${uri.path}" to ZIP path "${pathToProcess}"`);
        return pathToProcess;
    }
    // --- EPUB Creation Methods ---
    /**
     * Create a new EPUB file with the given metadata
     */
    async createNewEpub(metadata, filePath) {
        try {
            console.log(`[EPUB] Creating new EPUB at: ${filePath}`);
            // Generate unique identifier if not provided
            if (!metadata.identifier) {
                metadata.identifier = `urn:uuid:${(0, uuid_1.v4)()}`;
            }
            // Create new ZIP structure
            const zip = new JSZip();
            // Create EPUB structure
            this.addMimetypeFile(zip);
            this.addMetaInfFiles(zip);
            this.addOEBPSFiles(zip, metadata);
            // Generate the EPUB file
            const content = await zip.generateAsync({
                type: 'nodebuffer',
                compression: 'DEFLATE',
                compressionOptions: { level: 9 }
            });
            // Write to file system
            fs.writeFileSync(filePath, content);
            console.log(`[EPUB] New EPUB created successfully at: ${filePath}`);
        }
        catch (error) {
            console.error(`[EPUB] Error creating new EPUB:`, error);
            throw error;
        }
    }
    /**
     * Add mimetype file (must be first and uncompressed)
     */
    addMimetypeFile(zip) {
        zip.file('mimetype', 'application/epub+zip', {
            compression: 'STORE' // No compression for mimetype
        });
    }
    /**
     * Add META-INF directory and files
     */
    addMetaInfFiles(zip) {
        const containerXml = `<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
	<rootfiles>
		<rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
	</rootfiles>
</container>`;
        zip.file('META-INF/container.xml', containerXml);
    }
    /**
     * Add OEBPS directory and files
     */
    addOEBPSFiles(zip, metadata) {
        // Create content.opf
        const contentOpf = this.generateContentOpf(metadata);
        zip.file('OEBPS/content.opf', contentOpf);
        // Create toc.ncx
        const tocNcx = this.generateTocNcx(metadata);
        zip.file('OEBPS/toc.ncx', tocNcx);
        // Create basic CSS
        const basicCss = this.generateBasicCss();
        zip.file('OEBPS/Styles/style.css', basicCss);
        // Create title page
        const titlePage = this.generateTitlePage(metadata);
        zip.file('OEBPS/Text/title.xhtml', titlePage);
        // Create chapter 1
        const chapter1 = this.generateChapterTemplate(1);
        zip.file('OEBPS/Text/chapter1.xhtml', chapter1);
    }
    /**
     * Generate content.opf file
     */
    generateContentOpf(metadata) {
        const currentDate = new Date().toISOString().split('T')[0];
        return `<?xml version="1.0" encoding="utf-8"?>
<package version="3.0" unique-identifier="BookId" xmlns="http://www.idpf.org/2007/opf">
	<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
		<dc:identifier id="BookId">${metadata.identifier}</dc:identifier>		<dc:title>${this.escapeXml(metadata.title || '')}</dc:title>
		<dc:creator>${this.escapeXml(metadata.author || '')}</dc:creator>
		<dc:language>${metadata.language}</dc:language>
		<dc:date>${currentDate}</dc:date>
		${metadata.publisher ? `<dc:publisher>${this.escapeXml(metadata.publisher)}</dc:publisher>` : ''}
		${metadata.description ? `<dc:description>${this.escapeXml(metadata.description)}</dc:description>` : ''}
		${metadata.subject ? `<dc:subject>${this.escapeXml(metadata.subject)}</dc:subject>` : ''}
		${metadata.rights ? `<dc:rights>${this.escapeXml(metadata.rights)}</dc:rights>` : ''}
		<meta property="dcterms:modified">${new Date().toISOString().replace(/\.\d{3}/, '')}</meta>
	</metadata>
	<manifest>
		<item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
		<item id="style" href="Styles/style.css" media-type="text/css"/>
		<item id="title" href="Text/title.xhtml" media-type="application/xhtml+xml"/>
		<item id="chapter1" href="Text/chapter1.xhtml" media-type="application/xhtml+xml"/>
	</manifest>
	<spine toc="ncx">
		<itemref idref="title"/>
		<itemref idref="chapter1"/>
	</spine>
</package>`;
    }
    /**
     * Generate toc.ncx file
     */
    generateTocNcx(metadata) {
        return `<?xml version="1.0" encoding="utf-8"?>
<ncx version="2005-1" xmlns="http://www.daisy.org/z3986/2005/ncx/">
	<head>
		<meta name="dtb:uid" content="${metadata.identifier}"/>
		<meta name="dtb:depth" content="1"/>
		<meta name="dtb:totalPageCount" content="0"/>
		<meta name="dtb:maxPageNumber" content="0"/>
	</head>
	<docTitle>
		<text>${this.escapeXml(metadata.title || '')}</text>
	</docTitle>
	<navMap>
		<navPoint id="navpoint-1" playOrder="1">
			<navLabel>
				<text>Title</text>
			</navLabel>
			<content src="Text/title.xhtml"/>
		</navPoint>
		<navPoint id="navpoint-2" playOrder="2">
			<navLabel>
				<text>Chapter 1</text>
			</navLabel>
			<content src="Text/chapter1.xhtml"/>
		</navPoint>
	</navMap>
</ncx>`;
    }
    /**
     * Generate basic CSS
     */
    generateBasicCss() {
        return `/* Basic EPUB Styles */

body {
	font-family: Georgia, serif;
	font-size: 1em;
	line-height: 1.6;
	margin: 1em;
	text-align: justify;
}

h1, h2, h3, h4, h5, h6 {
	font-family: Arial, sans-serif;
	line-height: 1.3;
	margin-top: 1.5em;
	margin-bottom: 0.5em;
}

h1 {
	font-size: 2em;
	text-align: center;
	margin-bottom: 1em;
}

h2 {
	font-size: 1.5em;
}

p {
	margin: 0;
	text-indent: 1.5em;
}

p.no-indent {
	text-indent: 0;
}

.center {
	text-align: center;
}

.title-page {
	text-align: center;
	margin-top: 2em;
}

.title-page h1 {
	font-size: 2.5em;
	margin-bottom: 1em;
}

.title-page .author {
	font-size: 1.2em;
	margin-top: 2em;
}`;
    }
    /**
     * Generate title page XHTML
     */
    generateTitlePage(metadata) {
        return `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>${this.escapeXml(metadata.title || '')}</title>
	<link rel="stylesheet" type="text/css" href="../Styles/style.css"/>
</head>
<body>
	<div class="title-page">		<h1>${this.escapeXml(metadata.title || '')}</h1>
		<p class="author">${this.escapeXml(metadata.author || '')}</p>
		${metadata.publisher ? `<p class="publisher">${this.escapeXml(metadata.publisher)}</p>` : ''}
	</div>
</body>
</html>`;
    }
    /**
     * Generate chapter template XHTML
     */
    generateChapterTemplate(chapterNumber) {
        return `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>Chapter ${chapterNumber}</title>
	<link rel="stylesheet" type="text/css" href="../Styles/style.css"/>
</head>
<body>
	<h1>Chapter ${chapterNumber}</h1>
	<p class="no-indent">This is the beginning of chapter ${chapterNumber}. You can edit this content and add more paragraphs as needed.</p>
	<p>This is a sample paragraph with proper indentation. You can continue writing your story here.</p>
</body>
</html>`;
    }
    /**
     * Escape XML special characters
     */
    escapeXml(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
    _fireSoon(...events) {
        this._bufferedEvents.push(...events);
        if (this._fireSoonHandle) {
            clearTimeout(this._fireSoonHandle);
        }
        this._fireSoonHandle = setTimeout(() => {
            this._emitter.fire(this._bufferedEvents);
            this._bufferedEvents.length = 0;
        }, 5);
    }
}
exports.EpubFileSystemProvider = EpubFileSystemProvider;
//# sourceMappingURL=fileSystemProvider.js.map