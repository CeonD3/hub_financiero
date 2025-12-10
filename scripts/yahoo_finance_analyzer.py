#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para análisis financiero usando Yahoo Finance
Extrae D/C ratio, tasa impositiva efectiva y betas (apalancado/desapalancado)
"""

import yfinance as yf
import pandas as pd
import numpy as np
import json
import sys
import warnings
warnings.filterwarnings('ignore')

def get_fx_rate(currency, fx_pairs):
    """
    Valida o descarga el tipo de cambio correspondiente a una moneda dada.
    Retorna 1.0 si la moneda ya está en USD o si ocurre un error.
    """
    if currency in fx_pairs:
        return fx_pairs[currency]

    # Determinar par de conversión a USD
    pair = f"{currency}USD=X"

    try:
        rate = yf.Ticker(pair).history(period="1d")["Close"].iloc[-1]
        if not np.isnan(rate) and 0.1 <= rate <= 10.0:  # Rango más amplio
            fx_pairs[currency] = rate
            return rate
        else:
            fx_pairs[currency] = 1.0
            return 1.0
    except Exception:
        fx_pairs[currency] = 1.0
        return 1.0

def analyze_company(ticker, fx_pairs):
    """
    Analiza una empresa específica y extrae los datos financieros clave
    """
    try:
        stock = yf.Ticker(ticker)
        info = stock.info
        
        # Verificar si el ticker es válido
        if not info or 'symbol' not in info:
            return {
                "ticker": ticker,
                "valid": False,
                "error": "Ticker no encontrado en Yahoo Finance"
            }

        # Información básica
        company_name = info.get("longName", info.get("shortName", ticker))
        sector = info.get("sector", "N/A")
        industry = info.get("industry", "N/A")
        country = info.get("country", "N/A")
        currency = info.get("currency", "USD")
        
        # Tipo de cambio
        fx_rate = get_fx_rate(currency, fx_pairs)

        # --- Balance Sheet ---
        try:
            bs = stock.balance_sheet
            if bs.empty:
                raise Exception("Balance sheet no disponible")
        except:
            return {
                "ticker": ticker,
                "valid": False,
                "error": "No se pudo obtener balance sheet"
            }

        # Buscar Equity con múltiples etiquetas posibles
        equity_labels = [
            "Stockholders Equity",
            "Total Stockholder Equity", 
            "Total Equity Gross Minority Interest",
            "Common Stock Equity",
            "Stockholder's Equity"
        ]
        equity_value = None
        equity_label_found = None
        
        for label in equity_labels:
            if label in bs.index:
                try:
                    equity_value = bs.loc[label].iloc[0]
                    if not pd.isna(equity_value):
                        equity_value *= fx_rate
                        equity_label_found = label
                        break
                except:
                    continue

        # Buscar deuda total
        debt_labels = [
            "Long Term Debt",
            "Total Debt", 
            "Long Term Debt And Capital Lease Obligation",
            "Current Debt And Capital Lease Obligation",
            "Total Debt Non Current"
        ]
        debt_value = None
        debt_label_found = None
        
        for label in debt_labels:
            if label in bs.index:
                try:
                    debt_value = bs.loc[label].iloc[0]
                    if not pd.isna(debt_value):
                        debt_value *= fx_rate
                        debt_label_found = label
                        break
                except:
                    continue

        # Si no hay deuda a largo plazo, buscar deuda corriente
        if debt_value is None:
            current_debt_labels = [
                "Current Debt",
                "Short Term Debt",
                "Current Debt And Capital Lease Obligation"
            ]
            for label in current_debt_labels:
                if label in bs.index:
                    try:
                        current_debt = bs.loc[label].iloc[0]
                        if not pd.isna(current_debt):
                            debt_value = current_debt * fx_rate
                            debt_label_found = label
                            break
                    except:
                        continue

        # --- Income Statement ---
        try:
            inc = stock.financials
            if inc.empty:
                raise Exception("Income statement no disponible")
        except:
            inc = None

        # Calcular tasa impositiva efectiva
        tax_rate = 0.25  # Default
        pretax_income = None
        tax_provision = None
        
        if inc is not None:
            # Buscar ingresos antes de impuestos
            pretax_labels = [
                "Pretax Income",
                "Income Before Tax",
                "Earnings Before Tax"
            ]
            
            for label in pretax_labels:
                if label in inc.index:
                    try:
                        pretax_income = inc.loc[label].iloc[0]
                        if not pd.isna(pretax_income):
                            break
                    except:
                        continue

            # Buscar provisión de impuestos
            tax_labels = [
                "Tax Provision",
                "Income Tax Expense",
                "Tax Rate For Calcs"
            ]
            
            for label in tax_labels:
                if label in inc.index:
                    try:
                        tax_provision = inc.loc[label].iloc[0]
                        if not pd.isna(tax_provision):
                            break
                    except:
                        continue

            # Calcular tasa efectiva
            if pretax_income and tax_provision and pretax_income != 0:
                calculated_tax_rate = abs(tax_provision) / abs(pretax_income)
                if 0 <= calculated_tax_rate <= 1:
                    tax_rate = calculated_tax_rate

        # --- Beta y otros datos de mercado ---
        beta_levered = info.get("beta")
        market_cap = info.get("marketCap")
        
        # Calcular ratios
        dc_ratio = None
        de_ratio = None
        beta_unlevered = None
        
        if debt_value is not None and equity_value is not None and equity_value != 0:
            total_capital = debt_value + equity_value
            dc_ratio = debt_value / total_capital if total_capital != 0 else 0
            de_ratio = debt_value / equity_value
            
            # Calcular beta desapalancado
            if beta_levered is not None and not pd.isna(beta_levered):
                beta_unlevered = beta_levered / (1 + (1 - tax_rate) * de_ratio)

        # Formatear valores para mejor legibilidad
        def format_currency(value):
            if value is None or pd.isna(value):
                return None
            if abs(value) >= 1e9:
                return f"${value/1e9:.2f}B"
            elif abs(value) >= 1e6:
                return f"${value/1e6:.2f}M"
            elif abs(value) >= 1e3:
                return f"${value/1e3:.2f}K"
            else:
                return f"${value:.2f}"

        return {
            "ticker": ticker,
            "valid": True,
            "company_name": company_name,
            "sector": sector,
            "industry": industry,
            "country": country,
            "currency": currency,
            "fx_rate": round(fx_rate, 4),
            
            # Datos clave solicitados
            "dc_ratio": round(dc_ratio, 4) if dc_ratio is not None else None,
            "effective_tax_rate": round(tax_rate, 4),
            "beta_levered": round(beta_levered, 4) if beta_levered is not None else None,
            "beta_unlevered": round(beta_unlevered, 4) if beta_unlevered is not None else None,
            
            # Datos adicionales para contexto
            "debt_value": debt_value,
            "debt_value_formatted": format_currency(debt_value),
            "equity_value": equity_value,
            "equity_value_formatted": format_currency(equity_value),
            "de_ratio": round(de_ratio, 4) if de_ratio is not None else None,
            "market_cap": market_cap,
            "market_cap_formatted": format_currency(market_cap),
            
            # Información de debug
            "pretax_income": pretax_income,
            "tax_provision": tax_provision,
            "equity_label_used": equity_label_found,
            "debt_label_used": debt_label_found
        }
        
    except Exception as e:
        return {
            "ticker": ticker,
            "valid": False,
            "error": str(e)
        }

def main():
    """
    Función principal que procesa la lista de tickers
    """
    # Leer tickers desde argumentos o stdin
    if len(sys.argv) > 1:
        # Tickers como argumentos de línea de comandos
        tickers_input = ' '.join(sys.argv[1:])
    else:
        # Leer desde stdin
        tickers_input = sys.stdin.read().strip()
    
    if not tickers_input:
        print(json.dumps({"error": "No se proporcionaron tickers"}))
        return
    
    # Parsear tickers (separados por comas, espacios o líneas)
    import re
    tickers = re.findall(r'[A-Z0-9.-]+', tickers_input.upper())
    
    if not tickers:
        print(json.dumps({"error": "No se encontraron tickers válidos"}))
        return

    # Inicializar tipos de cambio base
    try:
        fx_pairs = {
            "USD": 1.0,
            "CAD": yf.Ticker("CADUSD=X").history(period="1d")["Close"].iloc[-1],
            "GBP": yf.Ticker("GBPUSD=X").history(period="1d")["Close"].iloc[-1], 
            "EUR": yf.Ticker("EURUSD=X").history(period="1d")["Close"].iloc[-1],
        }
    except:
        fx_pairs = {"USD": 1.0}

    # Procesar cada ticker
    results = []
    valid_companies = []
    invalid_companies = []
    
    for ticker in tickers:
        result = analyze_company(ticker, fx_pairs)
        results.append(result)
        
        if result["valid"]:
            valid_companies.append(result)
        else:
            invalid_companies.append(result)

    # Calcular estadísticas del grupo (solo empresas válidas)
    if valid_companies:
        betas_unlevered = [c["beta_unlevered"] for c in valid_companies if c["beta_unlevered"] is not None]
        dc_ratios = [c["dc_ratio"] for c in valid_companies if c["dc_ratio"] is not None]
        tax_rates = [c["effective_tax_rate"] for c in valid_companies if c["effective_tax_rate"] is not None]
        
        group_stats = {
            "beta_unlevered_avg": round(np.mean(betas_unlevered), 4) if betas_unlevered else None,
            "beta_unlevered_median": round(np.median(betas_unlevered), 4) if betas_unlevered else None,
            "dc_ratio_avg": round(np.mean(dc_ratios), 4) if dc_ratios else None,
            "tax_rate_avg": round(np.mean(tax_rates), 4) if tax_rates else None,
            "valid_count": len(valid_companies),
            "total_count": len(tickers)
        }
    else:
        group_stats = {
            "beta_unlevered_avg": None,
            "beta_unlevered_median": None,
            "dc_ratio_avg": None,
            "tax_rate_avg": None,
            "valid_count": 0,
            "total_count": len(tickers)
        }

    # Preparar respuesta final
    response = {
        "success": True,
        "processed_tickers": tickers,
        "valid_companies": valid_companies,
        "invalid_companies": invalid_companies,
        "group_statistics": group_stats,
        "all_results": results
    }
    
    print(json.dumps(response, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main()