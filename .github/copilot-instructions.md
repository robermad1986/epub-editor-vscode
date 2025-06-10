# GitHub Copilot Configuration for EPUB Editor

## Repository Context

This repository contains a Visual Studio Code extension for editing EPUB files with AI integration.

### Key Technologies
- TypeScript (VS Code Extension API)
- Python (AI Backend with OpenRouter)
- JSZip (EPUB file manipulation)
- Virtual File System Provider

### Core Components
- `src/extension.ts` - Main extension entry point
- `src/fileSystemProvider.ts` - EPUB virtual file system
- `src/ai/aiService.ts` - AI integration service
- `src/ai/aiCommands.ts` - AI command implementations
- `src/python/openrouter_client.py` - Python AI backend

### Common Issue Patterns

#### AI-Related Issues
- API key configuration problems
- Python environment issues
- OpenRouter API timeouts
- Model selection and compatibility

#### EPUB Processing Issues
- Large file handling
- Complex EPUB structure support
- Metadata validation
- File encoding problems

#### VS Code Integration Issues
- Virtual file system synchronization
- Auto-save functionality
- Context menu integration
- Command palette registration

### Development Guidelines
- Always maintain TypeScript strict mode
- Use proper error handling for AI operations
- Implement progress indicators for long operations
- Follow VS Code extension best practices

### AI Models Supported
- Gemini 2.0 Flash Experimental (1M context)
- NVIDIA Llama 3.1 Nemotron Ultra 253B (128K context)
- Qwen3 235B (256K context)
- DeepSeek R1 (128K context)
- Microsoft Phi-4 Reasoning Plus (128K context)
- Hermes 3 Llama 405B (128K context)
- Qwen3 8B (32K context)

### Testing Scenarios
- EPUB creation and editing workflows
- AI feature functionality across different models
- Large file performance testing
- Cross-platform compatibility (macOS, Windows, Linux)

## Copilot Assistance Areas

1. **Bug Analysis**: Help diagnose issues from user reports
2. **Feature Implementation**: Suggest implementation approaches for new features
3. **Code Review**: Review pull requests for best practices
4. **Documentation**: Help maintain and improve documentation
5. **Testing**: Suggest test cases and validation scenarios
