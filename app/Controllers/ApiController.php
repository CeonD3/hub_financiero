<?php

namespace App\Controllers;

use App\Dows\ApiDow;

class ApiController extends BaseController
{
	public function generatekey($request) {
		$dow = new ApiDow();
		return Response::json($dow->generatekey($request));
	}
}

?>