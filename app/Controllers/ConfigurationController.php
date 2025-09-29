<?php

namespace App\Controllers;

class ConfigurationController extends BaseController {

	public function index($request) {
		return Response::view('/admin/config/index.twig');
	}

}

?>