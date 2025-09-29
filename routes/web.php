<?php

    $map->get('index', '/', [
        'Controller' => 'App\Controllers\HomeController',
        'Action' => 'index'
    ]);

    $map->get('terminos.condiciones', '/terminos-condiciones', [
        'Controller' => 'App\Controllers\HomeController',
        'Action' => 'terminos'
    ]);

    $map->get('politicas-privacidad', '/politicas-privacidad', [
        'Controller' => 'App\Controllers\HomeController',
        'Action' => 'politicas'
    ]);

    require_once __DIR__ . "/web/AuthRoute.php";
    require_once __DIR__ . "/web/FinanceRoute.php";
    require_once __DIR__ . "/web/KapitalRoute.php";
    require_once __DIR__ . "/web/ValoraRoute.php";

    $map->attach('microsoft.', '/microsoft', function ($map) {
        
        $map->get('onedrive.signin', '/onedrive/signin',[
            'Controller' => 'App\Controllers\OnedriveController',
            'Action' => 'signin'
        ]);

        $map->post('onedrive.authUrl', '/onedrive/authUrl', [
            'Controller' => 'App\Controllers\OnedriveController',
            'Action' => 'authUrl'
        ]);    

    });

    $map->get('cron.stacks', '/cron/stacks',[
        'Controller' => 'App\Controllers\CronController',
        'Action' => 'stacks'
    ]);

    $map->attach('admin.', '/admin', function ($map) {
        require_once __DIR__ . "/admin/TemplateMasterRoute.php"; 
        require_once __DIR__ . "/admin/ReportKapitalRoute.php";
        require_once __DIR__ . "/admin/ReportValoraRoute.php";
        require_once __DIR__ . "/admin/AccountRoute.php";
        require_once __DIR__ . "/admin/AdminRoute.php";
        require_once __DIR__ . "/admin/ConfigurationRoute.php";
    });

    require_once __DIR__ . "/api.php";  

?>