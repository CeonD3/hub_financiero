<?php 

namespace App\Dows;

use Illuminate\Database\Capsule\Manager as DB;
use App\Utilities\FG;
use App\Middlewares\Application;

class RepositoryDow {

    public function index($request) {
		$rsp = FG::responseDefault();
        try {

            $sql = "SELECT
                        TA.*,
                        COUNT(A.repositoryId) AS quantity
                    FROM repositories AS TA
                    LEFT JOIN accounts AS A ON A.repositoryId = TA.id
                    WHERE TA.deletedAt IS NULL
                    AND A.deletedAt IS NULL
                    AND TA.status = 1                  
                    GROUP BY TA.id;";
                    
            $repositories = DB::select($sql);

            $rsp['success'] = true;
            $rsp['data']    = compact('repositories');
            $rsp['message'] = 'index';
        } catch (\Exception $e) {
            $rsp['message'] = $e->getMessage();
        }
        return $rsp;
	}

    public function detail($request) {
		$rsp = FG::responseDefault();
        try {

            $input = $request->getParsedBody();
            $id = $request->getAttribute('id');

            $repository = DB::table('repositories AS TA')
                                ->where('TA.deletedAt')
                                ->where('TA.id', $id)
                                ->first();

            $repositories = DB::table('repositories AS TA')
                                ->where('TA.deletedAt')
                                ->where('TA.status', 1)
                                ->where('TA.id', '!=', $repository->id)
                                ->get();

            

            $rsp['success'] = true;
            $rsp['data']    = compact('repository', 'repositories');
            $rsp['message'] = 'Detail';
        } catch (\Exception $e) {
            $rsp['message'] = $e->getMessage();
        }
        return $rsp;
	}

    public function accounts($request) {
		$rsp = FG::responseDefault();
        try {

            $input = $request->getParsedBody();
            $id = $request->getAttribute('id');
            $companyId = $input['companyId'];
            $userId    = $input['userId'];

            $accounts = DB::table('accounts AS A')
                                ->where('A.deletedAt')
                                ->where('A.repositoryId', $id)
                                ->where('A.companyId', $companyId)
                                // ->where('A.userId', $userId)
                                ->get();

            $repositories = DB::table('repositories AS A')
                                ->where('A.deletedAt')
                                ->where('A.status', 1)
                                ->get();

            $rsp['success'] = true;
            $rsp['data']    = compact('accounts', 'repositories');
            $rsp['message'] = 'list';
        } catch (\Exception $e) {
            $rsp['message'] = $e->getMessage();
        }
        return $rsp;
	}

    public function transfer($request) {
		$rsp = FG::responseDefault();
        try {

            $input = $request->getParsedBody();
            $id = $request->getAttribute('id');

            $accountIdSender    = $input['accountIdSender'];
            $userIdSender       = $input['userIdSender'];
            $folderIdSender     = $input['folderIdSender'];
            $accountIdReceiver  = $input['accountIdReceiver'];
            $folderIdReceiver   = $input['folderIdReceiver'];
            $nameFileReceiver   = $input['nameFileReceiver'];
            $typeIdStack        = $input['typeIdStack'];
            $items              = json_decode($input['items']);
            $companyId          = $input['companyId'];
            $userId             = $input['userId'];

            $repository = DB::table('repositories AS TA')
                                ->where('TA.deletedAt')
                                ->where('TA.id', $id)
                                ->first();
            if (!$repository) {
                throw new \Exception('No existe el repositorio');
            }

            foreach ($items as $key => $item) {
                switch (intval($typeIdStack)) {
                    case 1:
                        $exists = DB::table('stacks AS S')
                                        ->where('S.accountIdSender', $item)
                                        ->where('S.accountIdReceiver', $accountIdReceiver)
                                        ->where('S.folderIdReceiver', $folderIdReceiver)
                                        // ->where('S.userId', $userId)
                                        ->where('S.companyId', $companyId)
                                        ->where('S.typeId', $typeIdStack)
                                        ->first();
                        if (!$exists) {
                            DB::table('stacks')->insertGetId([
                                'accountIdSender'   => $item,
                                'accountIdReceiver' => $accountIdReceiver,
                                'folderIdReceiver'  => $folderIdReceiver,
                                'nameFileReceiver'  => $nameFileReceiver,
                                'userId'            => $userId,
                                'companyId'         => $companyId,
                                'typeId'            => $typeIdStack,
                                'status'            => 4
                            ]);
                        }
                    break;

                    case 2:
                        $exists = DB::table('stacks AS S')
                                        ->where('S.deletedAt')
                                        ->where('S.accountIdSender', $accountIdSender)
                                        ->where('S.userIdSender', $item)
                                        ->where('S.accountIdReceiver', $accountIdReceiver)
                                        ->where('S.folderIdReceiver', $folderIdReceiver)
                                        // ->where('S.userId', $userId)
                                        ->where('S.companyId', $companyId)
                                        ->where('S.typeId', $typeIdStack)
                                        ->where('S.parentId', 0)
                                        ->first();
                        if (!$exists) {
                            DB::table('stacks')->insertGetId([
                                'accountIdSender'   => $accountIdSender,
                                'userIdSender'      => $item,
                                'accountIdReceiver' => $accountIdReceiver,
                                'folderIdReceiver'  => $folderIdReceiver,
                                'nameFileReceiver'  => $nameFileReceiver,
                                'userId'            => $userId,
                                'companyId'         => $companyId,
                                'typeId'            => $typeIdStack,
                                'status'            => 0
                            ]);
                        }
                    break;

                    case 3:
                        $exists = DB::table('stacks AS S')
                                        ->where('S.deletedAt')
                                        ->where('S.accountIdSender', $accountIdSender)
                                        ->where('S.userIdSender', $item)
                                        ->where('S.folderIdSender', $folderIdSender)
                                        ->where('S.accountIdReceiver', $accountIdReceiver)
                                        ->where('S.folderIdReceiver', $folderIdReceiver)
                                        // ->where('S.userId', $userId)
                                        ->where('S.companyId', $companyId)
                                        ->where('S.typeId', $typeIdStack)
                                        ->where('S.parentId', 0)
                                        ->first();
                        if (!$exists) {
                            DB::table('stacks')->insertGetId([
                                'accountIdSender'   => $accountIdSender,
                                'userIdSender'      => $userIdSender,
                                'folderIdSender'    => $item,
                                'accountIdReceiver' => $accountIdReceiver,
                                'folderIdReceiver'  => $folderIdReceiver,
                                'nameFileReceiver'  => $nameFileReceiver,
                                'userId'            => $userId,
                                'companyId'         => $companyId,
                                'typeId'            => $typeIdStack,
                                'status'            => 0
                            ]);
                        }
                    break;

                    case 4:
                        $exists = DB::table('stacks AS S')
                                        ->where('S.deletedAt')
                                        ->where('S.accountIdSender', $accountIdSender)
                                        ->where('S.userIdSender', $item)
                                        ->where('S.folderIdSender', $folderIdSender)
                                        ->where('S.fileIdSender', $fileIdSender)
                                        ->where('S.accountIdReceiver', $accountIdReceiver)
                                        ->where('S.folderIdReceiver', $folderIdReceiver)
                                        // ->where('S.userId', $userId)
                                        ->where('S.companyId', $companyId)
                                        ->where('S.typeId', $typeIdStack)
                                        ->where('S.parentId', 0)
                                        ->first();
                        if (!$exists) {
                            DB::table('stacks')->insertGetId([
                                'accountIdSender'   => $accountIdSender,
                                'userIdSender'      => $userIdSender,
                                'folderIdSender'    => $folderIdSender,
                                'fileIdSender'      => $item,
                                'accountIdReceiver' => $accountIdReceiver,
                                'folderIdReceiver'  => $folderIdReceiver,
                                'nameFileReceiver'  => $nameFileReceiver,
                                'userId'            => $userId,
                                'companyId'         => $companyId,
                                'typeId'            => $typeIdStack,
                                'status'            => 0
                            ]);
                        }
                    break;
                    
                    default:
                    break;
                }
            }

            $rsp['success'] = true;
            $rsp['message'] = 'Se registro correctamente';
        } catch (\Exception $e) {
            $rsp['message'] = $e->getMessage();
        }
        return $rsp;
	}

    public function transfers($request) {
		$rsp = FG::responseDefault();
        try {

            $input = $request->getParsedBody();
            $id = $request->getAttribute('id');

            $repository = DB::table('repositories AS TA')
                                ->where('TA.deletedAt')
                                ->where('TA.id', $id)
                                ->first();
            if (!$repository) {
                throw new \Exception('No existe el repositorio');
            }
            $stacks = DB::table('stacks AS S')
                            ->leftJoin('accounts AS ASE', 'ASE.id', '=', 'S.accountIdSender')
                            ->leftJoin('accounts AS ARE', 'ARE.id', '=', 'S.accountIdReceiver')
                            ->leftJoin('repositories AS RSE', 'RSE.id', '=', 'ASE.repositoryId')
                            ->leftJoin('repositories AS RRE', 'RRE.id', '=', 'ARE.repositoryId')
                            ->where('S.deletedAt')
                            ->where('ASE.repositoryId', $id)
                            ->where('S.parentId', 0)  
                            ->select(
                                'S.id',
                                'S.userId',
                                'S.companyId',

                                'S.accountIdSender',
                                'ASE.name AS accountNameSender',
                                'S.folderIdSender',
                                'S.accountIdReceiver',
                                'ARE.name AS accountNameReceiver',
                                'S.folderIdReceiver',
                                'S.status',
                                'S.createdAt',
                                'S.typeId',

                                'ASE.accessKey AS accessKeySender',
                                'ASE.secretKey AS secretKeySender',
                                'ASE.token AS tokenSender',
                                'ASE.status AS statusSender',
                                'ASE.repositoryId AS repositoryIdSender',

                                'ARE.accessKey AS accessKeyReceiver',
                                'ARE.secretKey AS secretKeyReceiver',
                                'ARE.token AS tokenReceiver',
                                'ARE.status AS statusReceiver',
                                'ARE.repositoryId AS repositoryIdReceiver',

                                'RSE.name AS repositoryNameSender',
                                'RRE.name AS repositoryNameReceiver',
                                        
                            )
                            ->get();

            $rsp['success'] = true;
            $rsp['data']    = compact('stacks');
            $rsp['message'] = 'stacks';
        } catch (\Exception $e) {
            $rsp['message'] = $e->getMessage();
        }
        return $rsp;
	}

    public function removeStack($request) {
		$rsp = FG::responseDefault();
        try {

            $id = $request->getAttribute('id');

            DB::table('stacks')->where('id', $id)->update(['deletedAt' => FG::getDateHour()]);

            $rsp['success'] = true;
            $rsp['message'] = 'Se elimino correctamente';
        } catch (\Exception $e) {
            $rsp['message'] = $e->getMessage();
        }
        return $rsp;
	}

    public function childrensStack($request) {
		$rsp = FG::responseDefault();
        try {

            $input = $request->getParsedBody();
            $id = $request->getAttribute('id');

            $childrens = DB::table('stacks AS S')
                            ->leftJoin('accounts AS ASE', 'ASE.id', '=', 'S.accountIdSender')
                            ->leftJoin('accounts AS ARE', 'ARE.id', '=', 'S.accountIdReceiver')
                            ->leftJoin('repositories AS RSE', 'RSE.id', '=', 'ASE.repositoryId')
                            ->leftJoin('repositories AS RRE', 'RRE.id', '=', 'ARE.repositoryId')
                            ->where('S.deletedAt')
                            ->where('S.parentId', $id)  
                            ->select(
                                'S.id',
                                'S.userId',
                                'S.companyId',

                                'S.accountIdSender',
                                'ASE.name AS accountNameSender',
                                'S.folderIdSender',
                                'S.nameFileSender',

                                'S.accountIdReceiver',
                                'ARE.name AS accountNameReceiver',
                                'S.folderIdReceiver',
                                'S.nameFileReceiver',

                                'S.status',
                                'S.createdAt',
                                'S.typeId',

                                'ASE.accessKey AS accessKeySender',
                                'ASE.secretKey AS secretKeySender',
                                'ASE.token AS tokenSender',
                                'ASE.status AS statusSender',
                                'ASE.repositoryId AS repositoryIdSender',

                                'ARE.accessKey AS accessKeyReceiver',
                                'ARE.secretKey AS secretKeyReceiver',
                                'ARE.token AS tokenReceiver',
                                'ARE.status AS statusReceiver',
                                'ARE.repositoryId AS repositoryIdReceiver',

                                'RSE.name AS repositoryNameSender',
                                'RRE.name AS repositoryNameReceiver',
                                        
                            )
                            ->get();

            $rsp['success'] = true;
            $rsp['data']    = compact('childrens');
            $rsp['message'] = 'childrens';
        } catch (\Exception $e) {
            $rsp['message'] = $e->getMessage();
        }
        return $rsp;
	}
}