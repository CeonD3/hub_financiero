<?php

$map->attach('finance.', '/finance', function ($map) {

    $map->post('industries', '/industries',[
        'Controller' => 'App\Controllers\FinanceController',
        'Action' => 'industries'
    ]);

    $map->post('proyect.remove', '/projects/{id}/remove',[
        'Controller' => 'App\Controllers\FinanceController',
        'Action' => 'removeProyect'
    ]);

});

?>