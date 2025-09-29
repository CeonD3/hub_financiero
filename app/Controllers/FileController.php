<?php

namespace App\Controllers;

use App\Dows\FileDow;

class FileController extends BaseController
{
	public function index($request) {
		$dow = new FileDow();
		return Response::view('/admin/file/index.twig', $dow->index($request));
	}

	public function detail($request) {
		$dow = new FileDow();
		return Response::view('/admin/file/detail.twig', $dow->index($request));
	}
}

?>