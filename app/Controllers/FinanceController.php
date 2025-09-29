<?php

namespace App\Controllers;

use App\Dows\FinanceDow;
use App\Middlewares\Application;

class FinanceController extends BaseController
{
	public function industries($request) {
		$dow = new FinanceDow();
		return Response::json($dow->industries($request));
	}

	public function removeProyect($request) {
		$dow = new FinanceDow();
		return Response::json($dow->removeProyect($request));
	}

}

?>