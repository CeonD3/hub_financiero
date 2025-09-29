<?php 

namespace App\Dows;

use Illuminate\Database\Capsule\Manager as DB;
use App\Utilities\FG;
use App\Middlewares\Application;
use App\Services\FinanceService;

class TemplateMasterDow {

    public function list($request) {
        $financeService = new FinanceService();
        return $financeService->request('GET', '/admin/master/templates/list');
	}

    /*public function removeProyect($request) {
        $financeService = new FinanceService();
        return $financeService->request('POST', '/finance/projects/'. $request->getAttribute('id') . '/remove');
	}*/

}