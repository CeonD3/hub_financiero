<?php

$map->attach('configuration.', '/configuraciones', function ($map) {

    $map->get('index', '', [
        'Controller' => 'App\Controllers\ConfigurationController',
        'Action' => 'index'
    ]);

});

?>