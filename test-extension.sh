#!/bin/bash

# Script para verificar el funcionamiento de la extensión EPUB

echo "🧪 Verificando el estado de la extensión EPUB..."
echo ""

# Verificar que la extensión está instalada
echo "📦 Extensiones EPUB instaladas:"
code --list-extensions | grep -i epub
echo ""

# Verificar archivos EPUB en el directorio
echo "📚 Archivos EPUB disponibles para prueba:"
ls -la *.epub 2>/dev/null || echo "No se encontraron archivos EPUB en el directorio actual"
echo ""

# Información sobre cómo probar
echo "🎯 Para probar la extensión:"
echo "1. Abre VS Code: code ."
echo "2. Ve a File → Open"
echo "3. Selecciona un archivo .epub"
echo "4. Observa si aparece la notificación"
echo "5. Verifica la consola de desarrollo (Help → Toggle Developer Tools)"
echo ""

echo "📝 Archivos de log y configuración:"
echo "- package.json: Configuración de la extensión"
echo "- src/extension.ts: Código principal con notificaciones"
echo "- out/extension.js: Código compilado"
echo ""

echo "✅ Script completado"
