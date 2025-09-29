<?php 

namespace App\Dows;

use Illuminate\Database\Capsule\Manager as DB;
use App\Utilities\FG;
use App\Middlewares\Application;
use App\Services\FinanceService;

class AuthDow {

    public function signin($request) {
        $financeService = new FinanceService();
        $response = $financeService->request('POST', '/auth/signin', $request->getParsedBody());
        if ($response['success']) {
            $user = $response['data']['user'];
            $_SESSION['USER'] = json_decode(json_encode($user));
        }
        return $response;
	}

    public function signup($request) {
        $financeService = new FinanceService();
        $response = $financeService->request('POST', '/auth/signup', $request->getParsedBody());
        if ($response['success']) {
            $user = $response['data']['user'];
            $_SESSION['USER'] = json_decode(json_encode($user));
        }
        return $response;
	}

    public function signout($request) {
        unset($_SESSION['USER']);
        header('Location: /');
	}

    public function login($request) {
        if (isset($_SESSION['USER'])) {
            header('Location: /');
        }
        return [];
	}

}