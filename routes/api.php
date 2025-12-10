<?php

$map->attach('api.', '/api', function ($map) {

    $map->post('generatekey', '/generatekey', [
        'Controller' => 'App\Controllers\ApiController',
        'Action' => 'generatekey'
    ]);

    // Yahoo Finance Analysis Routes
    $map->post('analyze-companies', '/analyze-companies', [
        'Controller' => 'App\Controllers\YahooFinanceController',
        'Action' => 'analyzeCompanies'
    ]);

    $map->post('calculate-beta', '/calculate-beta', [
        'Controller' => 'App\Controllers\YahooFinanceController',
        'Action' => 'calculateBeta'
    ]);

    $map->get('yahoo-finance.test', '/yahoo-finance/test', [
        'Controller' => 'App\Controllers\YahooFinanceController',
        'Action' => 'test'
    ]);
});
