#!/bin/bash
# Script para activar el entorno virtual de Python en bash

echo "Activando entorno virtual de Python..."
source "$(dirname "$0")/venv/Scripts/activate"

echo ""
echo "Entorno virtual activado. Ahora puedes usar:"
echo "- python scripts/yahoo_finance_analyzer.py AAPL MSFT"
echo "- pip install [paquete]" 
echo "- python -m pip list"
echo ""
echo "Para desactivar el entorno virtual, usa: deactivate"
echo ""

# Mantener la sesión activa
exec bash