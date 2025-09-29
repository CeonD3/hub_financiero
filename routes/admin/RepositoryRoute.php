<?php

$map->attach('repositories.', '/repositorios', function ($map) {

    $map->get('index', '', [
        'Controller' => 'App\Controllers\RepositoryController',
        'Action' => 'index'
    ]);

    $map->post('transfer', '/{id}/transfer', [
        'Controller' => 'App\Controllers\RepositoryController',
        'Action' => 'transfer'
    ]);

    $map->post('transfers', '/{id}/transfers', [
        'Controller' => 'App\Controllers\RepositoryController',
        'Action' => 'transfers'
    ]);

    $map->post('removeStack', '/stacks/{id}/remove', [
        'Controller' => 'App\Controllers\RepositoryController',
        'Action' => 'removeStack'
    ]);


    $map->post('childrensStack', '/stacks/{id}/childrens', [
        'Controller' => 'App\Controllers\RepositoryController',
        'Action' => 'childrensStack'
    ]);

    $map->get('detail', '/{id}/detail', [
        'Controller' => 'App\Controllers\RepositoryController',
        'Action' => 'detail'
    ]);

    $map->post('show', '/{id}/show', [
        'Controller' => 'App\Controllers\RepositoryController',
        'Action' => 'show'
    ]);

    $map->post('accounts', '/{id}/accounts', [
        'Controller' => 'App\Controllers\RepositoryController',
        'Action' => 'accounts'
    ]);

});

?>