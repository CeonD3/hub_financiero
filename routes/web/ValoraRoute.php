<?php

$map->attach('valora.', '/valora', function ($map) {

    $map->get('index', '',[
        'Controller' => 'App\Controllers\ValoraController',
        'Action' => 'index'
    ]);

    $map->get('projects', '/proyectos',[
        'Controller' => 'App\Controllers\ValoraController',
        'Action' => 'projects'
    ]);

    $map->post('store', '/store',[
        'Controller' => 'App\Controllers\ValoraController',
        'Action' => 'store'
    ]);

    $map->post('bvl', '/bvl',[
        'Controller' => 'App\Controllers\ValoraController',
        'Action' => 'bvl'
    ]);

    $map->post('update', '/{uid}/update', [
        'Controller' => 'App\Controllers\ValoraController',
        'Action' => 'update'
    ]);

    $map->get('financial', '/{uid}/financieros',[
        'Controller' => 'App\Controllers\ValoraController',
        'Action' => 'financial'
    ]);

    $map->post('financial.balance', '/{uid}/financieros/balance',[
        'Controller' => 'App\Controllers\ValoraController',
        'Action' => 'balance'
    ]);

    $map->post('detailResult', '/{uid}/result/detail', [
        'Controller' => 'App\Controllers\ValoraController',
        'Action' => 'detailResult'
    ]);

    $map->post('detailAnalysis', '/{uid}/analysis/detail', [
        'Controller' => 'App\Controllers\ValoraController',
        'Action' => 'detailAnalysis'
    ]);

    $map->post('cost', '/{uid}/analysis/cost', [
        'Controller' => 'App\Controllers\ValoraController',
        'Action' => 'costAnalysis'
    ]);

    $map->get('result', '/{uid}/resultados',[
        'Controller' => 'App\Controllers\ValoraController',
        'Action' => 'result'
    ]);

    $map->get('analysis', '/{uid}/analisis',[
        'Controller' => 'App\Controllers\ValoraController',
        'Action' => 'analysis'
    ]);

    $map->get('methodology', '/{uid}/metodologia',[
        'Controller' => 'App\Controllers\ValoraController',
        'Action' => 'methodology'
    ]);

    $map->attach('report.', '/{uid}/reportes', function ($map) {

        $map->post('generate', '/generar', [
            'Controller' => 'App\Controllers\ValoraController',
            'Action' => 'generateReport'
        ]);

        $map->post('list', '/list', [
            'Controller' => 'App\Controllers\ValoraController',
            'Action' => 'listReport'
        ]);

        $map->get('view', '/{id}', [
            'Controller' => 'App\Controllers\ValoraController',
            'Action' => 'viewReport'
        ]);

        $map->post('show', '/{id}/show', [
            'Controller' => 'App\Controllers\ValoraController',
            'Action' => 'showReport'
        ]);

    });

});

?>