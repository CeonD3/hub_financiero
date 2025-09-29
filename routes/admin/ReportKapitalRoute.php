<?php

$map->attach('kapital.', '/kapital', function ($map) {

    $map->attach('report.', '/reportes', function ($map) {

        $map->get('index', '', [
            'Controller' => 'App\Controllers\ReportKapitalController',
            'Action' => 'index'
        ]);

        $map->get('list', '/list', [
            'Controller' => 'App\Controllers\ReportKapitalController',
            'Action' => 'list'
        ]);

        $map->get('create', '/crear', [
            'Controller' => 'App\Controllers\ReportKapitalController',
            'Action' => 'create'
        ]);

        $map->get('show', '/{id}/editar', [
            'Controller' => 'App\Controllers\ReportKapitalController',
            'Action' => 'show'
        ]);

    });

});

?>