<?php

$map->attach('master.', '/master', function ($map) {

    $map->attach('template.', '/plantillas', function ($map) {

        $map->get('index', '', [
            'Controller' => 'App\Controllers\TemplateMasterController',
            'Action' => 'index'
        ]);

        $map->get('list', '/list', [
            'Controller' => 'App\Controllers\TemplateMasterController',
            'Action' => 'list'
        ]);
    
        /*$map->post('meetings', '/{id}/users/{userId}/meetings', [
            'Controller' => 'App\Controllers\ZoomController',
            'Action' => 'meetings'
        ]);
    
        $map->post('recordings', '/{id}/meetings/{meetingId}/recordings', [
            'Controller' => 'App\Controllers\ZoomController',
            'Action' => 'recordings'
        ]);*/

    });

    $map->attach('cover.', '/portadas', function ($map) {

        $map->get('index', '', [
            'Controller' => 'App\Controllers\CoverController',
            'Action' => 'index'
        ]);

        $map->get('create', '/create', [
            'Controller' => 'App\Controllers\CoverController',
            'Action' => 'create'
        ]);

        $map->get('update', '/{cover_id}/update', [
            'Controller' => 'App\Controllers\CoverController',
            'Action' => 'update'
        ]);

        $map->get('edit', '/{cover_id}/edit', [
            'Controller' => 'App\Controllers\CoverController',
            'Action' => 'edit'
        ]);

    });

});

?>