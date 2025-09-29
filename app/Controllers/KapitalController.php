<?php

namespace App\Controllers;

use App\Dows\KapitalDow;
use App\Middlewares\Application;

class KapitalController extends BaseController
{
	public function index($request) {
		$dow = new KapitalDow();
		return Response::view('/web/home/kapital/index.twig', $dow->form($request));
	}

	public function results($request) {
		$dow = new KapitalDow();
		return Response::view('/web/home/kapital/result.twig', $dow->form($request));
	}

	public function analysis($request) {
		$dow = new KapitalDow();
		return Response::view('/web/home/kapital/analysis.twig', $dow->analysis($request));
	}

	public function methodology($request) {
		$dow = new KapitalDow();
		return Response::view('/web/home/kapital/methodology.twig', $dow->methodology($request));
	}

	public function viewReport($request) {
		$dow = new KapitalDow();
		return Response::view('/web/home/kapital/report.twig', $dow->viewReport($request));
	}

	public function store($request) {
		$dow = new KapitalDow();
		return Response::json($dow->store($request));
	}

	public function update($request) {
		$dow = new KapitalDow();
		return Response::json($dow->update($request));
	}

	public function detailResult($request) {
		$dow = new KapitalDow();
		return Response::json($dow->detailResult($request));
	}

	public function detailAnalysis($request) {
		$dow = new KapitalDow();
		return Response::json($dow->detailAnalysis($request));
	}

	public function costAnalysis($request) {
		$dow = new KapitalDow();
		return Response::json($dow->costAnalysis($request));
	}

	public function taxrate($request) {
		$dow = new KapitalDow();
		return Response::json($dow->taxrate($request));
	}

	public function showReport($request) {
		$dow = new KapitalDow();
		return Response::json($dow->showReport($request));
	}
	
	public function generateReport($request) {
		$dow = new KapitalDow();
		return Response::json($dow->generateReport($request));
	}

	public function listReport($request) {
		$dow = new KapitalDow();
		return Response::json($dow->listReport($request));
	}

	public function projects($request) {
		$dow = new KapitalDow();
		return Response::view('/web/home/kapital/projects.twig', $dow->projects($request));
	}
}

?>