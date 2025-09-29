<?php

namespace App\Controllers;

use App\Dows\AuthDow;

class AuthController extends BaseController
{
	public function login($request) {
		$dow = new AuthDow();
		return Response::view('/web/auth/signin.twig', $dow->login($request));
	}

	public function register($request) {
		return Response::view('/web/auth/signup.twig');
	}

	public function signin($request) {
		$dow = new AuthDow();
		return Response::json($dow->signin($request));
	}

	public function signup($request) {
		$dow = new AuthDow();
		return Response::json($dow->signup($request));
	}

	public function signout($request) {
		$dow = new AuthDow();
		return Response::json($dow->signout($request));
	}

	public function profile($request) {
		return Response::view('/admin/auth/profile.twig');
	}
}

?>