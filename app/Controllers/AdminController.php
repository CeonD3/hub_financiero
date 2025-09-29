<?php

namespace App\Controllers;

use App\Middlewares\Application;

class AdminController extends BaseController
{
	public function dashboard($request) {
		return Response::view('/admin/home/dashboard.twig');
	}
}

?>