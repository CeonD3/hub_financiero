<?php

namespace App\Services;

use Firebase\JWT\JWT;
use Curl;

class MargaritaService
{

    private function getUrl()
    {
        return $_ENV['API_URL_MARGARITA'] . '/api/v1';
    }

    private function getAccessKey()
    {
        return $_ENV['API_ACCESS_KEY_MARGARITA'];
    }

    private function getSecrectKey()
    {
        return $_ENV['API_SECRET_KEY_MARGARITA'];
    }

    public function getToken()
    {
        $payload = [
            'iss' => 'your-issuer',
            'iat' => time(),
            'exp' => time() + 3600,
            // ...other claims...
        ];
        $secret = env('API_SECRET_KEY_MARGARITA') ?: '1234';

        // Antes: \Firebase\JWT\JWT::encode($payload, $secret)
        // Ahora: incluir el algoritmo requerido por la versión de la librería
        return JWT::encode($payload, $secret, 'HS256');
    }

    public function request($type, $endpointUrl, $jsonData = [])
    {
        try {
            $startTime = microtime(true); // Inicia el cronómetro
            $authzToken = $this->getToken();
            $uri = $this->getUrl();
            $curl_handle = curl_init($uri . $endpointUrl);
            $request_headers = array();
            // We are sending/receiving JSON data
            // $request_headers[] = "Content-Type: application/json";
            // $request_headers[] = "Accept: application/json";
            // REQUIRED: Without a valid authorization token, Square Endpoints will reject
            // the request
            $request_headers[] = "Authorization: Bearer $authzToken";
            // Encode the JSON data and set the message length
            /*if ($jsonData != null) {
                $encodedData = json_encode($jsonData);
                curl_setopt($curl_handle, CURLOPT_POSTFIELDS, $encodedData);
                $request_headers[] = "Content-Length: " . strlen($encodedData);
            }*/
            curl_setopt($curl_handle, CURLOPT_POSTFIELDS, $jsonData);
            curl_setopt($curl_handle, CURLOPT_CUSTOMREQUEST, $type);
            curl_setopt($curl_handle, CURLOPT_HTTPHEADER, $request_headers);
            curl_setopt($curl_handle, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($curl_handle, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($curl_handle, CURLOPT_SSLVERSION, CURL_SSLVERSION_TLSv1_2);

            // Save the response and close the curl handle
            $jsonResponse = curl_exec($curl_handle);
            // var_dump($jsonResponse); exit;
            $httpcode = curl_getinfo($curl_handle, CURLINFO_HTTP_CODE);
            if (curl_errno($curl_handle)) {
                echo 'Curl error: ' . curl_error($curl_handle);
                exit;
            }
            curl_close($curl_handle);
            if ($httpcode < 200 || $httpcode >= 300) {
                throw new \Exception("code: {$httpcode}" . $jsonResponse);
            }
            $arrayResponse = json_decode($jsonResponse, true);
            $endTime = microtime(true); // Detiene el cronómetro
            $executionTime = ($endTime - $startTime); // Calcula el tiempo

            // Imprime el tiempo para depurar. ¡Recuerda quitar esto en producción!
            error_log("Petición a Margarita API ($endpointUrl) tardó: " . $executionTime . " segundos.");

            if (!$arrayResponse) {
                throw new \Exception($jsonResponse);
            }

            return $arrayResponse;
        } catch (\Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}
