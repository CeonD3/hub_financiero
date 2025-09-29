<?php

namespace App\Controllers;

use App\Dows\ValoraDow;
use App\Middlewares\Application;

class ValoraController extends BaseController
{
	public function index($request) {
		$dow = new ValoraDow();
		return Response::view('/web/home/valora/index.twig', $dow->form($request));
	}

	public function financial($request) {
		$dow = new ValoraDow();
		return Response::view('/web/home/valora/financial.twig', $dow->form($request));
	}

	public function result($request) {
		$dow = new ValoraDow();
		return Response::view('/web/home/valora/result.twig', $dow->form($request));
	}

	public function analysis($request) {
		$dow = new ValoraDow();
		return Response::view('/web/home/valora/analysis.twig', $dow->form($request));
	}

	public function methodology($request) {
		$dow = new ValoraDow();
		return Response::view('/web/home/valora/methodology.twig', $dow->methodology($request));
	}

	public function store($request) {
		$dow = new ValoraDow();
		return Response::json($dow->store($request));
	}

	public function bvl($request) {
		$dow = new ValoraDow();
		return Response::json($dow->bvl($request));
	}

	public function update($request) {
		$dow = new ValoraDow();
		return Response::json($dow->update($request));
	}

	public function balance($request) {
		$dow = new ValoraDow();
		return Response::json($dow->balance($request));
	}

	public function detailResult($request) {
		$dow = new ValoraDow();
		return Response::json($dow->detailResult($request));
	}

	public function detailAnalysis($request) {
		$dow = new ValoraDow();
		return Response::json($dow->detailAnalysis($request));
	}

	public function costAnalysis($request) {
		$dow = new ValoraDow();
		return Response::json($dow->costAnalysis($request));
	}
	
	public function projects($request) {
		$dow = new ValoraDow();
		return Response::view('/web/home/valora/projects.twig', $dow->projects($request));
	}

	public function viewReport($request) {
		$dow = new ValoraDow();
		return Response::view('/web/home/valora/report.twig', $dow->viewReport($request));
	}

	public function showReport($request) {
		$dow = new ValoraDow();
		return Response::json($dow->showReport($request));
	}
	
	public function generateReport($request) {
		$dow = new ValoraDow();
		return Response::json($dow->generateReport($request));
	}

	public function listReport($request) {
		$dow = new ValoraDow();
		return Response::json($dow->listReport($request));
	}

}

?>