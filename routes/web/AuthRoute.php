<?php

    $map->get('login', '/login', [
        'Controller' => 'App\Controllers\AuthController',
        'Action' => 'login'
    ]);

    $map->get('register', '/registrate', [
        'Controller' => 'App\Controllers\AuthController',
        'Action' => 'register'
    ]);

    $map->attach('auth.', '/auth', function ($map) {
        
        $map->post('signin', '/signin',[
            'Controller' => 'App\Controllers\AuthController',
            'Action' => 'signin'
        ]);

        $map->post('signup', '/signup',[
            'Controller' => 'App\Controllers\AuthController',
            'Action' => 'signup'
        ]);

        $map->get('signout', '/signout',[
            'Controller' => 'App\Controllers\AuthController',
            'Action' => 'signout'
        ]);

    });

?>