<?php

namespace App\Controllers;

use App\Dows\ReportKapitalDow;

class ReportKapitalController extends BaseController {

	public function index($request) {
		$dow = new ReportKapitalDow();
		return Response::view('/admin/report/kapital/index.twig', $dow->list($request));
	}

	public function show($request) {
		$dow = new ReportKapitalDow();
		// echo json_encode($dow->show($request)['data']); exit;
		return Response::view('/admin/report/kapital/form.twig', $dow->show($request));
	}

	public function create($request) {
		$dow = new ReportKapitalDow();
		return Response::view('/admin/report/kapital/form.twig', $dow->create($request));
	}

}

?>