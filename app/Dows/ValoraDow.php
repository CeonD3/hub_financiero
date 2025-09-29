<?php 

namespace App\Dows;

use Illuminate\Database\Capsule\Manager as DB;
use App\Utilities\FG;
use App\Middlewares\Application;
use App\Services\FinanceService;
use App\Services\MargaritaService;
use Firebase\JWT\JWT;

class ValoraDow {
    
    public function form($request) {
        $input  = $request->getParsedBody();
        $input['uid'] = $request->getAttribute('uid') ?? '';
        $input['userId'] = FG::userId();
        $financeService = new FinanceService();
        return $financeService->request('POST', '/valora/form', $input);
	}

    public function result($request) {
        $input = $request->getParsedBody();
        $financeService = new FinanceService();
        return $financeService->request('POST', '/valora/users/' . FG::userId() . '/templates/' . $request->getAttribute('uid') . '/result', $input);
	}

    public function analysis($request) {
        $financeService = new FinanceService();
        return $financeService->request('POST', '/valora/users/' . FG::userId() . '/templates/' . $request->getAttribute('uid') . '/analysis');
	}

    public function detailResult($request) {
        $financeService = new FinanceService();
        return $financeService->request('POST', '/valora/users/' . FG::userId() . '/templates/' . $request->getAttribute('uid') . '/result/detail');
	}
    
    public function store($request) {
        $input = $request->getParsedBody();
        $input['userId'] = FG::userId();
        $financeService = new FinanceService();
        // echo json_encode($input); exit;
        return $financeService->request('POST', '/valora/store', $input);
	}

    public function bvl($request) {
        $financeService = new FinanceService();
        return $financeService->request('POST', '/valora/bvl', []);
	}

    public function balance($request) {
        $financeService = new FinanceService();
        return $financeService->request('POST', '/valora/users/' . FG::userId() . '/templates/' . $request->getAttribute('uid') . '/balance', $request->getParsedBody());
	}

    public function update($request) {
        $financeService = new FinanceService();
        return $financeService->request('POST', '/valora/users/' . FG::userId() . '/templates/' . $request->getAttribute('uid') . '/update', $request->getParsedBody());
	}

    public function detailAnalysis($request) {
        $financeService = new FinanceService();
        return $financeService->request('POST', '/valora/users/' . FG::userId(). '/templates/' . $request->getAttribute('uid') . '/analysis/detail');
	}

    public function costAnalysis($request) {
        $financeService = new FinanceService();
        return $financeService->request('POST', '/valora/users/' . FG::userId() . '/templates/' . $request->getAttribute('uid') . '/analysis/cost', $request->getParsedBody());
	}

    public function methodology($request) {
        $margaritaService = new MargaritaService();
        $slug = 'metodologia-valora';
        $result = $margaritaService->request('POST', '/'.$slug);
        $categories = [];
        if ($result['success']) {
            $products = [];
            $menu_products = $result['data']['menu_products'];
            foreach ($menu_products as $k => $val) {
                if ($slug == $val['slug']) {
                    $products = $val['products'];
                    break;
                }
            }
            $keys_products = [];
            foreach ($products as $k => $val) {
                $categories[$val['category']['id']] = $val['category'];
                $val['file'] = $_ENV['API_URL_MARGARITA'] . $val['file'];
                $keys_products[$val['category']['id']][] = $val;
            }
            $categories = array_values($categories);
            foreach ($categories as $k => $val) {
                $categories[$k]['products'] = [];
                if (isset($keys_products[$val['id']])) {
                    $categories[$k]['products'] = $keys_products[$val['id']];
                }
            }
        }
        return ['success' => true, 'data' => ['uid'=>$request->getAttribute('uid'), 'categories' => $categories]];
	}

    public function projects($request) {
        $financeService = new FinanceService();
        return $financeService->request('POST', '/valora/users/' . FG::userId() . '/projects');
	}

    public function viewReport($request) {

        $id = $request->getAttribute('id');
        $slug = $request->getAttribute('slug');

        $time = time();
        $key = $_ENV['TOKEN_KEY'];
        $payload = array(
            'iat'  => $time,
            'exp'  => $time + 3600,
            'userId'   => FG::userId(),
            'uid'  => $request->getAttribute('uid'),
            'id' => $request->getAttribute('id')
        );
        $jwt = JWT::encode($payload, $key);
        $url = $_ENV['API_URL_FINANCE'] . '/report/valora/' . $jwt;
        
        return ['success' => true, 'data' => ['url' => $url, 'uid' => $request->getAttribute('uid')]];
	}

    public function generateReport($request) {
        $input = $request->getParsedBody();
        $financeService = new FinanceService();
        return $financeService->request('POST', '/valora/users/' . FG::userId() . '/templates/' . $request->getAttribute('uid') . '/reports/generate' , $input);
	}

    public function listReport($request) {
        $input = $request->getParsedBody();
        $financeService = new FinanceService();
        return $financeService->request('POST', '/valora/users/' . FG::userId() . '/templates/' . $request->getAttribute('uid') . '/reports/list' , $input);
	}

    public function showReport($request) {
        $financeService = new FinanceService();
        return $financeService->request('POST', '/valora/users/' . FG::userId() . '/templates/' . $request->getAttribute('uid') . '/reports/' . $request->getAttribute('id') . '/show');
	}

}