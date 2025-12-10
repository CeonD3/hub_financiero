<?php

namespace App\Controllers;

use Exception;
use Laminas\Diactoros\Response\JsonResponse;

class YahooFinanceController extends BaseController
{
    private $pythonScriptPath;

    public function __construct()
    {
        parent::__construct();
        $this->pythonScriptPath = dirname(dirname(__DIR__)) . '/scripts/yahoo_finance_analyzer.py';
    }

    /**
     * Analiza empresas usando Yahoo Finance
     * POST /api/analyze-companies
     * Body: {"tickers": ["AAPL", "MSFT", "GOOGL"]}
     */
    public function analyzeCompanies()
    {
        try {
            // Verificar método
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                return new JsonResponse(['error' => 'Método no permitido'], 405);
            }

            // Leer JSON del cuerpo de la petición
            $input = file_get_contents('php://input');
            $data = json_decode($input, true);

            if (!$data || !isset($data['tickers']) || !is_array($data['tickers'])) {
                return new JsonResponse(['error' => 'Se requiere un array de tickers'], 400);
            }

            $tickers = $data['tickers'];

            // Validar tickers
            $validTickers = [];
            foreach ($tickers as $ticker) {
                if (is_string($ticker) && !empty(trim($ticker))) {
                    $validTickers[] = strtoupper(trim($ticker));
                }
            }

            if (empty($validTickers)) {
                return new JsonResponse(['error' => 'No se proporcionaron tickers válidos'], 400);
            }

            // Limitar número de tickers para evitar timeouts
            if (count($validTickers) > 30) {
                return new JsonResponse(['error' => 'Máximo 30 tickers por solicitud'], 400);
            }

            // Verificar que el script Python existe
            if (!file_exists($this->pythonScriptPath)) {
                return new JsonResponse(['error' => 'Script de análisis no encontrado'], 500);
            }

            // Ejecutar script Python usando el entorno virtual
            $tickersString = implode(' ', $validTickers);
            $venvPython = dirname(dirname(__DIR__)) . '/venv/Scripts/python.exe';
            $command = "\"{$venvPython}\" \"{$this->pythonScriptPath}\" {$tickersString} 2>&1";

            // Configurar timeout
            $timeout = 120; // 2 minutos
            $startTime = time();

            $output = shell_exec($command);

            if (time() - $startTime > $timeout) {
                return new JsonResponse(['error' => 'Timeout en el análisis'], 504);
            }

            if ($output === null || empty(trim($output))) {
                return new JsonResponse(['error' => 'Error ejecutando script Python'], 500);
            }

            // Decodificar respuesta JSON del script Python
            $result = json_decode($output, true);

            if ($result === null) {
                // Si no es JSON válido, devolver el output crudo para debug
                return new JsonResponse([
                    'error' => 'Error en formato de respuesta del script',
                    'debug_output' => $output
                ], 500);
            }

            // Verificar si hubo errores en el script
            if (isset($result['error'])) {
                return new JsonResponse(['error' => $result['error']], 400);
            }

            // Agregar metadatos
            $result['metadata'] = [
                'timestamp' => date('Y-m-d H:i:s'),
                'processing_time' => time() - $startTime,
                'requested_tickers' => $validTickers,
                'source' => 'Yahoo Finance'
            ];

            // Devolver resultado exitoso
            return new JsonResponse($result);
        } catch (Exception $e) {
            return new JsonResponse([
                'error' => 'Error interno del servidor',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Calcula beta relevering para una empresa específica
     * POST /api/calculate-beta
     * Body: {"beta_unlevered": 1.2, "target_dc_ratio": 0.3, "tax_rate": 0.25}
     */
    public function calculateBeta()
    {
        try {
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                return new JsonResponse(['error' => 'Método no permitido'], 405);
            }

            $input = file_get_contents('php://input');
            $data = json_decode($input, true);

            $betaUnlevered = $data['beta_unlevered'] ?? null;
            $targetDcRatio = $data['target_dc_ratio'] ?? null;
            $taxRate = $data['tax_rate'] ?? 0.25;

            if ($betaUnlevered === null || $targetDcRatio === null) {
                return new JsonResponse(['error' => 'Se requieren beta_unlevered y target_dc_ratio'], 400);
            }

            // Calcular D/E ratio desde D/C ratio
            // D/C = D/(D+E) -> D/E = (D/C) / (1 - D/C)
            $deRatio = $targetDcRatio / (1 - $targetDcRatio);

            // Calcular beta apalancado: βL = βU * [1 + (1 - T) * (D/E)]
            $betaLevered = $betaUnlevered * (1 + (1 - $taxRate) * $deRatio);

            $result = [
                'success' => true,
                'inputs' => [
                    'beta_unlevered' => $betaUnlevered,
                    'target_dc_ratio' => $targetDcRatio,
                    'tax_rate' => $taxRate
                ],
                'calculated' => [
                    'de_ratio' => round($deRatio, 4),
                    'beta_levered' => round($betaLevered, 4)
                ],
                'formula' => 'βL = βU × [1 + (1 - T) × (D/E)]',
                'timestamp' => date('Y-m-d H:i:s')
            ];

            return new JsonResponse($result);
        } catch (Exception $e) {
            return new JsonResponse([
                'error' => 'Error en cálculo de beta',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Endpoint de prueba para verificar conectividad
     * GET /api/yahoo-finance/test
     */
    public function test()
    {
        $venvPython = dirname(dirname(__DIR__)) . '/venv/Scripts/python.exe';
        $pythonVersion = shell_exec("\"{$venvPython}\" --version 2>&1");
        $pipList = shell_exec("\"{$venvPython}\" -m pip list 2>&1");

        return new JsonResponse([
            'status' => 'OK',
            'python_version' => trim($pythonVersion ?? 'No disponible'),
            'script_exists' => file_exists($this->pythonScriptPath),
            'script_path' => $this->pythonScriptPath,
            'venv_python_path' => $venvPython,
            'venv_python_exists' => file_exists($venvPython),
            'pip_packages' => $pipList ? explode("\n", trim($pipList)) : [],
            'timestamp' => date('Y-m-d H:i:s')
        ]);
    }
}
