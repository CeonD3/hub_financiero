# Integración Yahoo Finance - Chatbot WACC

## Descripción

Este sistema integra tu código Python de análisis financiero con el chatbot para obtener datos reales de Yahoo Finance automáticamente.

## Funcionalidad Implementada

### 🐍 Script Python (`scripts/yahoo_finance_analyzer.py`)

- Recibe lista de tickers como parámetros
- Extrae datos de Yahoo Finance:
  - D/C Ratio (Debt-to-Capital)
  - Tasa efectiva de impuesto
  - Beta apalancado
  - Beta desapalancado (calculado)
- Devuelve resultados en formato JSON estructurado
- Incluye estadísticas del grupo (promedio, mediana)

### 🌐 Endpoint PHP (`app/Controllers/YahooFinanceController.php`)

- `/api/analyze-companies` - Analiza lista de tickers
- `/api/calculate-beta` - Calcula beta relevering
- `/api/yahoo-finance/test` - Endpoint de prueba

### 🤖 Chatbot Mejorado

- Detecta automáticamente cuando la IA genera lista de tickers
- Formato requerido: `TICKERS:[AAPL,MSFT,GOOGL,...]`
- Llama automáticamente al endpoint para análisis real
- Presenta resultados estructurados con recomendaciones
- Permite aplicar beta recomendado directamente

## Instalación de Dependencias

### 1. Verificar Python

```bash
# Windows: Python ya está disponible
py --version  # Debe mostrar Python 3.14.0 o superior
```

### 2. Crear y Activar Entorno Virtual

```bash
# Crear entorno virtual (ya creado)
py -m venv venv

# Activar entorno virtual:

# En Windows (CMD):
activate_venv.bat

# En Windows (Bash/Git Bash):
source activate_venv.sh

# O manualmente:
source venv/Scripts/activate
```

### 3. Instalar librerías Python (ya instaladas)

```bash
# Con entorno virtual activado:
pip install -r requirements.txt
```

### 4. Verificar instalación

```bash
# Con entorno virtual activado:
python scripts/yahoo_finance_analyzer.py AAPL MSFT
```

### 5. Probar endpoint de la aplicación

```bash
# Visitar en el navegador:
http://localhost:8001/api/yahoo-finance/test
```

## Uso del Sistema

### 1. Solicitar Análisis en el Chatbot

```
Usuario: "Analiza empresas del sector tecnológico para optimizar mi beta"
```

### 2. La IA Responde con Tickers

```
IA: "Análisis del sector tecnológico solicitado.
TICKERS:[AAPL,MSFT,GOOGL,AMZN,TSLA,NVDA,META,NFLX,CRM,ADBE]
Estas empresas representan..."
```

### 3. Sistema Automático

1. ✅ Detecta formato TICKERS:[...]
2. ✅ Extrae lista de tickers
3. ✅ Llama a `/api/analyze-companies`
4. ✅ Script Python analiza cada empresa
5. ✅ Presenta resultados estructurados
6. ✅ Ofrece opciones de beta recomendado

### 4. Resultados Mostrados

- **Estadísticas del Grupo**: Beta promedio/mediana, D/C ratio promedio
- **Empresas Individuales**: Datos detallados de cada empresa
- **Recomendaciones**: Opciones para aplicar beta optimizado

## Ejemplo de Output

```json
{
  "success": true,
  "valid_companies": [
    {
      "ticker": "AAPL",
      "company_name": "Apple Inc.",
      "dc_ratio": 0.2347,
      "effective_tax_rate": 0.1623,
      "beta_levered": 1.24,
      "beta_unlevered": 1.13
    }
  ],
  "group_statistics": {
    "beta_unlevered_avg": 1.15,
    "beta_unlevered_median": 1.12,
    "dc_ratio_avg": 0.28,
    "tax_rate_avg": 0.19
  }
}
```

## Estructura del Proyecto

```
kapitals/frontend/
├── venv/                          # Entorno virtual de Python
│   ├── Scripts/
│   │   ├── activate.bat          # Activador para Windows CMD
│   │   ├── activate              # Activador para bash
│   │   └── python.exe            # Python del entorno virtual
│   └── Lib/site-packages/        # Paquetes instalados
├── scripts/
│   └── yahoo_finance_analyzer.py  # Script principal de análisis
├── app/Controllers/
│   └── YahooFinanceController.php  # Controlador PHP
├── requirements.txt               # Dependencias Python
├── activate_venv.bat             # Helper para activar venv (Windows)
├── activate_venv.sh              # Helper para activar venv (Bash)
└── YAHOO_FINANCE_INTEGRATION.md  # Esta documentación
```

## Ventajas del Entorno Virtual

✅ **Aislamiento**: Las dependencias no interfieren con otras instalaciones de Python
✅ **Consistencia**: Versiones específicas de paquetes garantizadas
✅ **Portabilidad**: Fácil replicación en otros entornos
✅ **Limpieza**: Fácil eliminación sin afectar el sistema
✅ **Seguridad**: Menor riesgo de conflictos de versiones

## Comandos Útiles del Entorno Virtual

```bash
# Activar entorno virtual
source venv/Scripts/activate          # Bash
# o
activate_venv.bat                     # Windows CMD

# Verificar que está activado (debe mostrar (venv) en el prompt)
which python                          # Debe apuntar a venv/Scripts/python

# Instalar nuevo paquete
pip install nombre_paquete

# Listar paquetes instalados
pip list

# Congelar dependencias actuales
pip freeze > requirements.txt

# Desactivar entorno virtual
deactivate
```

### Robustez

- ✅ Validación de tickers
- ✅ Manejo de errores
- ✅ Timeout de 2 minutos
- ✅ Máximo 30 tickers por solicitud
- ✅ Conversión automática de monedas

### Flexibilidad

- ✅ Soporta empresas internacionales (.TO, .L, .PA)
- ✅ Múltiples etiquetas de balance sheet
- ✅ Cálculo automático de tasa impositiva
- ✅ Fallback para datos faltantes

### UI/UX

- ✅ Diseño WhatsApp-style
- ✅ Resultados interactivos
- ✅ Aplicación directa de recomendaciones
- ✅ Responsive design

## Troubleshooting

### Error: "Python not found"

```bash
# Instalar Python desde python.org
# O desde Microsoft Store
# Reiniciar terminal después de instalación
```

### Error: "yfinance module not found"

```bash
pip install yfinance pandas numpy
```

### Error: "Script not found"

```bash
# Verificar que existe:
ls scripts/yahoo_finance_analyzer.py
```

### Error: Timeout en análisis

- Reducir número de tickers (máximo 20-25)
- Verificar conexión a internet
- Algunos tickers pueden no existir

## Próximos Pasos

1. Instalar Python y dependencias
2. Probar endpoint: `/api/yahoo-finance/test`
3. Solicitar análisis en el chatbot
4. Verificar que los datos se extraen correctamente

¡El sistema está listo para usar una vez instaladas las dependencias!
