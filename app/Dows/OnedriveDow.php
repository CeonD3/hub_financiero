<?php 

namespace App\Dows;

use Illuminate\Database\Capsule\Manager as DB;
use App\Utilities\FG;
use App\Middlewares\Application;
use App\Services\OnedriveService;

class OnedriveDow {

    
    public function signin($request) {
		$rsp = FG::responseDefault();
        try {

            $query = $request->getQueryParams();

            $code  = $query['code'];
            $state = $query['state'];

            if (!isset($_COOKIE['AUTH_ONEDRIVE_MICROSOFT'])) {            
                header('Location: /'); exit;
            }

            $cookie = json_decode($_COOKIE['AUTH_ONEDRIVE_MICROSOFT']);

            if ($cookie->state != $state) {            
                header('Location: /'); exit;
            }

            if (!$code) {            
                header('Location: /'); exit;
            }

            $user = DB::table('users')->where('deletedAt')->where('id', $cookie->userId)->first();
            if (!$user) {
                header('Location: /'); exit;
            }

            $onedrive  = new OnedriveService();
            $azure      = $onedrive->getAzure();
            $token      = $azure->getAccessToken('authorization_code', [
                'scope' => $azure->scope,
                'code'  => $code
            ]);
            
            $newtoken = json_encode($token);

            $accountId = DB::table('accounts')->insertGetId([
                'name'         => time(),
                'token'        =>$newtoken,
                'repositoryId' => 3,
                'userId'       => $cookie->userId,
                'companyId'    => $cookie->companyId,
            ]);
            $onedrive->setToken($newtoken, $accountId);
            $me = $onedrive->me();
            if (isset($me['userPrincipalName'])) {
                DB::table("accounts")->where('id', $accountId)->update(['name' => $me['userPrincipalName']]);
            }

            if ($cookie->redirect) {
                header('Location: ' . $cookie->redirect); exit;
            }

        } catch (\Exception $e) {
            echo $e->getMessage();
        }
        header('Location: /'); exit;
	}

    public function authUrl($request) {
		$rsp = FG::responseDefault();
        try {

            $input     = $request->getParsedBody();
            $userId    = $input['userId'];
            $companyId = $input['companyId'];
            $redirect  = $input['redirect'];

            $user = DB::table('users AS US')->where('US.deletedAt')->where('US.id', $userId)->first();
            if (!$user) {
                throw new \Exception('No se encontró el usuario');
            }

            $onedrive  = new OnedriveService();
            $azure     = $onedrive->getAzure();
            $url       = $azure->getAuthorizationUrl();
            $state     = $azure->getState();

            if (isset($_COOKIE['AUTH_ONEDRIVE_MICROSOFT'])) {
                unset($_COOKIE['AUTH_ONEDRIVE_MICROSOFT']);
            }

            setcookie('AUTH_ONEDRIVE_MICROSOFT', json_encode([
                'userId'    => $userId, 
                'state'     => $state, 
                'companyId' => $companyId,
                'redirect'  => $redirect
            ]), time () + 60 * 5, "/"); // to 5 minuts 

            header('Location: ' . $url); exit;
            
        } catch (\Exception $e) {
            $rsp['message'] = $e->getMessage();
        }
        return $rsp;
	}

    public function signout($request) {
		$rsp = FG::responseDefault();
        try {

            $input = $request->getParsedBody();
            $domain    = $input['domain'];
            $logoutUrl = "";

            $company = DB::table('empresas AS EMP')->where('EMP.deleted_at')->where('EMP.host', $domain)->first();
            if (!$company) {
                throw new \Exception('No se encontró la empresa');
            }

            if ($company->token_microsoft) {

                /*$microsoft  = new OnedriveService();
                $token      = $microsoft->getAccessToken($user->token_microsoft, $user->id);
                $result = $graph->createRequest("GET", "/me")->execute();
                $account = $result->getBody();
                
                $username = $account["userPrincipalName"];*/
                    

                DB::table("empresas")->where('id', $company->id)->update(['token_microsoft' => null]);
            }

            /*$microsoft  = new OnedriveService();
            $token      = $microsoft->getAccessToken($user->token_microsoft, $user->id);

            $graph = new Graph();
            $graph->setAccessToken($token['access_token']);
            $result = $graph->createRequest("POST", "/users/joseant_1294@hotmail.com")->execute();
            $account = $result->getBody();
            $status = true;*/
            
            $rsp['success'] = true;
            $rsp['message'] = 'Se desvinculó correctamente';
        } catch (\Exception $e) {
            $rsp['message'] = $e->getMessage();
        }
        return $rsp;
	}
    
    public function overview($request) {
		$rsp = FG::responseDefault();
        try {

            $input  = $request->getParsedBody();
            $domain = $input['domain'];

            $id = $request->getAttribute('id');
            $account = []; $status = false;

            $company = DB::table('empresas AS EMP')->where('EMP.deleted_at')->where('EMP.host', $domain)->first();
            if (!$company) {
                throw new \Exception('No se encontró la empresa');
            }

            if ($company->token_microsoft) {
                $microsoft  = new OnedriveService();
                $microsoft->setToken($company->id);
                $graph = $microsoft->getGraph();
                $result = $graph->createRequest("GET", "/me")->execute();
                $account = $result->getBody();
                $status = true;
            }
            
            $rsp['success'] = true;
            $rsp['data']    = compact('account', 'status');
            $rsp['message'] = 'Datos de la cuenta microsoft';
        } catch (\Exception $e) {
            $rsp['message'] = $e->getMessage();
        }
        return $rsp;
	}

    public function folders($request) {
		$rsp = FG::responseDefault();
        try {
            //GET /me/drive/root/children
            $input  = $request->getParsedBody();
            $id = $input['id'];
            $accountId = $input['accountId'];

            $account = DB::table('accounts')->where('deletedAt')->where('id', $accountId)->first();
            if (!$account) {
                throw new \Exception('No se encontró la cuenta');
            }
            $onedriveService = new OnedriveService();
            $onedriveService->setToken($account->token, $account->id);
            $response = $onedriveService->folders($id);
            $items = $response['value'];
            $folders = [];
            foreach ($items as $key => $item) {
                if ($item['folder']) {
                    $folders[] = $item;
                }
            }

            $rsp['success'] = true;
            $rsp['data']    = compact('account', 'response', 'folders');
            $rsp['message'] = 'folders';
        } catch (\Exception $e) {
            $rsp['message'] = $e->getMessage();
        }
        return $rsp;
	}

    public function accounts($request) {
		$rsp = FG::responseDefault();
        try {

            $input  = $request->getParsedBody();
            $userId = $input['userId'];
            $companyId = $input['companyId'];

            $accounts = DB::table('accounts')->where('deletedAt')->where('companyId', $companyId)->where('userId', $userId)->where('typeId', 3)->get();
            
            $rsp['success'] = true;
            $rsp['data']    = compact('accounts');
            $rsp['message'] = 'accounts';
        } catch (\Exception $e) {
            $rsp['message'] = $e->getMessage();
        }
        return $rsp;
	}

}