@echo off
REM Script para activar el entorno virtual de Python
echo Activando entorno virtual de Python...
call "%~dp0venv\Scripts\activate.bat"
echo.
echo Entorno virtual activado. Ahora puedes usar:
echo - python scripts/yahoo_finance_analyzer.py AAPL MSFT
echo - pip install [paquete]
echo - python -m pip list
echo.
echo Para desactivar el entorno virtual, usa: deactivate
echo.
cmd /k