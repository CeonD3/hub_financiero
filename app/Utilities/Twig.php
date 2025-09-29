<?php

namespace App\Utilities;

use App\Middlewares\Application;

class Twig
{
    public static function render($filename, $data = [], $global = [])
    {
        $loader = new \Twig\Loader\FilesystemLoader('../resources/views');
        $twig = new \Twig\Environment($loader, [
          'debug' =>  true,
          'cache' => false, 
        ]);
        $param = [ 
          'SESSION' => $_SESSION, 
          'URI'     => $_SERVER["REQUEST_URI"], 
          'GET'     => $_GET, 
          'BASEURL' => $_ENV['APP_URL'], 
          'ROUTE'   => isset(Application::globals()->route) ? Application::globals()->route : null,
          'COMPANY' => isset(Application::globals()->company) ? Application::globals()->company : null,
          'API_URL_FINANCE' => $_ENV['API_URL_FINANCE'],
          'API_URL_MARGARITA' => $_ENV['API_URL_MARGARITA']
        ];
        if (count($global)) {
          foreach ($global as $key => $item) {
            $param[$key] = $item;
          }
        }
        $twig->addGlobal("APP", $param);
        return $twig->render($filename, $data);
    }
}
?>