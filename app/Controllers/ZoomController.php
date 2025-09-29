<?php

namespace App\Controllers;

use App\Dows\ZoomDow;

class ZoomController extends BaseController {

	public function users($request) {
		$dow = new ZoomDow();
		return Response::json($dow->users($request));
	}

	public function meetings($request) {
		$dow = new ZoomDow();
		return Response::json($dow->meetings($request));
	}

	public function recordings($request) {
		$dow = new ZoomDow();
		return Response::json($dow->recordings($request));
	}

}

?>