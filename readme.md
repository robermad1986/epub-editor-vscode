# EPUB Editor for Visual Studio Code

![Version](https://img.shields.io/badge/version-0.1.13-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![VS Code](https://img.shields.io/badge/VS%20Code-1.80.0+-brightgreen)
![AI](https://img.shields.io/badge/AI-Powered-orange)
![Python](https://img.shields.io/badge/Python-3.7+-yellow)
[![Marketplace](https://img.shields.io/visual-studio-marketplace/v/pishu.epub-editor?label=VS%20Code%20Marketplace)](https://marketplace.visualstudio.com/items?itemName=pishu.epub-editor)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/pishu.epub-editor)](https://marketplace.visualstudio.com/items?itemName=pishu.epub-editor)
[![GitHub Issues](https://img.shields.io/github/issues/robermad1986/epub-editor-vscode)](https://github.com/robermad1986/epub-editor-vscode/issues)

A powerful Visual Studio Code extension that allows you to **create, edit, and manage EPUB files** directly within VS Code. **Now with RELIABLE context menu integration** - the critical race condition has been fixed in v0.1.13! Features **native AI integration** with 7 free AI models, **auto-save functionality**, and **seamless EPUB editing experience**. 

🎯 **LATEST UPDATE v0.1.13**: Fixed the context menu race condition - "Open as Virtual Folder" now works reliably every time without manual extension management!

🎯 **LATEST UPDATE v0.1.13**: Fixed the context menu race condition - "Open as Virtual Folder" now works reliably every time without manual extension management!

## ✨ Features

### 🚀 **CRITICAL FIX v0.1.13** - Context Menu Race Condition Resolved ⭐

**Finally! The most requested fix is here:**
- ✅ **"Open as Virtual Folder" works immediately** - Right-click any EPUB file and the context menu appears every time
- ✅ **No more manual extension management** - No need to disable/enable the extension anymore  
- ✅ **Works in new VS Code windows** - Perfect reliability when opening EPUB files in fresh VS Code instances
- ✅ **Zero configuration required** - Install and use immediately
- ✅ **Professional workflow support** - Reliable for daily publishing and editing tasks

This was the #1 user-reported issue - now completely resolved with proper FileSystemProvider synchronization!

### 🧠 **7 Free AI Models for Content Enhancement** ⭐

Choose from powerful AI models for editorial assistance:
- **Gemini 2.0 Flash Experimental** (1M context) - Latest Google model
- **NVIDIA Llama 3.1 Nemotron Ultra** (253B parameters) - Largest available
- **Qwen3 235B** (256K context) - Massive context window
- **DeepSeek R1** (128K context) - Advanced reasoning
- **Microsoft Phi-4 Reasoning Plus** - Complex reasoning specialist
- **Hermes 3 Llama 405B** - Ultra-powerful 405B parameters
- **Qwen3 8B** - Fast and efficient balance

### 🎯 **Complete EPUB Workspace Integration**

- **Virtual File System**: EPUB files appear as normal project folders in VS Code
- **Direct File Editing**: Edit XHTML, CSS, XML, and images with full VS Code features
- **Auto-save with Backups**: Automatic saving with backup creation for safety
- **Syntax Highlighting**: Full IntelliSense and syntax support for all EPUB formats
- **Git Integration**: Version control your EPUB projects like any other codebase

### 🔔 **Enhanced User Experience**

- **Smart Notifications**: Auto-dismissing messages that don't interrupt your workflow
- **Status Bar Integration**: Key information displayed elegantly in the status bar
- **Selective Modality**: Only critical dialogs require user interaction
- **Clean Interface**: Focus on writing without notification clutter

### 📚 **EPUB Creation & Management**

- **Create New EPUBs**: Start from scratch with guided metadata setup
- **Open Existing Files**: Any EPUB file becomes a VS Code workspace
- **Professional Editing**: Edit all content types with full VS Code capabilities
- **Auto-save & Backups**: Never lose your work with intelligent save management

### 🧠 **AI Editorial Assistant** - 7 Free Models Available

**Powerful AI features via OpenRouter:**
- 🧠 **Text Improvement** - Enhance narrative flow and style
- ✏️ **Grammar Correction** - Fix errors while preserving your voice  
- 🌐 **Smart Translation** - Context-aware translation
- 📝 **Content Expansion** - Add depth to paragraphs
- 📄 **Summarization** - Create concise summaries

**Available Models**: Gemini 2.0, NVIDIA Llama Ultra (253B), Qwen3 (235B), DeepSeek R1, Microsoft Phi-4, Hermes 3 (405B), Qwen3 8B

**Access**: Right-click any selected text for instant AI assistance
- **🔧 AI Management**: Test connections, switch models, view model information

### 🎯 **Core Capabilities**

- ✅ **Virtual File System**: Browse EPUB contents like a regular folder
- ✅ **Full Edit Support**: Modify text, styles, metadata, and structure
- ✅ **Auto-Save**: Changes are automatically saved to the EPUB file
- ✅ **Backup System**: Automatic timestamped backups (keeps 5 most recent)
- ✅ **Status Tracking**: Track which files have been modified
- ✅ **Metadata Viewer**: Display and edit EPUB metadata
- ✅ **UUID Generation**: Automatic unique identifiers for new EPUBs

### 🆕 **EPUB Creation Wizard**

- Interactive metadata wizard (title, author, language, publisher, etc.)
- Complete EPUB 3.0 structure generation
- Basic CSS and XHTML templates included
- Automatic workspace loading after creation

## 🚀 Quick Start with AI

### 1. **Setup AI Integration**

```bash
# Get your free API key from OpenRouter.ai
# Configure in VS Code: Ctrl+Shift+P → "EPUB AI: Configure API Key"
```

### 2. **Choose Your AI Model**

```bash
# Access via Command Palette
Ctrl+Shift+P → "EPUB AI: Select AI Model"
# Choose based on your needs:
# - Gemini 2.0: Best for long documents (novels, books)
# - NVIDIA Nemotron 253B: Ultra-powerful for complex tasks
# - Qwen3 235B: Large-scale processing with massive context
# - DeepSeek R1: Advanced reasoning and analysis
# - Phi-4 Reasoning Plus: Specialized complex reasoning
# - Hermes 3 Llama 405B: Ultra-powerful processing
# - Qwen3 8B: Fast and efficient for quick tasks
```

### 3. **Start Editing with AI**

```bash
# Select any text in your EPUB files
# Right-click → Choose AI function:
# 🧠 Improve text style and flow
# ✏️ Fix grammar and spelling
# 🌐 Translate to another language
# 📝 Expand with more detail
# 📄 Summarize content
```

## 🔔 Non-Intrusive Workflow ⭐ **NEW in v0.1.8**

Experience seamless EPUB editing with our enhanced notification system:

- **🚀 Auto-Dismissing Messages**: All routine notifications disappear automatically
- **⏱️ Smart Timing**: Different timeouts for different message types
- **📍 Status Bar Integration**: Key information shown in status bar without blocking workflow
- **🎯 Focus on Writing**: No more manual dismissal of routine confirmations

**Example Workflow:**
1. Open EPUB → Brief loading message in status bar (2s)
2. Edit content → Seamless editing without interruptions
3. Save changes → Quick confirmation in status bar (3s)
4. Continue writing → Uninterrupted creative flow

> 📖 **Complete Guide**: See [AI-USER-GUIDE.md](AI-USER-GUIDE.md) for detailed setup and usage instructions

## 🚧 Pending Features

### 📋 Roadmap v0.2.0 - In Development

#### 🎨 **UX Improvements**

- [ ] **Real-time Preview**: EPUB rendered visualization within VS Code
- [ ] **Breadcrumb Navigation**: Hierarchical navigation through EPUB structure
- [ ] **Structure Panel**: Tree view with all chapters and sections
- [ ] **Custom Themes**: EPUB-specific editing themes

#### ✏️ **Advanced Metadata Editor**

- [ ] **Graphical Editor**: Visual interface for editing metadata without touching XML
- [ ] **Author Management**: Add/edit multiple authors with roles
- [ ] **Custom Fields**: Support for publisher-specific metadata
- [ ] **Real-time Validation**: Automatic verification of required metadata

#### 🔍 **Validation and Verification**

- [ ] **Complete EPUB Validator**: Integration with epubcheck
- [ ] **Link Verification**: Detect broken internal and external links
- [ ] **Image Validation**: Verify all images exist and have valid formats
- [ ] **Accessibility Analysis**: Check compliance with accessibility standards

#### 🎬 **Advanced Content Management**

- [ ] **Reorder Chapters**: Drag and drop to reorganize structure
- [ ] **Add/Remove Files**: Complete file management from the interface
- [ ] **Image Optimization**: Automatic image compression
- [ ] **Style Management**: Visual CSS editor with preview

#### 📤 **Import and Export**

- [ ] **Export to PDF**: Direct EPUB to PDF conversion
- [ ] **Export to MOBI**: Kindle device compatibility
- [ ] **Import from Word**: Convert .docx documents to EPUB
- [ ] **Import from Markdown**: Convert .md files to EPUB structure

### 🧠 **Roadmap v0.2.5 - AI Content Assistant Integration** ⭐

> **🎯 The Key Differentiator**: Sprint focused exclusively on AI to get early user feedback

#### 🤖 **Native AI Assistant**

- [X] **Python-TypeScript Bridge**: Communication with OpenRouter backend for AI processing
- [X] **Contextual AI Commands**: Right-click menu with text improvement, correction and translation options
- [ ] **AI Chat Panel**: Side view for personalized conversations with the assistant
- [X] **Secure Configuration**: OpenRouter API Key management in VS Code Settings

#### ✨ **Editorial-Specific AI Features**

- [X] **Improve text with AI**: Suggest narrative flow and style improvements
- [X] **Grammar and spelling correction**: Intelligent context-aware error analysis
- [X] **Text translation**: Contextual translation preserving EPUB format
- [X] **Specialized prompts**: Templates specific for authors and editors

> 📋 **Complete details**: See [ROADMAP-v0.2.5-AI.md](ROADMAP-v0.2.5-AI.md)

### 🔮 Roadmap v0.3.0 - Advanced Features

#### 📚 **Templates and Automation**

- [ ] **Predefined Templates**: Templates for different book types (novel, technical manual, etc.)
- [ ] **Chapter Assistant**: Automatic generation of new chapters with structure
- [ ] **Automatic Index**: Automatic generation of indexes and table of contents
- [ ] **Automatic Numbering**: Automatic chapter and page numbering

#### 🎵 **Multimedia and Rich Content**

- [ ] **Audio Support**: Audio file integration for audiobooks
- [ ] **Video Support**: Multimedia content embedding
- [ ] **Interactive Annotations**: Interactive footnotes
- [ ] **Dynamic Glossary**: Automatic term and definition management

#### 🛠️ **Author Tools**

- [ ] **Spell Check**: Integration with spell checkers in multiple languages
- [ ] **Document Statistics**: Word count, characters, estimated reading time
- [ ] **Integrated Version Control**: EPUB-specific change history
- [ ] **Real-time Collaboration**: Collaborative editing with other authors/editors

#### 🔌 **Integrations**

- [ ] **GitHub Integration**: Automatic synchronization with repositories
- [ ] **Publishing Service Integration**: Direct connection with publishing platforms
- [ ] **Extension API**: Allow other extensions to interact with EPUB Editor
- [ ] **Custom Plugins**: Plugin system for specific functionalities

### 💡 Have Ideas?

Is there any functionality you'd like to see implemented?

- 📧 Contact us through GitHub Issues
- 🗳️ Vote for the most important features
- 🤝 Contribute to project development

### 📊 Current Status

- ✅ **Basic Features**: 100% implemented
- 🔶 **v0.2.0**: 50% completed
- 🧠 **v0.2.5 (AI)**: Completed - The key differentiator
- ⏳ **v0.3.0**: In planning

## 🚀 Quick Start

### Installation

#### **Option 1: VS Code Marketplace** ⭐ **RECOMMENDED**

1. **From VS Code Extensions view**:
   - Press `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (Mac)
   - Search for "EPUB Editor"
   - Click **Install** on the extension by **Pishu**

2. **From Command Line**:
   ```bash
   code --install-extension pishu.epub-editor
   ```

3. **From VS Code Marketplace**:
   - Visit: https://marketplace.visualstudio.com/items?itemName=pishu.epub-editor
   - Click **Install**

#### **Option 2: Manual Installation** (Advanced users)

1. **From GitHub Releases**:
   - Download latest `.vsix` from [Releases](https://github.com/robermad1986/epub-editor-vscode/releases)
   - Install: `code --install-extension epub-editor-0.1.8.vsix`

2. **From source**:
   ```bash
   git clone https://github.com/robermad1986/epub-editor-vscode.git
   cd epub-editor-vscode
   npm install
   npm run compile
   npm run package
   code --install-extension epub-editor-0.1.8.vsix
   ```

### Usage

#### Creating a New EPUB

1. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Type **"EPUB: Create New EPUB"**
3. Follow the metadata wizard:
   - Enter book title and author (required)
   - Select language and add optional details
   - Choose save location
4. The new EPUB loads automatically in your workspace

#### Opening an Existing EPUB

1. Right-click on any `.epub` file in VS Code Explorer
2. Select **"Open as Virtual Folder"**
3. The EPUB structure appears as a workspace folder
4. Edit any file directly - changes auto-save to the EPUB

## 📖 Complete Usage Guide

### 🆕 **How to Create a New EPUB**

#### **Step by Step:**

1. **Start Creation**:

   - Open Command Palette: `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
   - Type: **"EPUB: Create New EPUB"** and select the command
   - The command is available at any time, you don't need to have an EPUB open
2. **Metadata Wizard** (Interactive):

   - **📚 Title** (required): Enter the book title (e.g.: "My Great Novel")
   - **✍️ Author** (required): Author name (e.g.: "John Doe")
   - **🌍 Language**: Select from predefined list or enter custom code
     - Options: English (en), Spanish (es), French (fr), German (de), Italian (it), Portuguese (pt)
     - Or select "Other..." to enter codes like `ja`, `zh`, `ru`, etc.
   - **🏢 Publisher** (optional): Publishing house name
   - **📝 Description** (optional): Book summary
   - **🏷️ Category/Genre** (optional): Fiction, Non-Fiction, Biography, etc.
   - **©️ Rights** (optional): Copyright information
3. **Save the File**:

   - Select location and filename for the `.epub` file
   - File is automatically suggested with the book title
   - Progress bar is shown during creation
4. **Result**:

   ```
   📖 MyBook.epub
   ├── 📄 mimetype (application/epub+zip)
   ├── 📁 META-INF/
   │   └── 📄 container.xml (configuration)
   └── 📁 OEBPS/
       ├── 📄 content.opf (book metadata)
       ├── 📄 toc.ncx (table of contents)
       ├── 📁 Text/
       │   ├── 📄 title.xhtml (title page)
       │   └── 📄 chapter1.xhtml (first chapter)
       └── 📁 Styles/
           └── 📄 style.css (basic styles)
   ```
5. **Automatic Loading**:

   - The new EPUB automatically opens in your workspace
   - You can immediately start editing the files

### 💾 **How to Save an EPUB**

#### **Automatic Save System:**

- **🔄 Smart Auto-save**: Changes are automatically saved when pressing `Ctrl+S` (`Cmd+S` on Mac) on any file
- **📋 Change Tracking**: The system tracks which files have been modified
- **🛡️ Automatic Backups**: Timestamped backup copies are created before each save

#### **Save Methods:**

1. **Quick Save** (Recommended):

   - **Shortcut**: `Ctrl+Shift+S` (Windows/Linux) or `Cmd+Shift+S` (Mac)
   - **Command**: **"EPUB: Save EPUB File"** from Command Palette
   - Saves all pending changes instantly
2. **Save with Confirmation**:

   - **Command**: **"EPUB: Save EPUB File (with confirmation)"**
   - Shows dialog with number of modified files
   - Allows cancellation before confirming save
3. **Individual Auto-save**:

   - When editing any file and saving with `Ctrl+S`, auto-save is triggered
   - Shows notification: "📚 EPUB saved" in status bar

#### **Backup System:**

- **📁 Location**: Same folder as original EPUB
- **🕒 Format**: `BookName.epub.backup.1686234567890`
- **📊 Management**: Automatically keeps the 5 most recent copies
- **🗑️ Cleanup**: Old backups are automatically deleted

#### **Check Save Status:**

- **Command**: **"EPUB: EPUB Status"**
- **Shortcut**: `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Shift+I` (Mac)
- **Information shown**:
  - 📁 Total files in EPUB
  - ✏️ Number of modified files
  - 💾 General status (saved / pending changes)

### ✅ **How to Validate an EPUB**

#### **State and Modification Verification:**

1. **General EPUB Status**:

   - **Command**: **"EPUB: EPUB Status"**
   - **Shortcut**: `Ctrl+Shift+I` / `Cmd+Shift+I`
   - **Shows**:
     - Total number of files
     - Modified unsaved files
     - Synchronization status
2. **List Modified Files**:

   - **Command**: **"EPUB: List Modified Files"**
   - **Functionality**: Detailed list of all files with pending changes
   - **Useful for**: Reviewing what needs to be saved before closing
3. **EPUB Metadata**:

   - **Command**: **"EPUB: Show EPUB Metadata"**
   - **Information shown**:
     - 📚 Book title
     - ✍️ Author
     - 🌍 Language
     - 🏢 Publisher
     - 🆔 Unique identifier (UUID)

#### **Visual Validation Indicators:**

1. **Status Bar**:

   - 📊 Modified files counter: "📚 EPUB: 3 files modified"
   - 💾 Save confirmation: "📚 EPUB saved"
   - ⚠️ Alerts if there are problems
2. **File Explorer**:

   - Modified files appear visually marked
   - Hierarchical structure shows EPUB organization
3. **System Notifications**:

   - ✅ Confirmation when saved successfully
   - 📝 Progress during save operations
   - ⚠️ Errors if something fails

#### **Basic Structure Validation:**

**The system automatically verifies:**

- ✅ **mimetype**: Must contain "application/epub+zip"
- ✅ **META-INF/container.xml**: Valid configuration file
- ✅ **content.opf**: Complete metadata and manifest
- ✅ **XHTML files**: Correct syntax
- ✅ **CSS links**: Valid style references

#### **Manual Validation Process:**

1. **Before Publishing**:

   ```
   1. Run: "EPUB: EPUB Status" → Verify 0 modified files
   2. Run: "EPUB: Show EPUB Metadata" → Review information
   3. Open key files (content.opf, toc.ncx) → Verify structure
   4. Test chapter links → Functional navigation
   ```
2. **Content Verification**:

   - 📄 Review that all chapters are present
   - 🎨 Verify CSS styles apply correctly
   - 🖼️ Check that images load (if any)
   - 🔗 Test navigation in table of contents

### 🔧 **Recommended Workflow**

#### **For Authors (Creating from Scratch):**

```
1. "EPUB: Create New EPUB" → Create initial structure
2. Edit title.xhtml → Customize title page
3. Edit chapter1.xhtml → Write first chapter
4. Create additional chapters → Duplicate and modify chapter1.xhtml
5. Update content.opf and toc.ncx → Add new chapters to manifest
6. Ctrl+Shift+S → Save regularly
7. "EPUB: EPUB Status" → Verify before distribution
```

#### **For Editors (Modifying Existing EPUBs):**

```
1. Right-click on file.epub → "Open as Virtual Folder"
2. "EPUB: Show EPUB Metadata" → Review current information
3. Edit necessary files → Make corrections
4. "EPUB: List Modified Files" → Verify changes
5. Ctrl+Shift+S → Save changes
6. Verify automatic backup → Additional security
```

#### **Essential Keyboard Shortcuts:**

- `Ctrl+Shift+P` (`Cmd+Shift+P`) → Command Palette
- `Ctrl+Shift+S` (`Cmd+Shift+S`) → Save EPUB
- `Ctrl+Shift+I` (`Cmd+Shift+I`) → EPUB Status
- `Ctrl+S` (`Cmd+S`) → Save individual file (triggers auto-save)

---

**💡 Pro Tip**: Use auto-save frequently during editing and check status before closing VS Code to ensure all your changes are preserved.

## 🎮 Commands

### 📚 **Core EPUB Commands**

| Command                          | Description                         | Shortcut                 |
| -------------------------------- | ----------------------------------- | ------------------------ |
| `EPUB: Create New EPUB`        | Create a new EPUB file from scratch | -                        |
| `EPUB: Open as Virtual Folder` | Open EPUB as workspace folder       | Right-click context menu |
| `EPUB: Save EPUB File`         | Save all changes to EPUB            | `Ctrl+Shift+S`         |
| `EPUB: EPUB Status`            | Show modification status            | `Ctrl+Shift+I`         |
| `EPUB: Show EPUB Metadata`     | Display book metadata               | -                        |
| `EPUB: List Modified Files`    | Show files with unsaved changes     | -                        |
| `EPUB: Close EPUB File`        | Close EPUB workspace                | -                        |
| `EPUB: Refresh EPUB`           | Refresh file explorer               | -                        |

### 🧠 **AI-Powered Commands** ⭐ **UPDATED in v0.1.7**

#### **AI Setup & Configuration**

| Command                         | Description                                 | Icon |
| ------------------------------- | ------------------------------------------- | ---- |
| `EPUB AI: Configure API Key`  | Set up OpenRouter API key securely          | 🔑   |
| `EPUB AI: Test AI Connection` | Verify API connection and model access      | 🧪   |
| `EPUB AI: Select AI Model`    | Choose from 5 available AI models           | 🤖   |
| `EPUB AI: Model Information`  | View current model details and capabilities | ℹ️ |

#### **AI Editorial Functions** (Available via Right-Click on Selected Text)

| Function                                | Description                                    | Use Case                              | Icon |
| --------------------------------------- | ---------------------------------------------- | ------------------------------------- | ---- |
| **Improve Text with AI**          | Enhance narrative flow and literary style      | Polish paragraphs, improve expression | 🧠   |
| **Grammar & Spelling Correction** | Fix errors without changing style              | Final manuscript review               | ✏️ |
| **Translate Text**                | Contextual translation maintaining EPUB format | Book localization                     | 🌐   |
| **Expand Paragraph**              | Add depth and detail to content                | Enrich descriptions, add context      | 📝   |
| **Summarize Text**                | Create concise summaries                       | Chapter summaries, synopses           | 📄   |

#### **AI Model Options**

| Model                                          | Context Size | Best For                                    | Free |
| ---------------------------------------------- | ------------ | ------------------------------------------- | ---- |
| **Gemini 2.0 Flash Experimental**        | 1M tokens    | Long documents, novels                      | ✅   |
| **NVIDIA Llama 3.1 Nemotron Ultra 253B** | 128K tokens  | Ultra-complex tasks (253B parameters)       | ✅   |
| **Qwen3 235B**                           | 256K tokens  | Large-scale processing (235B parameters)    | ✅   |
| **DeepSeek R1**                          | 128K tokens  | Advanced reasoning and analysis             | ✅   |
| **Microsoft Phi-4 Reasoning Plus**       | 128K tokens  | Complex reasoning tasks                     | ✅   |
| **Hermes 3 Llama 405B**                  | 128K tokens  | Ultra-powerful processing (405B parameters) | ✅   |
| **Qwen3 8B**                             | 32K tokens   | Fast processing with quality balance        | ✅   |

## 📁 Supported EPUB Structure

The extension supports full EPUB 3.0 structure:

```text
📖 MyBook.epub
├── 📄 mimetype
├── 📁 META-INF/
│   └── 📄 container.xml
└── 📁 OEBPS/
    ├── 📄 content.opf        # Package metadata
    ├── 📄 toc.ncx           # Navigation
    ├── 📁 Text/             # XHTML content
    │   ├── 📄 title.xhtml
    │   ├── 📄 chapter1.xhtml
    │   └── 📄 ...
    ├── 📁 Styles/           # CSS stylesheets
    │   └── 📄 style.css
    └── 📁 Images/           # Images and media
        └── 📄 cover.jpg
```

## 💡 Use Cases

### ✍️ **Authors & Writers**

- Write and edit your ebook chapters in VS Code
- Use familiar editor features (IntelliSense, extensions, themes)
- **AI-powered writing assistance** for improving text quality
- Version control your ebook with Git
- Collaborate with editors using VS Code Live Share

### 📚 **Publishers & Editors**

- Edit existing EPUB files for corrections or updates
- **AI-powered editorial workflow** with grammar correction and text improvement
- Maintain consistent formatting across multiple books
- **Multi-language support** with AI translation capabilities
- Quality assurance with syntax highlighting and error detection

### 🛠️ **Developers & Designers**

- Customize EPUB CSS and styling
- Add interactive features to enhanced EPUBs
- Debug EPUB structure and metadata
- Automate EPUB processing workflows

## 🔧 Technical Details

### Built With

- **TypeScript** - Type-safe development
- **JSZip** - EPUB file manipulation
- **UUID** - Unique identifier generation
- **VS Code API** - Deep editor integration
- **Python 3.7+** - AI backend processing
- **OpenRouter API** - Multi-model AI access

### AI Integration Architecture

- **🐍 Python Backend**: OpenRouter client with support for 5 AI models
- **🔗 TypeScript Bridge**: Seamless communication between VS Code and Python
- **📊 Progress Indicators**: Real-time feedback during AI operations
- **⏱️ Timeout Management**: 60-second timeout with proper cleanup
- **🛡️ Error Handling**: Comprehensive error management for API calls
- **🔒 Secure Storage**: API keys stored securely in VS Code settings

### File System Provider

The extension implements a custom `FileSystemProvider` that:

- Mounts EPUB files as virtual directories
- Provides seamless read/write operations
- Maintains file modification tracking
- Handles automatic backup creation
- Integrates with AI processing pipeline

### Supported File Types

- ✅ **XHTML** - Book content with syntax highlighting and AI enhancement
- ✅ **CSS** - Stylesheets with IntelliSense
- ✅ **XML** - Metadata and navigation files
- ✅ **Images** - JPG, PNG, SVG preview and editing
- ✅ **Fonts** - Custom font file management

### AI Model Requirements

- **Python 3.7+** installed on your system
- **OpenRouter account** with API access (free tier available)
- **Internet connection** for AI model access
- **VS Code 1.80.0+** for full compatibility

## 🔄 Installation & Updates

### Installing from VS Code Marketplace (Recommended)

1. **Open VS Code**
2. **Go to Extensions view** (`Ctrl+Shift+X` / `Cmd+Shift+X`)
3. **Search for**: `EPUB Editor`
4. **Click Install** on the extension by `Pishu`

### Installing from VSIX (Alternative)

```bash
# Download the latest VSIX file from GitHub releases
code --install-extension epub-editor-0.1.8.vsix
```

### Setting up AI Features

```bash
# 1. Ensure Python 3.7+ is installed
python3 --version

# 2. Get free API key from OpenRouter.ai
# 3. Configure in VS Code:
#    - Open Command Palette (Ctrl+Shift+P)
#    - Run "EPUB AI: Configure API Key"
#    - Test connection with "EPUB AI: Test AI Connection"
```

### Building from Source

```bash
git clone <repository-url>
cd epub-vscode-extension
npm install
npm run compile
npm run package
code --install-extension epub-editor-0.1.7.vsix
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup

```bash
git clone <repository-url>
cd epub-vscode-extension
npm install
npm run watch    # Compile in watch mode
F5               # Launch Extension Development Host
```

### AI Development

```bash
# Install Python dependencies
cd src/python
pip install -r requirements.txt

# Test AI functionality
python3 openrouter_client.py --help
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔄 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes.

## 📖 Documentation

- **[AI User Guide](AI-USER-GUIDE.md)** - Complete setup and usage guide for AI features
- **[AI Roadmap](ROADMAP-v0.2.5-AI.md)** - Detailed AI development roadmap
- **[Changelog](CHANGELOG.md)** - Version history and updates

## 🐛 Issues & Support

If you encounter any issues or have feature requests, please:

1. **Check existing issues** on GitHub
2. **For AI-related issues**: Include Python version, OS, and error messages
3. **Create a new issue** with detailed description
4. **Include VS Code version** and extension version

### Common AI Issues

- **API Key errors**: Verify your OpenRouter API key is valid
- **Python not found**: Ensure Python 3.7+ is installed and accessible
- **Timeout errors**: Check internet connection and try smaller text selections
- **Model selection**: Use "EPUB AI: Select AI Model" to switch models

---

**Made with ❤️ for the ebook authoring community**

**🧠 Powered by AI for next-generation content creation**
