<?php

namespace App\Controllers;

use App\Dows\CronDow;

class CronController extends BaseController
{
	public function stacks($request) {
		$dow = new CronDow();
		return Response::json($dow->stacks($request));
	}

}

?>