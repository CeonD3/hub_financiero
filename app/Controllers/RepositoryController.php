<?php

namespace App\Controllers;

use App\Dows\RepositoryDow;

class RepositoryController extends BaseController
{
	public function index($request) {
		$dow = new RepositoryDow();
		return Response::view('/admin/repository/index.twig', $dow->index($request));
	}

	public function detail($request) {
		$dow = new RepositoryDow();
		return Response::view('/admin/repository/detail.twig', $dow->detail($request));
	}

	public function show($request) {
		$dow = new RepositoryDow();
		return Response::json($dow->show($request));
	}

	public function transfer($request) {
		$dow = new RepositoryDow();
		return Response::json($dow->transfer($request));
	}

	public function transfers($request) {
		$dow = new RepositoryDow();
		return Response::json($dow->transfers($request));
	}

	public function stacks($request) {
		$dow = new RepositoryDow();
		return Response::json($dow->stacks($request));
	}

	public function accounts($request) {
		$dow = new RepositoryDow();
		return Response::json($dow->accounts($request));
	}

	public function removeStack($request) {
		$dow = new RepositoryDow();
		return Response::json($dow->removeStack($request));
	}

	public function childrensStack($request) {
		$dow = new RepositoryDow();
		return Response::json($dow->childrensStack($request));
	}

}

?>