<?php

$map->attach('user.', '/usuarios', function ($map) {

    $map->get('index', '', [
        'Controller' => 'App\Controllers\UserController',
        'Action' => 'index'
    ]);

    $map->post('pagination', '/pagination', [
        'Controller' => 'App\Controllers\UserController',
        'Action' => 'pagination'
    ]);

    $map->post('store', '/store', [
        'Controller' => 'App\Controllers\UserController',
        'Action' => 'store'
    ]);

    $map->post('info', '/{id}/info', [
        'Controller' => 'App\Controllers\UserController',
        'Action' => 'info'
    ]);

    $map->post('update', '/{id}/update', [
        'Controller' => 'App\Controllers\UserController',
        'Action' => 'update'
    ]);

    $map->post('remove', '/{id}/remove', [
        'Controller' => 'App\Controllers\UserController',
        'Action' => 'remove'
    ]);

    $map->post('show', '/{id}/show', [
        'Controller' => 'App\Controllers\UserController',
        'Action' => 'show'
    ]);

});

?>