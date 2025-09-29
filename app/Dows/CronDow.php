<?php 

namespace App\Dows;

ini_set('memory_limit', '-1');
// set_time_limit(18000);
/*
    0 PENDIENTE
    1 FINALIZADO
    2 PROCESO
    3 ERROR
    4 AUTOMATICO
*/
use Illuminate\Database\Capsule\Manager as DB;
use App\Utilities\FG;
use App\Middlewares\Application;
use App\Services\ZoomService;
use App\Services\OnedriveService;

class CronDow {

    public function stacks($request) {
		$rsp = FG::responseDefault();
        $steps = [];
        $logId = 0;
        try {
            $steps[] = FG::step('Inicio del proceso');
            $logId = DB::table('logs')->insertGetId([
                'datetime'  => FG::getDateHour(),
                'steps'     => json_encode($steps)
            ]);

            $stacks = DB::table('stacks AS S')
                            ->leftJoin('accounts AS ASE', 'ASE.id', '=', 'S.accountIdSender')
                            ->leftJoin('accounts AS ARE', 'ARE.id', '=', 'S.accountIdReceiver')
                            ->where('S.deletedAt')
                            ->whereIn('S.status', [0, 4])
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
                                        
                            )
                            ->get();
                            
            foreach ($stacks as $key => $stack) {
                $steps[] = FG::step('Procesa Archivos de Zoom del Stack ID ' . $stack->id);
                DB::table('logs')->where('id', $logId)->update(['steps' => json_encode($steps)]);    
                $stack->logId = $logId;
                $stack->steps = $steps;
                try {
                    $result = $this->fileUploadZoomStack($stack);
                    if (!$result['success']) {
                        throw new \Exception($result['message']);
                    }
                    if (isset($result['data']['steps'])) {
                        $steps = $result['data']['steps'];
                    }
                } catch (\Exception $e1) {
                    $steps[] = FG::step($e1->getMessage());
                    DB::table('logs')->where('id', $logId)->update(['steps' => json_encode($steps)]);        
                }
            }
            $steps[] = FG::step('Fin del proceso');
            DB::table('logs')->where('id', $logId)->update(['steps' => json_encode($steps)]);

            $rsp['success'] = true;
            $rsp['message'] = 'Se completo el proceso del servicio';
        } catch (\Exception $e) {
            $rsp['message'] = $e->getMessage();
            if ($logId > 0) {
                $steps[] = FG::step($e->getMessage());
                DB::table('logs')->where('id', $logId)->update(['steps' => json_encode($steps)]);
            }
        }
        return $rsp;
	}

    public function fileUploadZoomStack($stack) {
        $steps = $stack->steps;
        $logId = $stack->logId;
        $rsp = FG::responseDefault();
        try {
            $basepath = __DIR__.'/../../public/stacks/';
            $zoomService = new ZoomService($stack->accessKeySender, $stack->secretKeySender);
            $onedriveService = new OnedriveService();
            switch (intval($stack->typeId)) {
                case 1:
                    $reponse = $zoomService->getUsers();
                    foreach ($reponse->users as $k1 => $user) {
                        if ($user->type == 2) { // Con licencia
                            try {
                                $result = $zoomService->getMeetings($user->id);
                                $meetings = $result->meetings;
                            } catch (\Exception $e1) {
                                $meetings = [];
                                // FG::debug($e1->getMessage());
                            }
                            $steps[] = FG::step('Videoconferencias '.count($meetings));
                            DB::table('logs')->where('id', $logId)->update(['steps' => json_encode($steps)]);
                            foreach ($meetings as $k2 => $meeting) {
                                try {
                                    $result = $zoomService->getRecordings($meeting->id);
                                    $recordings = $result->recording_files;
                                } catch (\Exception $e2) {
                                    $recordings = [];
                                    // FG::debug($e2->getMessage());
                                }
                                foreach ($recordings as $k3 => $recording) {
                                    $steps[] = FG::step('Videoconferencia N° '. ($k2+1) .' Grabación N° '. ($k3+1));
                                    DB::table('logs')->where('id', $logId)->update(['steps' => json_encode($steps)]);
                                    $exists = DB::table('stacks AS S')
                                                    ->where('S.deletedAt')
                                                    ->where('S.fileIdSender', $recording->id)
                                                    ->where('S.parentId', $stack->id)
                                                    ->first();
                                    if (!$exists) {
                                        $topic = FG::slugify(strtolower($meeting->topic));
                                        $nameFileSender = $meeting->id. '-' . ($k3 + 1). '-' . $topic . '.' . strtolower($recording->file_extension);

                                        DB::table('stacks')->insertGetId([
                                            'accountIdSender'   => $stack->accountIdSender,
                                            'userIdSender'      => $user->id,
                                            'folderIdSender'    => $meeting->id,
                                            'folderNameSender'  => $topic,
                                            'fileIdSender'      => $recording->id,
                                            'downloadUrlFileSender' => $recording->download_url,
                                            'nameFileSender'    => $nameFileSender,
                                            'responseFileSender'=> json_encode($recording),
                                            'accountIdReceiver' => $stack->accountIdReceiver,
                                            'folderIdReceiver'  => $stack->folderIdReceiver,
                                            'folderNameReceiver'=> $topic,
                                            'nameFileReceiver'  => $stack->nameFileReceiver,
                                            'userId'            => $stack->userId,
                                            'companyId'         => $stack->companyId,
                                            'typeId'            => $stack->typeId,
                                            'status'            => 0,
                                            'parentId'          => $stack->id
                                        ]);
                                    }
                                }
                            }
                        }
                    }

                    $childrens = DB::table('stacks AS S')->where('S.deletedAt')->where('S.parentId', $stack->id)->whereIn('S.status', [0, 3])->get();
                    $keysChildrens = [];
                    foreach ($childrens as $k => $children) {
                        $keysChildrens[$children->folderIdSender][] = $children;
                    }
                    $steps[] = FG::step('Archivos para procesar '. count($childrens));
                    DB::table('logs')->where('id', $logId)->update(['steps' => json_encode($steps)]);
                    $threads = 0;
                    foreach ($keysChildrens as $key => $files) {
                        if ($threads < 3) {
                            foreach ($files as $k => $file) {
                                try {
                                    $steps[] = FG::step('Procesando archivo '.$file->nameFileSender);
                                    DB::table('logs')->where('id', $logId)->update(['steps' => json_encode($steps), 'files' => ($k + 1)]);
                                    DB::table('stacks')->where('id', $file->id)->update(['status' => 2,'response'=> 'Descargando Archivo']);
                                    $filepath = $basepath . $file->nameFileSender;
                                    if (!file_exists($filepath)) {
                                        $steps[] = FG::step('Descargando archivo '.$file->nameFileSender);
                                        DB::table('logs')->where('id', $logId)->update(['steps' => json_encode($steps)]);
                                        $filepath = $zoomService->getFilePathDownloaded($file->downloadUrlFileSender, $filepath);
                                    }
                                    if (!file_exists($filepath)) {
                                        throw new \Exception("No se descargo el archivo del proveedor");
                                    }
                                    $onedriveService->setToken($stack->tokenReceiver, $stack->accountIdReceiver);
                                    $folderId = null;                        
                                    $folders = $onedriveService->folders($stack->folderIdReceiver);
                                    if (isset($folders['value'])) {
                                        $values = $folders['value'];
                                        foreach ($values as $v => $value) {
                                            if (strtolower(trim($value['name'])) == strtolower(trim($file->folderNameReceiver))) {
                                                $folderId = $value['id'];
                                                break;
                                            }
                                        }
                                    }
                                    if (!$folderId) {
                                        $folder = $onedriveService->createFolder($file->folderNameReceiver, $stack->folderIdReceiver);
                                        if(isset($folder['id'])) {
                                            $folderId = $folder['id'];
                                        }
                                    }
                                    $steps[] = FG::step('Subiendo archivo '.$file->nameFileSender);
                                    DB::table('logs')->where('id', $logId)->update(['steps' => json_encode($steps)]);
                                    DB::table('stacks')->where('id', $file->id)->update(['response'=> 'Subiendo Archivo']);
                                    $fileupload = $onedriveService->uploadFilePath($filepath, $folderId);
                                    if (!isset($fileupload['id'])) {
                                        throw new \Exception(json_encode($fileupload));
                                    }
                                    $steps[] = FG::step('Se subio correctamente el archivo '.$file->nameFileSender);
                                    DB::table('logs')->where('id', $logId)->update(['steps' => json_encode($steps)]);
                                    DB::table('stacks')->where('id', $file->id)->update([
                                        'status' => 1, 
                                        'response' => 'Se subio correctamente',
                                        'nameFileReceiver' => @$fileupload['name'],
                                        'urlFileReceiver' => @$fileupload['webUrl'],
                                        'responseFileReceiver'=> json_encode($fileupload),
                                    ]);
                                    
                                } catch (\Exception $e1) {
                                    DB::table('stacks')->where('id', $file->id)->update(['status' => 3, 'response' => $e1->getMessage()]);
                                }
                            }
                            $childrensUploades = DB::table('stacks AS S')->where('S.deletedAt')->where('S.folderIdSender', $key)->where('S.status', '!=', 1)->get();
                            if (count($childrensUploades) == 0) {
                                $result = $zoomService->getRemoveRecording($key);
                                $steps[] = FG::step('Se elimino la videoconferencia');
                                DB::table('logs')->where('id', $logId)->update(['steps' => json_encode($steps)]);
                            }
                        }
                        $threads = $threads + 1;
                    }
                break;
                
                default:
                    # code...
                break;
            }
            $rsp['success'] = true;
            $rsp['message'] = 'Se proceso correctamente';
        } catch (\Exception $e) {
            // DB::table('stacks')->where('id', $stack->id)->update(['status' => 3, 'response' => $e->getMessage()]);
            $steps[] = FG::step($e->getMessage());
            DB::table('logs')->where('id', $logId)->update(['steps' => json_encode($steps)]);
            $rsp['message'] = $e->getMessage();
        }
        $rsp['data'] = compact('steps');
        return $rsp;
    }

}