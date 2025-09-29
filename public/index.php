<?php

error_reporting(E_ERROR); // E_ALL // E_ERROR
date_default_timezone_set('America/Lima');
session_start();

require_once __DIR__ . "/../vendor/autoload.php";

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

// use Illuminate\Database\Capsule\Manager as Capsule;
use Laminas\Diactoros\ServerRequestFactory;
use Aura\Router\RouterContainer;
use App\Middlewares\Application;
use App\Middlewares\Authenticate;

// $capsule = new Capsule;

// require_once __DIR__."/../config/database.php";

$request = ServerRequestFactory::fromGlobals(
    $_SERVER,
    $_GET,
    $_POST,
    $_COOKIE,
    $_FILES
);

// Make this Capsule instance available globally via static methods... (optional)
// $capsule->setAsGlobal();

// Setup the Eloquent ORM... (optional; unless you've used setEventDispatcher())
// $capsule->bootEloquent();
$routerContainer = new RouterContainer();
$map = $routerContainer->getMap();

require_once "../routes/web.php";

$matcher = $routerContainer->getMatcher();
$route = $matcher->match($request);
if (!$route) {
    // get the first of the best-available non-matched routes
    $failedRoute = $matcher->getFailedRoute();
    $filename = '/error/404.twig';
    $status = 404;
    // which matching rule failed?
    switch ($failedRoute->failedRule) {
        case 'Aura\Router\Rule\Allows':
            // 405 METHOD NOT ALLOWED
            // Send the $failedRoute->allows as 'Allow:'
            break;
        case 'Aura\Router\Rule\Accepts':
            // 406 NOT ACCEPTABLE
            break;
        default:
            // 404 NOT FOUND
            $filename = '/error/404.twig';
            break;
    }
    Application::abort($status);
}

// add route attributes to the request
foreach ($route->attributes as $key => $val) {
    $request = $request->withAttribute($key, $val);
}

Application::set('company', Authenticate::factory());
Application::set('route', ['name' => $route->name, 'namePrefix' => $route->namePrefix, 'pathPrefix' => $route->pathPrefix]);
Authenticate::session('USER', 'admin', $route, ['admin.login', 'admin.signin']);
// Authenticate::security('api', $route, ['api.generatekey']);

$handlerData = $route->handler;
$controllerName = $handlerData['Controller'];
$actionName = $handlerData['Action'];
$controller = new $controllerName;
$response = $controller->$actionName($request);
// emit the response
foreach ($response->getHeaders() as $name => $values) {
    foreach ($values as $value) {
        header(sprintf('%s: %s', $name, $value), false);
    }
}
// http_response_code($response->getStatusCode());
if (is_object($response)) {
    echo $response->getBody();
} else {
    echo json_encode($response);
}
exit;
