<?php

$map->attach('onedrive.', '/onedrive', function ($map) {

    $map->post('accounts', '/accounts', [
        'Controller' => 'App\Controllers\OnedriveController',
        'Action' => 'accounts'
    ]);

    $map->post('folders', '/folders', [
        'Controller' => 'App\Controllers\OnedriveController',
        'Action' => 'folders'
    ]);

});

?>