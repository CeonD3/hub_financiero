<?php

namespace App\Middlewares;

use Illuminate\Database\Capsule\Manager as DB;
use Laminas\Diactoros\Response\JsonResponse;
use App\Middlewares\Application;
use \Firebase\JWT\JWT;

class Authenticate
{

    public static function factory()
    {
        $factory = null;
        $hostname = str_replace("www.", "", @$_SERVER['HTTP_HOST']);
        // $factory = DB::table('companies')->where('deletedAt')->where('host', $hostname)->first();
        /*if (!$factory) {
            echo "Este host no esta registrado en el sistema"; exit;
        }*/
        return $factory;
    }

    public static function session($sessioname = null, $pathname = null, $route = null, $exceptions = [])
    {
        if ($sessioname && $route && $pathname) {
            $array = explode('.', $route->name);
            if (array_shift($array) == $pathname) {
                // comprobar sesión y perfil permitido (1 o 2)
                $hasSession = isset($_SESSION[$sessioname]) && is_object($_SESSION[$sessioname]);
                $perfil = $hasSession && property_exists($_SESSION[$sessioname], 'perfil') ? $_SESSION[$sessioname]->perfil : null;
                $allowedProfiles = [1, 2];
                if (!$hasSession || !in_array($perfil, $allowedProfiles, true)) {
                    if (!in_array($route->name, $exceptions)) {
                        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
                            $response = new JsonResponse(['success' => false, 'message' => 'Se cerró la sesión en la plataforma por falta de uso, vuelve a iniciar sesión.', 'status' => 401], 401);
                            // http_response_code($response->getStatusCode());
                            echo $response->getBody();
                        } else {
                            header('Location: ' . Application::$redirect_admin_login);
                        }
                        exit;
                    }
                } else {
                    if ((in_array($route->name, $exceptions))) { // if exists session and pathname only show not session
                        header('Location: ' . Application::$redirect_admin);
                        exit;
                    }
                }
            }
        }
    }

    public static function security($pathname = null, $route = null, $exceptions = [])
    {
        if ($route && $pathname) {
            if (!(in_array($route->name, $exceptions))) {
                $array = explode('.', $route->name);
                if (array_shift($array) == $pathname) {
                    $rsp = ['success' => false, 'data' => [], 'message' => 'Error en el servicio.'];
                    try {
                        $rsp['data'] = $auth = apache_request_headers()["Authorization"];
                        $token = explode(" ", $auth)[1];
                        $decoded = JWT::decode($token, $_ENV["SECRET_KEY"], array('HS256'));
                        if ($decoded->key != $_ENV["ACCESS_KEY"]) {
                            throw new \Exception('wrong credentials');
                        }
                        $rsp['success'] = true;
                        $rsp['data'] = compact('decoded');
                    } catch (\Exception $e) {
                        $rsp["message"]  = $e->getMessage();
                    }
                    if (!$rsp['success']) {
                        echo json_encode($rsp);
                        exit();
                    }
                }
            }
        }
    }
}
