<?php

$map->attach('zoom.', '/zoom', function ($map) {

    $map->post('users', '/{id}/users', [
        'Controller' => 'App\Controllers\ZoomController',
        'Action' => 'users'
    ]);

    $map->post('meetings', '/{id}/users/{userId}/meetings', [
        'Controller' => 'App\Controllers\ZoomController',
        'Action' => 'meetings'
    ]);

    $map->post('recordings', '/{id}/meetings/{meetingId}/recordings', [
        'Controller' => 'App\Controllers\ZoomController',
        'Action' => 'recordings'
    ]);

});

?>