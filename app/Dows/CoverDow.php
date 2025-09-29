<?php 

namespace App\Dows;

use Illuminate\Database\Capsule\Manager as DB;
use App\Utilities\FG;
use App\Middlewares\Application;
use App\Services\FinanceService;

class CoverDow {

    public function list($request) {
        $financeService = new FinanceService();
        return $financeService->request('POST', '/admin/master/covers/list', $request->getParsedBody());
	}

    public function edit($request) {
        $financeService = new FinanceService();
        return $financeService->request('POST', '/admin/master/covers/'.$request->getAttribute('cover_id').'/edit', $request->getParsedBody());
	}

    public function create($request) {
        $financeService = new FinanceService();
        return $financeService->request('POST', '/admin/master/covers/0/edit', $request->getParsedBody());
	}

}