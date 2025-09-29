<?php

namespace App\Controllers;

use App\Dows\TemplateMasterDow;

class TemplateMasterController extends BaseController {

	public function index($request) {
		return Response::view('/admin/template/master/index.twig');
	}

}

?>