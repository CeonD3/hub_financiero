<?php

namespace App\Controllers;

use App\Dows\{HomeDow,MargaritaDow};
use App\Middlewares\Application;

class HomeController extends BaseController
{
	public function index($request) {
		$index = new MargaritaDow();
		//var_dump(json_encode($index->home($request)));exit;
		return Response::view('/web/landing/index.twig',$index->home($request));
	}

	public function terminos($request) {
		return Response::view('/web/landing/terminos.twig');
	}

	public function politicas($request) {
		return Response::view('/web/landing/politicas.twig');
	}
}

?>