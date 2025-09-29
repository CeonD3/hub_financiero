<?php 

namespace App\Dows;

use Illuminate\Database\Capsule\Manager as DB;
use App\Utilities\FG;
use App\Middlewares\Application;
use App\Services\MargaritaService;

class MargaritaDow {

    public function home($request) {
        $MargaritaService = new MargaritaService();
        return $MargaritaService->request('POST', '/');
	}

}