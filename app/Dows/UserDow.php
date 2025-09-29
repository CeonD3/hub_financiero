<?php 

namespace App\Dows;

use Illuminate\Database\Capsule\Manager as DB;
use App\Utilities\FG;
use App\Middlewares\Application;
use App\Services\MicrosoftService;

class UserDow {

    public function info($request) {
		$rsp = FG::responseDefault();
        try {

            $id = $request->getAttribute('id');

            $company = Application::globals()->company;

            $user = DB::table('users AS US')
                        ->leftJoin('user_empresa_perfil AS UEP', 'UEP.user_id', '=', 'US.id')
                        ->leftJoin('empresas AS EMP', 'UEP.empresa_id', '=', 'EMP.id')
                        ->leftJoin('perfiles AS PER', 'UEP.perfil_id', '=', 'PER.id')
                        ->where('US.deleted_at')
                        ->where('US.id', $id)
                        ->select('US.id', 'US.names', 'US.lastnames', 'US.email', 'EMP.nombre_comercial AS name_company', 'EMP.host AS host_company', 'PER.name AS name_profile')
                        ->first();
            if (!$user) {
                throw new \Exception('No se encontró el usuario');
            }
            
            $rsp['success'] = true;
            $rsp['data']    = compact('user');
            $rsp['message'] = 'Datos del usuario';
        } catch (\Exception $e) {
            $rsp['message'] = $e->getMessage();
        }
        return $rsp;
	}

    public function pagination($request)
    {
        $rsp = FG::responseDefault();
        try {

            $input  = $request->getParsedBody();
            $draw   = $input['draw'];
            $length = $input['length'];
            $start  = $input['start'];
            $search = $input['search'];
            $companyId = $input['companyId'];

            $filterText = '';
            if ($search) {
                $value = $search['value'];
                if (strlen($value) > 0) {
                    $filterText = " AND US.names LIKE('%{$value}%') 
                                    OR US.lastnames LIKE('%{$value}%') 
                                    OR US.email LIKE('%{$value}%') 
                                    OR US.id LIKE('%{$value}%')
                                    OR P.name LIKE('%{$value}%')";
                }
            }

            $sql = "SELECT 
                        US.id,
                        US.email,
                        CONCAT(US.names, ' ', US.lastnames) AS fullname,
                        P.name AS profile_name,
                        P.id AS profile_id,
                        EMP.nombre_comercial AS company_name
                    FROM users AS US
                    INNER JOIN user_empresa_perfil AS UEP ON US.id = UEP.user_id
                    LEFT JOIN perfiles AS P ON P.id = UEP.perfil_id
                    LEFT JOIN empresas AS EMP ON EMP.id = UEP.empresa_id
                    WHERE US.deleted_at IS NULL
                    AND UEP.empresa_id = $companyId
                    $filterText
                    ORDER BY US.id DESC";

            $recordsTotal = count(DB::select($sql));

            $sql .= " LIMIT {$start}, {$length}";

            $users = DB::select($sql);

            $recordsFiltered = ($recordsTotal / $length) * $length;

            $rsp['success'] = true;
            $rsp['data'] = $users;
            $rsp['recordsTotal'] = $recordsTotal;
            $rsp['recordsFiltered'] = $recordsFiltered;
            $rsp['message'] = 'successfully';
        } catch (\Exception $e) {
            $rsp['message'] = $e->getMessage();
        }
        return $rsp;
    }

    public function show($request) {
		$rsp = FG::responseDefault();
        try {

            $input = $request->getParsedBody();
            $id = $request->getAttribute('id');
            $companyId = $input['companyId'];

            $user = DB::table('users AS US')
                        ->join('user_empresa_perfil AS UEP', 'UEP.user_id', '=', 'US.id')
                        ->where('US.deleted_at')
                        ->where('US.id', $id)
                        ->where('UEP.empresa_id', $companyId)
                        ->select('US.*', 'UEP.perfil_id AS profile_id')
                        ->first();

            if (!$user) {
                throw new \Exception('No se encontro el usuario');
            }

            $rsp['success'] = true;
            $rsp['data']    = compact('user');
            $rsp['message'] = 'user view detail';
        } catch (\Exception $e) {
            $rsp['message'] = $e->getMessage();
        }
        return $rsp;
	}

    public function update($request) {
		$rsp = FG::responseDefault();
        try {

            $input = $request->getParsedBody();
            $id = $request->getAttribute('id');
            $any = $input['any'];

            if (!$id) {
                throw new \Exception('No se encontro el id del usuario');
            }

            switch ($any) {
                case 'general':

                    $name = trim($input['name']);
                    $lastname = trim($input['lastname']);
                    $profileId = trim($input['profileId']);
                    $companyId = trim($input['companyId']);
        
        
                    DB::table('user_empresa_perfil')->where('user_id', $id)->where('empresa_id', $companyId)->delete();
        
                    DB::table('user_empresa_perfil')->insertGetId([
                        'user_id' => $id,
                        'empresa_id' => $companyId,
                        'perfil_id' => $profileId
                    ]);
                    
                    DB::table('users')->where('id', $id)->update([
                        'names' => $name,
                        'lastnames' => $lastname
                    ]);    
        
                break;
                case 'email':
                    
                    $email = trim($input['email']);
                    if (!$email) {
                        throw new \Exception('Email es un campo requerido');
                    }

                    $user = DB::table('users AS US')->where('US.deleted_at')->where('US.email', $email)->first();
                    if ($user && $user->id != $id) {
                        throw new \Exception('Ya existe un usuario con este correo electrónico');                        
                    } 

                    DB::table('users')->where('id', $id)->update([
                        'email' => $email
                    ]);    

                break;
                case 'password':

                    $password = trim($input['password']);
                    if (!$password) {
                        throw new \Exception('Password es un campo requerido');
                    }
                
                    DB::table('users')->where('id', $id)->update([
                        'password' => crypt($password)
                    ]);    

                break;
            }

            $rsp['success'] = true;
            $rsp['message'] = 'Se actualizo correctamente';
        } catch (\Exception $e) {
            $rsp['message'] = $e->getMessage();
        }
        return $rsp;
	}

    public function store($request) {
		$rsp = FG::responseDefault();
        try {

            $input = $request->getParsedBody();
            $name = trim($input['name']);
            $lastname = trim($input['lastname']);
            $email = trim($input['email']);
            $password = trim($input['password']);
            $profileId = trim($input['profileId']);
            $companyId = trim($input['companyId']);

            $user = DB::table('users AS US')->where('US.email', $email)->first();
            if (!$user) {
                $userId = DB::table('users')->insertGetId([
                    'names' => $name,
                    'lastnames' => $lastname,
                    'email' => $email,
                    'password' => crypt($password)
                ]);
            } else {
                if ($user->deleted_at) {
                    $userId = $user->id;
                    DB::table('users')->where('id', $userId)->update(['deleted_at' => NULL]);    
                } else {
                    throw new \Exception('Ya existe un usuario con este correo');
                }
            }

            DB::table('user_empresa_perfil')->where('user_id', $userId)->where('empresa_id', $companyId)->delete();

            DB::table('user_empresa_perfil')->insertGetId([
                'user_id' => $userId,
                'empresa_id' => $companyId,
                'perfil_id' => $profileId
            ]);

            $rsp['success'] = true;
            $rsp['message'] = 'Se registro correctamente';
        } catch (\Exception $e) {
            $rsp['message'] = $e->getMessage();
        }
        return $rsp;
	}

    public function remove($request) {
		$rsp = FG::responseDefault();
        try {

            $input = $request->getParsedBody();
            $companyId = $input['companyId'];
            $id = $request->getAttribute('id');

            $user = DB::table('users AS US')
                        ->join('user_empresa_perfil AS UEP', 'UEP.user_id', '=', 'US.id')
                        ->where('US.deleted_at')
                        ->where('US.id', $id)
                        ->where('UEP.empresa_id', $companyId)
                        ->select('US.*', 'UEP.perfil_id AS profile_id')
                        ->first();

            if (!$user) {
                throw new \Exception('No se encontro el usuario');
            }

            DB::table('users')->where('id', $id)->update(['deleted_at' => FG::getDateHour()]);
            DB::table('user_empresa_perfil')->where('user_id', $id)->where('empresa_id', $companyId)->delete();

            $rsp['success'] = true;
            $rsp['message'] = 'Se elimino correctamente';
        } catch (\Exception $e) {
            $rsp['message'] = $e->getMessage();
        }
        return $rsp;
	}

}