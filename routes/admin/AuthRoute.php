<?php

    $map->get('login', '/login',[
        'Controller' => 'App\Controllers\AuthController',
        'Action' => 'login'
    ]);

    $map->post('signin', '/signin',[
        'Controller' => 'App\Controllers\AuthController',
        'Action' => 'signin'
    ]);

    $map->post('signout', '/signout',[
        'Controller' => 'App\Controllers\AuthController',
        'Action' => 'signout'
    ]);

    $map->get('profile', '/perfil',[
        'Controller' => 'App\Controllers\AuthController',
        'Action' => 'profile'
    ]);

    $map->attach('mycompany.', '/empresa', function ($map) {

        $map->get('view', '',[
            'Controller' => 'App\Controllers\CompanyController',
            'Action' => 'view'
        ]); 
    
    });

?>