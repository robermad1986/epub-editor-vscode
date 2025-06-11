#!/bin/bash

# Test script for EPUB Editor v0.1.12 - Synchronization Fix
# This version includes a 100ms delay to fix race conditions

echo "🧪 Testing EPUB Editor v0.1.12 - Synchronization Fix"
echo "=================================================="

# Test file
EPUB_FILE="/Users/rober/EPUB_VSC/El final del bosque - Maria Fasce.epub"

if [ ! -f "$EPUB_FILE" ]; then
    echo "❌ Test EPUB file not found: $EPUB_FILE"
    exit 1
fi

echo "📁 Test file: $EPUB_FILE"
echo "🔧 Version: 0.1.12 (includes 100ms synchronization delay)"
echo ""

echo "🚀 Opening VS Code with EPUB file..."
echo "Expected behavior:"
echo "- ✅ VS Code opens new window"
echo "- ✅ EPUB file appears in editor" 
echo "- ✅ Notification appears asking to open as virtual folder"
echo "- ✅ Clicking 'Open as Virtual Folder' works immediately"
echo "- ✅ No 'File not found' errors in console"
echo "- ✅ FileSystemProvider properly synchronized"
echo ""

# Open VS Code with the EPUB file
code --new-window "$EPUB_FILE"

echo "✅ VS Code launched with EPUB file"
echo ""
echo "📋 Testing checklist:"
echo "[ ] 1. Notification appeared?"
echo "[ ] 2. Clicked 'Open as Virtual Folder'?"
echo "[ ] 3. EPUB opened as workspace folder without errors?"
echo "[ ] 4. Can browse files in the EPUB structure?"
echo "[ ] 5. No console errors about 'currentEpubName: undefined'?"
echo "[ ] 6. No console errors about 'Root entries: 0'?"
echo ""
echo "🔍 To check console logs:"
echo "   Help -> Toggle Developer Tools -> Console tab"
echo ""
echo "Expected fix: The 100ms delay should prevent race conditions"
echo "where VS Code tries to access FileSystemProvider before it's ready."