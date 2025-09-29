<?php 

namespace App\Dows;

use Illuminate\Database\Capsule\Manager as DB;
use \Firebase\JWT\JWT;
use App\Utilities\FG;

class ApiDow {

    public function generatekey($request) {
		$rsp = FG::responseDefault();
        try {

            $input    = $request->getParsedBody();
            $email    = $input['email'];
            $password = $input['password'];
                          
            if (!$email) {
                throw new \Exception('The email is required');
            }
                          
            if (!$password) {
                throw new \Exception('The password is required');
            }

            $user = DB::table('users AS US')
                        ->join('user_empresa_perfil AS EMP', 'EMP.user_id', '=', 'US.id')
                        ->where('US.deleted_at')
                        ->where('US.email', $email)
                        ->whereIn('EMP.perfil_id', [1, 2, 3])
                        ->select('US.*', 'EMP.perfil_id')
                        ->orderBy('EMP.perfil_id', 'ASC')
                        ->first();
                        
            if (!$user) {
                throw new \Exception('El usuario no existe');
            }

            if (!password_verify($password, $user->password)) {
                throw new \Exception('Las credenciales son incorrectas');
            }

            $payload = array(
                'iat' =>  time(),
                'exp' =>  time() + ((3600 * 24) * 5),
                'key' =>  $_ENV['ACCESS_KEY']
            );

            $token = JWT::encode($payload, $_ENV['SECRET_KEY']);

            $rsp['success'] = true;
            $rsp['data']    = compact('token');
            $rsp['message'] = 'Access credencials of account';
        } catch (\Exception $e) {
            $rsp['message'] = $e->getMessage();
        }
        return $rsp;
	}

}