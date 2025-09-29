<?php

$map->attach('valora.', '/valora', function ($map) {

    $map->attach('report.', '/reportes', function ($map) {

        $map->get('index', '', [
            'Controller' => 'App\Controllers\ReportValoraController',
            'Action' => 'index'
        ]);

        $map->get('list', '/list', [
            'Controller' => 'App\Controllers\ReportValoraController',
            'Action' => 'list'
        ]);

        $map->get('create', '/crear', [
            'Controller' => 'App\Controllers\ReportValoraController',
            'Action' => 'create'
        ]);

        $map->get('show', '/{id}/editar', [
            'Controller' => 'App\Controllers\ReportValoraController',
            'Action' => 'show'
        ]);

    });

});

?>