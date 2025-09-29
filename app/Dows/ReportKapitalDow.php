<?php 

namespace App\Dows;

use Illuminate\Database\Capsule\Manager as DB;
use App\Utilities\FG;
use App\Middlewares\Application;
use App\Services\FinanceService;

class ReportKapitalDow {

    public function list($request) {
        $financeService = new FinanceService();
        return $financeService->request('GET', '/admin/kapital/reports/list');
	}

    public function show($request) {
        $financeService = new FinanceService();
        return $financeService->request('GET', '/admin/kapital/reports/'. $request->getAttribute('id') . '/show');
	}

    public function create($request) {
        $financeService = new FinanceService();
        return $financeService->request('GET', '/admin/kapital/reports/create');
	}

}