<?php

namespace App\Controllers;

class AccountController extends BaseController {
	
	public function index($request) {
		return Response::view('/admin/account/index.twig');
	}

}

?>