<?php

namespace App\Controllers;

use App\Dows\KapitalDow;
use App\Middlewares\Application;
use App\Utilities\FG;
use App\Services\FinanceService;
use Illuminate\Database\Capsule\Manager as DB;

class KapitalController extends BaseController
{
	public function index($request)
	{
		$dow = new KapitalDow();
		return Response::view('/web/home/kapital/index.twig', $dow->form($request));
	}

	public function results($request)
	{
		$dow = new KapitalDow();
		$formData = $dow->form($request);

		error_log("=== RESULTS DEBUG ===");
		error_log("Original form data keys: " . json_encode(array_keys($formData['data']['form'] ?? [])));

		return Response::view('/web/home/kapital/result.twig', $formData);
	}

	public function getFormData($request)
	{
		try {
			$input  = $request->getParsedBody();
			$input['uid'] = $request->getAttribute('uid') ?? '';
			$input['userId'] = FG::userId();
			error_log("=== FORM DATA FROM BACKEND ===");
			error_log("UID: " . $input['uid']);

			$financeService = new FinanceService();
			$backendFormData = $financeService->request('GET', '/kapital/users/' . $input['userId'] . '/templates/' . $input['uid'] . '/form-data');
			error_log('URL completa: ' . '/kapital/users/' . $input['userId'] . '/templates/' . $input['uid'] . '/form-data');
			error_log("Backend form data response: " . json_encode($backendFormData));

			// Map backend form data to expected structure
			if (isset($backendFormData['success']) && $backendFormData['success'] && isset($backendFormData['data'])) {
				$backendData = $backendFormData['data'];
				$mappedData = [];

				error_log("Backend data received: " . json_encode($backendData));

				// Map basic form fields
				$mappedData['date'] = $backendData['date'] ?? '';
				$mappedData['sector'] = $backendData['sector'] ?? '';
				$mappedData['instrument'] = $backendData['instrument'] ?? '';
				$mappedData['bono'] = $backendData['bono'] ?? '';
				$mappedData['country'] = $backendData['country'] ?? '';
				$mappedData['currency'] = $backendData['currency'] ?? '';
				$mappedData['devaluation'] = $backendData['devaluation'] ?? '';
				$mappedData['tax'] = $backendData['tax'] ?? '';

				// Map company specific fields
				$mappedData['epd'] = $backendData['epd'] ?? '';  // Porcentaje de deuda
				$mappedData['epc'] = $backendData['epc'] ?? '';  // Porcentaje de capital
				$mappedData['ekd'] = $backendData['ekd'] ?? '';  // Costo de deuda

				// Map financial data fields
				if (isset($backendData['financial_data'])) {
					$financialData = $backendData['financial_data'];
					$mappedData['dc_ratio'] = $financialData['dc_ratio'] ?? '';
					$mappedData['effective_tax_rate'] = $financialData['effective_tax_rate'] ?? '';
					$mappedData['beta_levered'] = $financialData['beta_levered'] ?? '';
					$mappedData['beta_unlevered'] = $financialData['beta_unlevered'] ?? '';

					// Set financial data toggle if any financial data exists
					if (!empty($financialData['dc_ratio']) || !empty($financialData['effective_tax_rate']) || !empty($financialData['beta_levered'])) {
						$mappedData['useFinancialData'] = '1';
					}
				}

				error_log("Mapped form data: " . json_encode($mappedData));

				return Response::json([
					'success' => true,
					'data' => $mappedData
				]);
			} else {
				error_log("Backend call failed or no data in response");
				return Response::json([
					'success' => false,
					'message' => 'No data found or backend error'
				]);
			}
		} catch (\Exception $e) {
			error_log("Exception getting form data from backend: " . $e->getMessage());
			return Response::json([
				'success' => false,
				'message' => $e->getMessage()
			]);
		}
	}

	public function edit($request)
	{
		$dow = new KapitalDow();
		return Response::view('/web/home/kapital/edit.twig', $dow->form($request));
	}

	public function analysis($request)
	{
		$dow = new KapitalDow();
		return Response::view('/web/home/kapital/analysis.twig', $dow->analysis($request));
	}

	public function methodology($request)
	{
		$dow = new KapitalDow();
		return Response::view('/web/home/kapital/methodology.twig', $dow->methodology($request));
	}

	public function viewReport($request)
	{
		$dow = new KapitalDow();
		return Response::view('/web/home/kapital/report.twig', $dow->viewReport($request));
	}

	public function store($request)
	{
		$dow = new KapitalDow();
		return Response::json($dow->store($request));
	}

	public function update($request)
	{
		$dow = new KapitalDow();
		return Response::json($dow->update($request));
	}

	public function detailResult($request)
	{
		$dow = new KapitalDow();
		return Response::json($dow->detailResult($request));
	}

	public function detailAnalysis($request)
	{
		$dow = new KapitalDow();
		return Response::json($dow->detailAnalysis($request));
	}

	public function costAnalysis($request)
	{
		$dow = new KapitalDow();
		return Response::json($dow->costAnalysis($request));
	}

	public function taxrate($request)
	{
		$dow = new KapitalDow();
		return Response::json($dow->taxrate($request));
	}

	public function showReport($request)
	{
		$dow = new KapitalDow();
		return Response::json($dow->showReport($request));
	}

	public function generateReport($request)
	{
		$dow = new KapitalDow();
		return Response::json($dow->generateReport($request));
	}

	public function listReport($request)
	{
		$dow = new KapitalDow();
		return Response::json($dow->listReport($request));
	}

	public function projects($request)
	{
		$dow = new KapitalDow();
		return Response::view('/web/home/kapital/projects.twig', $dow->projects($request));
	}

	public function getFinancialData($request)
	{
		$dow = new KapitalDow();
		return Response::json($dow->getFinancialData($request));
	}
}
