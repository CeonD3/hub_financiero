<?php

namespace App\Services;

use Firebase\JWT\JWT;
use Curl;

class FinanceService
{

    private function getUrl()
    {
        return $_ENV['API_URL_FINANCE'] . '/api';
    }

    private function getAccessKey()
    {
        return $_ENV['API_ACCESS_KEY_FINANCE'];
    }

    private function getSecrectKey()
    {
        return $_ENV['API_SECRET_KEY_FINANCE'];
    }

    public function getToken()
    {
        $payload = [
            'iss' => 'your-issuer',
            'iat' => time(),
            'exp' => time() + 3600,
            // ...other claims...
        ];
        $secret = env('API_SECRET_KEY_FINANCE') ?: '1234';

        // firebase/php-jwt v6+ requiere pasar el algoritmo
        return JWT::encode($payload, $secret, 'HS256');
    }

    public function request($type, $endpointUrl, $jsonData = [])
    {
        try {
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
            // Save the response and close the curl handle
            $jsonResponse = curl_exec($curl_handle);
            // var_dump($jsonResponse); exit;
            $httpcode = curl_getinfo($curl_handle, CURLINFO_HTTP_CODE);
            curl_close($curl_handle);
            if ($httpcode < 200 || $httpcode >= 300) {
                throw new \Exception("code: {$httpcode}" . $jsonResponse);
            }
            $arrayResponse = json_decode($jsonResponse, true);
            if (!$arrayResponse) {
                throw new \Exception($jsonResponse);
            }

            return $arrayResponse;
        } catch (\Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}
