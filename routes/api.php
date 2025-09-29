<?php

    $map->attach('api.', '/api', function ($map) {

        $map->post('generatekey', '/generatekey',[
            'Controller' => 'App\Controllers\ApiController',
            'Action' => 'generatekey'
        ]);
        
    });

?>