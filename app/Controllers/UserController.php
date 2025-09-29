<?php

namespace App\Controllers;

use App\Dows\UserDow;

class UserController extends BaseController {

	public function index($request) {
		$dow = new UserDow();
		return Response::view('/admin/user/index.twig');
	}

	public function info($request) {
		$dow = new UserDow();
		return Response::json($dow->info($request));
	}

	public function pagination($request) {
		$dow = new UserDow();
		return Response::json($dow->pagination($request));
	}

	public function store($request) {
		$dow = new UserDow();
		return Response::json($dow->store($request));
	}

	public function update($request) {
		$dow = new UserDow();
		return Response::json($dow->update($request));
	}

	public function remove($request) {
		$dow = new UserDow();
		return Response::json($dow->remove($request));
	}

	public function show($request) {
		$dow = new UserDow();
		return Response::json($dow->show($request));
	}

}

?>