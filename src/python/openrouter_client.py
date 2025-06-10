#!/usr/bin/env python3
"""
OpenRouter AI Client para EPUB Editor Extension
Maneja la comunicación con OpenRouter API para funcionalidades de IA
"""

import sys
import json
import requests
import argparse
from typing import Dict, Any, Optional

class OpenRouterClient:
    """Cliente para comunicación con OpenRouter API"""
    
    # Modelos gratuitos potentes recomendados con información de contexto
    FREE_MODELS = {
        "google/gemini-2.0-flash-exp:free": {
            "name": "Gemini 2.0 Flash Experimental",
            "context": "1M tokens",
            "reasoning": False,
            "description": "Modelo experimental más reciente de Google"
        },
        "nvidia/llama-3.1-nemotron-ultra-253b-v1:free": {
            "name": "Llama 3.1 Nemotron Ultra 253B",
            "context": "128K tokens",
            "reasoning": True,
            "description": "El modelo más grande disponible (253B parámetros)"
        },
        "qwen/qwen3-235b-a22b:free": {
            "name": "Qwen3 235B",
            "context": "256K tokens",
            "reasoning": True,
            "description": "Segundo modelo más grande (235B parámetros)"
        },
        "deepseek/deepseek-r1:free": {
            "name": "DeepSeek R1",
            "context": "128K tokens",
            "reasoning": True,
            "description": "Excelente razonamiento y capacidades avanzadas"
        },
        "microsoft/phi-4-reasoning-plus:free": {
            "name": "Phi-4 Reasoning Plus",
            "context": "128K tokens",
            "reasoning": True,
            "description": "Especializado en razonamiento complejo"
        },
        "nousresearch/hermes-3-llama-3.1-405b:free": {
            "name": "Hermes 3 Llama 405B",
            "context": "128K tokens",
            "reasoning": True,
            "description": "Modelo ultra potente de 405B parámetros"
        },
        "qwen/qwen3-8b:free": {
            "name": "Qwen3 8B (Rápido)",
            "context": "32K tokens",
            "reasoning": False,
            "description": "Modelo pequeño y rápido con excelente balance velocidad/calidad"
        }
    }
    
    def __init__(self, api_key: str, model: str = "google/gemini-2.0-flash-exp:free"):
        self.api_key = api_key
        self.model = model
        self.base_url = "https://openrouter.ai/api/v1"
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://github.com/robermad1986/epub-vscode-extension",
            "X-Title": "EPUB Editor VS Code Extension"
        }
    
    def _make_request(self, endpoint: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Realiza request HTTP a OpenRouter API"""
        try:
            response = requests.post(
                f"{self.base_url}/{endpoint}",
                headers=self.headers,
                json=data,
                timeout=30
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {"error": f"Request failed: {str(e)}"}
        except json.JSONDecodeError as e:
            return {"error": f"Invalid JSON response: {str(e)}"}
    
    def improve_text(self, text: str, language: str = "es") -> Dict[str, Any]:
        """Mejora el texto con IA para fluidez narrativa"""
        prompt = f"""
Como editor profesional, mejora el siguiente texto para mayor fluidez narrativa y estilo literario.
Mantén el significado original pero mejora la expresión, cohesión y ritmo.
Responde SOLO con el texto mejorado, sin explicaciones adicionales.

Idioma: {language}
Texto a mejorar:
{text}
"""
        
        data = {
            "model": self.model,
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 2000,
            "temperature": 0.7
        }
        
        return self._make_request("chat/completions", data)
    
    def correct_grammar(self, text: str, language: str = "es") -> Dict[str, Any]:
        """Corrige ortografía y gramática del texto"""
        prompt = f"""
Como corrector profesional, corrige únicamente errores ortográficos y gramaticales en el siguiente texto.
NO cambies el estilo ni el contenido, solo corrige errores.
Responde SOLO con el texto corregido, sin explicaciones adicionales.

Idioma: {language}
Texto a corregir:
{text}
"""
        
        data = {
            "model": self.model,
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 2000,
            "temperature": 0.3
        }
        
        return self._make_request("chat/completions", data)
    
    def translate_text(self, text: str, target_language: str, source_language: str = "auto") -> Dict[str, Any]:
        """Traduce texto manteniendo formato EPUB"""
        prompt = f"""
Traduce el siguiente texto de {source_language} a {target_language}.
Mantén el formato, etiquetas HTML/XML y estructura original.
Responde SOLO con el texto traducido, sin explicaciones adicionales.

Texto a traducir:
{text}
"""
        
        data = {
            "model": self.model,
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 2000,
            "temperature": 0.5
        }
        
        return self._make_request("chat/completions", data)
    
    def expand_paragraph(self, text: str, language: str = "es") -> Dict[str, Any]:
        """Expande un párrafo con más detalles y descripción"""
        prompt = f"""
Como escritor profesional, expande el siguiente párrafo añadiendo más detalles, descripción y profundidad.
Mantén el estilo y tono original pero enriquece el contenido.
Responde SOLO con el párrafo expandido, sin explicaciones adicionales.

Idioma: {language}
Párrafo a expandir:
{text}
"""
        
        data = {
            "model": self.model,
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 2000,
            "temperature": 0.8
        }
        
        return self._make_request("chat/completions", data)
    
    def summarize_text(self, text: str, language: str = "es") -> Dict[str, Any]:
        """Resume el texto seleccionado"""
        prompt = f"""
Crea un resumen conciso del siguiente texto, manteniendo los puntos clave y el mensaje principal.
Responde SOLO con el resumen, sin explicaciones adicionales.

Idioma: {language}
Texto a resumir:
{text}
"""
        
        data = {
            "model": self.model,
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 1000,
            "temperature": 0.5
        }
        
        return self._make_request("chat/completions", data)
    
    def custom_prompt(self, text: str, custom_prompt: str, language: str = "es") -> Dict[str, Any]:
        """Procesa texto con prompt personalizado"""
        full_prompt = f"""
{custom_prompt}

Idioma de respuesta: {language}
Texto a procesar:
{text}
"""
        
        data = {
            "model": self.model,
            "messages": [
                {"role": "user", "content": full_prompt}
            ],
            "max_tokens": 2000,
            "temperature": 0.7
        }
        
        return self._make_request("chat/completions", data)
    
    @classmethod
    def get_available_models(cls) -> Dict[str, Dict[str, Any]]:
        """Retorna la lista de modelos gratuitos disponibles"""
        return cls.FREE_MODELS
    
    def get_current_model_info(self) -> Dict[str, Any]:
        """Retorna información del modelo actual"""
        return self.FREE_MODELS.get(self.model, {
            "name": "Modelo personalizado",
            "context": "Desconocido", 
            "reasoning": False,
            "description": f"Modelo: {self.model}"
        })

def extract_content(response: Dict[str, Any]) -> str:
    """Extrae el contenido de la respuesta de OpenRouter"""
    if "error" in response:
        return f"Error: {response['error']}"
    
    try:
        return response["choices"][0]["message"]["content"].strip()
    except (KeyError, IndexError):
        return "Error: Invalid response format"

def main():
    """Función principal para uso desde línea de comandos"""
    parser = argparse.ArgumentParser(description="OpenRouter AI Client for EPUB Editor")
    parser.add_argument("--api-key", required=True, help="OpenRouter API Key")
    parser.add_argument("--action", required=True, 
                       choices=["improve", "correct", "translate", "expand", "summarize", "custom", "list-models"],
                       help="Action to perform")
    parser.add_argument("--text", help="Text to process")
    parser.add_argument("--language", default="es", help="Language code (default: es)")
    parser.add_argument("--target-language", help="Target language for translation")
    parser.add_argument("--custom-prompt", help="Custom prompt for 'custom' action")
    parser.add_argument("--model", default="google/gemini-2.0-flash-exp:free", 
                       help="AI model to use (default: google/gemini-2.0-flash-exp:free)")
    
    args = parser.parse_args()
    
    # Acción especial para listar modelos
    if args.action == "list-models":
        models = OpenRouterClient.get_available_models()
        result = {
            "success": True,
            "models": models
        }
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return
    
    # Validar API Key para otras acciones
    if not args.api_key or len(args.api_key) < 10:
        print(json.dumps({"error": "Invalid API Key"}))
        sys.exit(1)
    
    # Validar que el texto sea requerido para acciones que no sean list-models
    if not args.text:
        print(json.dumps({"error": "Text is required for this action"}))
        sys.exit(1)
    
    client = OpenRouterClient(args.api_key, args.model)
    
    try:
        response = None
        if args.action == "improve":
            response = client.improve_text(args.text, args.language)
        elif args.action == "correct":
            response = client.correct_grammar(args.text, args.language)
        elif args.action == "translate":
            if not args.target_language:
                print(json.dumps({"error": "Target language required for translation"}))
                sys.exit(1)
            response = client.translate_text(args.text, args.target_language, "auto")
        elif args.action == "expand":
            response = client.expand_paragraph(args.text, args.language)
        elif args.action == "summarize":
            response = client.summarize_text(args.text, args.language)
        elif args.action == "custom":
            if not args.custom_prompt:
                print(json.dumps({"error": "Custom prompt required for custom action"}))
                sys.exit(1)
            response = client.custom_prompt(args.text, args.custom_prompt, args.language)
        
        if response:
            # Extraer contenido y devolver resultado
            content = extract_content(response)
            result = {
                "success": True,
                "content": content,
                "original_text": args.text,
                "action": args.action,
                "model": args.model,
                "model_info": client.get_current_model_info()
            }
            
            print(json.dumps(result, ensure_ascii=False))
        
    except Exception as e:
        error_result = {
            "success": False,
            "error": str(e),
            "action": args.action,
            "model": args.model
        }
        print(json.dumps(error_result, ensure_ascii=False))
        sys.exit(1)

if __name__ == "__main__":
    main()
