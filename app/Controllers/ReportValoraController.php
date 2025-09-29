<?php

namespace App\Controllers;

use App\Dows\ReportValoraDow;

class ReportValoraController extends BaseController {

	public function index($request) {
		$dow = new ReportValoraDow();
		return Response::view('/admin/report/valora/index.twig', $dow->list($request));
	}

	public function show($request) {
		$dow = new ReportValoraDow();
		return Response::view('/admin/report/valora/form.twig', $dow->show($request));
	}

	public function create($request) {
		$dow = new ReportValoraDow();
		return Response::view('/admin/report/valora/form.twig', $dow->create($request));
	}

}

?>