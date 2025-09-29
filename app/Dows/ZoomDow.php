<?php 

namespace App\Dows;

use Illuminate\Database\Capsule\Manager as DB;
use App\Utilities\FG;
use App\Middlewares\Application;
use App\Services\ZoomService;

class ZoomDow {

    public function users($request) {
		$rsp = FG::responseDefault();
        try {

            $id = $request->getAttribute('id');
            
            $account = DB::table('accounts AS A')
                                ->where('A.deletedAt')
                                ->where('A.id', $id)
                                ->first();

            if (!$account) {
                throw new \Exception('No se encontro la cuenta');
            }

            $zoomService = new ZoomService($account->accessKey, $account->secretKey);
            $response = $zoomService->getUsers();

            $rsp['success'] = true;
            $rsp['data']    = $response;
            $rsp['message'] = 'users';
        } catch (\Exception $e) {
            $rsp['message'] = $e->getMessage();
        }
        return $rsp;
	}

    public function meetings($request) {
		$rsp = FG::responseDefault();
        try {

            $id = $request->getAttribute('id');
            $userId = $request->getAttribute('userId');
            
            $account = DB::table('accounts AS A')
                                ->where('A.deletedAt')
                                ->where('A.id', $id)
                                ->first();

            if (!$account) {
                throw new \Exception('No se encontro la cuenta');
            }

            $zoomService = new ZoomService($account->accessKey, $account->secretKey);
            $response = $zoomService->getMeetings($userId);
            
            $rsp['success'] = true;
            $rsp['data']    = $response;
            $rsp['message'] = 'meetings';
        } catch (\Exception $e) {
            $rsp['message'] = $e->getMessage();
        }
        return $rsp;
	}

    public function recordings($request) {
		$rsp = FG::responseDefault();
        try {

            $id = $request->getAttribute('id');
            $meetingId = $request->getAttribute('meetingId');
            
            $account = DB::table('accounts AS A')
                                ->where('A.deletedAt')
                                ->where('A.id', $id)
                                ->first();

            if (!$account) {
                throw new \Exception('No se encontro la cuenta');
            }

            $zoomService = new ZoomService($account->accessKey, $account->secretKey);
            $response = $zoomService->getRecordings($meetingId);
            
            $rsp['success'] = true;
            $rsp['data']    = $response;
            $rsp['message'] = 'recordings';
        } catch (\Exception $e) {
            $rsp['message'] = $e->getMessage();
        }
        return $rsp;
	}

}