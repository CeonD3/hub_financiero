<?php

$map->attach('account.', '/cuentas', function ($map) {

    $map->get('index', '', [
        'Controller' => 'App\Controllers\AccountController',
        'Action' => 'index'
    ]);

});

?>