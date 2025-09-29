<?php

namespace App\Controllers;

use Laminas\Diactoros\Response\HtmlResponse;
use Laminas\Diactoros\Response\JsonResponse;
use App\Utilities\Twig;
use App\Services\MargaritaService;

class BaseController
{
	public function __construct() {}
}

class Response
{

	public static function json($data = [], $status = 200)
	{
		// add params []
		return new JsonResponse($data, $status);
	}

	public static function view($filename, $data = [], $pathname = '/company')
	{
		// add params []
		$margaritaService = new MargaritaService();
		$result = $margaritaService->request("POST", $pathname);
		// echo json_encode($result['_menu']); exit;
		$slug = 'metodologia-kapital';
		$marga = $margaritaService->request('POST', '/' . $slug);
		$content["contents"] = $marga["data"]["contents"];
		$data = array_merge($data, $result, $content);
		//echo json_encode($data); exit;
		return new HtmlResponse(Twig::render($filename, $data));
	}
}
