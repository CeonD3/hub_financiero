<?php

$map->attach('kapital.', '/kapital', function ($map) {

    $map->get('index', '', [
        'Controller' => 'App\Controllers\KapitalController',
        'Action' => 'index'
    ]);

    $map->get('projects', '/proyectos',[
        'Controller' => 'App\Controllers\KapitalController',
        'Action' => 'projects'
    ]);

    $map->post('store', '/store', [
        'Controller' => 'App\Controllers\KapitalController',
        'Action' => 'store'
    ]);

    $map->post('taxrate', '/taxrate', [
        'Controller' => 'App\Controllers\KapitalController',
        'Action' => 'taxrate'
    ]);

    $map->post('update', '/{uid}/update', [
        'Controller' => 'App\Controllers\KapitalController',
        'Action' => 'update'
    ]);

    $map->post('detailResult', '/{uid}/result/detail', [
        'Controller' => 'App\Controllers\KapitalController',
        'Action' => 'detailResult'
    ]);

    $map->get('results', '/{uid}/resultados', [
        'Controller' => 'App\Controllers\KapitalController',
        'Action' => 'results'
    ]);

    $map->get('analysis', '/{uid}/analisis', [
        'Controller' => 'App\Controllers\KapitalController',
        'Action' => 'analysis'
    ]);

    $map->post('detailAnalysis', '/{uid}/analisis/detail', [
        'Controller' => 'App\Controllers\KapitalController',
        'Action' => 'detailAnalysis'
    ]);

    $map->get('methodology', '/{uid}/metodologia', [
        'Controller' => 'App\Controllers\KapitalController',
        'Action' => 'methodology'
    ]);

    $map->post('cost', '/{uid}/analisis/costos', [
        'Controller' => 'App\Controllers\KapitalController',
        'Action' => 'costAnalysis'
    ]);

    $map->attach('report.', '/{uid}/reportes', function ($map) {

        $map->post('generate', '/generar', [
            'Controller' => 'App\Controllers\KapitalController',
            'Action' => 'generateReport'
        ]);

        $map->post('list', '/list', [
            'Controller' => 'App\Controllers\KapitalController',
            'Action' => 'listReport'
        ]);

        $map->get('view', '/{id}', [
            'Controller' => 'App\Controllers\KapitalController',
            'Action' => 'viewReport'
        ]);

        $map->post('show', '/{id}/show', [
            'Controller' => 'App\Controllers\KapitalController',
            'Action' => 'showReport'
        ]);

    });
});

?>