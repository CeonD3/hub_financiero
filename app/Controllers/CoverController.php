<?php

namespace App\Controllers;

use App\Dows\CoverDow;

class CoverController extends BaseController {

	public function index($request) {
		$dow = new CoverDow();
		// echo json_encode($dow->list($request)); exit;
		return Response::view('/admin/template/cover/index.twig', $dow->list($request));
	}

	public function edit($request) {
		$dow = new CoverDow();
		return Response::view('/admin/template/cover/edit.twig', $dow->edit($request));
	}

	public function create($request) {
		$dow = new CoverDow();
		// echo json_encode($dow->list($request)); exit;
		return Response::view('/admin/template/cover/edit.twig', $dow->edit($request));
	}

}

?>