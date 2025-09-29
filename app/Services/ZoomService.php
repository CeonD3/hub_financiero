<?php

namespace App\Services;

use Firebase\JWT\JWT;

class ZoomService {

	private $curl;
	private $access_key;
	private $secret_key;

	public function __construct($access, $secret) {
        $this->access_key = $access;
        $this->secret_key = $secret;
	}

	public function getUrl() {
		return $_ENV['ZOOM_API_URL'];
	}

	private function getToken() {
        $key = $this->access_key;
        $secret = $this->secret_key;
        $token = array(
            'iss' => $key,
            'exp' => time() + 3600
        );
        return JWT::encode($token, $secret);
	}

	public function getApi($type, $endpointUrl, $jsonData = null) {
			$authzToken = $this->getToken();
			$uri = $this->getUrl();
			$curl_handle = curl_init($uri.$endpointUrl);
			$request_headers = array();
			// We are sending/receiving JSON data
			$request_headers[] = "Content-Type: application/json";
			$request_headers[] = "Accept: application/json";
			// REQUIRED: Without a valid authorization token, Square Endpoints will reject
			// the request
			$request_headers[] = "Authorization: Bearer $authzToken";
			// Encode the JSON data and set the message length
			if ($jsonData != null) {
				$encodedData = json_encode($jsonData);
				curl_setopt($curl_handle, CURLOPT_POSTFIELDS, $encodedData);
				$request_headers[] = "Content-Length: " . strlen($encodedData);
			}
			curl_setopt($curl_handle, CURLOPT_CUSTOMREQUEST, $type);
			curl_setopt($curl_handle, CURLOPT_HTTPHEADER, $request_headers);
			curl_setopt($curl_handle, CURLOPT_RETURNTRANSFER, 1);        
			// Save the response and close the curl handle
			$jsonResponse = curl_exec($curl_handle);
			$httpcode = curl_getinfo($curl_handle, CURLINFO_HTTP_CODE);
			curl_close($curl_handle);
			$type = strtoupper($type);
			if($httpcode < 200 || $httpcode >= 300) {
				throw new \Exception($jsonResponse);
			}

			return $jsonResponse;
	}

	public function getUsers() {
        $result = $this->getApi('GET', '/users', null);
		return json_decode($result);
	}

	public function getMeetings($userId) {
        $result = $this->getApi('GET', '/users/'.$userId.'/meetings', null);
		return json_decode($result);
	}

	public function getRecordings($meetingId) {
        $result = $this->getApi('GET', '/meetings/'.$meetingId.'/recordings', null);
		return json_decode($result);
	}

	public function getAllRecordings($userId) {
        $result = $this->getApi('GET', '/users/'.$userId.'/recordings', null);
		return json_decode($result);
	}

	public function getRemoveRecording($meetingId) {
        $result = $this->getApi('DELETE', '/meetings/'.$meetingId.'/recordings', null);
		return json_decode($result);
	}

	function getFilePathDownloaded($url, $fullpath) {
        try {
            // $fz = new FuncionesZoom;
            // $url .= "?access_token=" . $fz->getJWT();
            $url .= "?access_token=" . $this->getToken();

            $ch = curl_init();
            //Set the URL that you want to GET by using the CURLOPT_URL option.
            curl_setopt($ch, CURLOPT_URL, $url);
            //Set CURLOPT_RETURNTRANSFER so that the content is returned as a variable.
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            //Set CURLOPT_FOLLOWLOCATION to true to follow redirects.
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
            //$ckfile  = tempnam (__DIR__."/../logs", '$random');
            $ckfile  = __DIR__ . '/../logs/$ra8977.tmp';
    
            curl_setopt($ch, CURLOPT_HTTPHEADER, array("Cookie: cmb=" . $random));
            curl_setopt($ch, CURLOPT_COOKIEFILE, $ckfile);
            curl_setopt($ch, CURLOPT_VERBOSE, true);
            //Execute the request.
            // $data       = curl_exec($ch);
            file_put_contents($fullpath, curl_exec($ch));

            $httpcode   = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            //Close the cURL handle.
            curl_close($ch);
            //Print the data out onto the page.
            return $fullpath;
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }


	

	public function createMeeting($userId, $param) {
		return $this->curl->zoom($this->getToken(), 'POST', 'users/' . $userId . '/meetings', $param);
	}

	public function stateMeeting($meeting_id) {
		try{
			return $this->curl->zoom($this->getToken(), 'GET', "meetings/" . $meeting_id, null);
		} catch(Exception $e){
			$this->setException($e->getMessage());
			return $e->getMessage();
		}
	}

	public function endMeetingZoom($zoom_meeting_id) {
		return $this->curl->zoom($this->getToken(), 'PUT', "meetings/$zoom_meeting_id/status", ["action" => "end"]);
	}

	public function getUser($userId) {
        $result = $this->curl->zoom($this->getToken(), 'GET', "/users/$userId", null);
		return json_decode($result);
	}

	public function addUser($params = []) {
		$user = false;
		try {
			$params = is_array($params) ? $params : [];
			extract($params);
			$type 	= is_numeric($type) ? $type : 1;
			$action = @$action ? $action : 'custCreate';
            $request = array(
                'action' => $action,
                'user_info' => array(
                    'email' => $email,
				    'type' => $type,
				    'first_name' => $first_name,
				    'last_name' => $last_name
                )
            );

            $result = $this->curl->zoom($this->getToken(), 'POST', '/users', $request);

			$user = json_decode($result);			
		} catch (Exception $e) {			
			$this->setException($e->getMessage());
		}

		return $user;
	}

	public function addUserAdmin($params = []) {
		$rsp = FG::getDefaultResponse();
		try {
			$params = is_array($params) ? $params : [];
			extract($params);
			$type 	= is_numeric($type) ? $type : 1;
			$action = @$action ? $action : 'custCreate';
            $request = array(
                'action' => $action,
                'user_info' => array(
                    'email' => $email,
				    'type' => $type,
				    'first_name' => $first_name,
				    'last_name' => $last_name
                )
            );

            $result = $this->curl->zoom($this->getToken(), 'POST', '/users', $request);
			$user = json_decode($result);
			$rsp['success'] = true;
			$rsp['message'] = 'El usuario se creo correctamente en el servicio externo';
			$rsp['data'] = $user;
		} catch (Exception $e) {
			$rsp['message'] = $e->getMessage();
		}
		return $rsp;
	}

	public function addFreeUser() {
		$uid = time();

		return $this->addUser([
            "email" => "$uid@softdynamic.org",
            "type" => "1",
            "first_name"=> "$uid",
            "last_name"=> "FREE"
        ]);
	}

	public function addPayedUser() {
		$uid = time();

		return $this->addUser([
            "email" => "$uid@softdynamic.org",
            "type" => "2",
            "first_name"=> "$uid",
            "last_name"=> "PAYED"
        ]);
	}

	public function patchUser($params = []) {
		$updated = false;
		try {
			$params = is_array($params) ? $params : [];
			extract($params);
			$request = array(
                'type' => $type,
                'first_name' => $first_name,
                'last_name' => $last_name
            );            
            $result = $this->curl->zoom($this->getToken(), 'PATCH', "/users/$userId", $request);            
            return $result == 204;
		} catch (Exception $e) {
			$this->setException($e->getMessage());
		}

		return $updated;
	}

	public function deleteUser($params = []){
		$deleted = false;
		try {
			$params = is_array($params) ? $params : [];
			extract($params);
            $result = $this->curl->zoom($this->getToken(), 'DELETE', "/users/$userId", null);
            $deleted = $result == 204;
		} catch (Exception $e) {
			$this->setException($e->getMessage());
		}
		return $deleted;
	}

	public function checkMeeting($id) {
		$rsp = false;
		try {
			$rsp = $this->curl->zoom($this->getToken(), 'GET', "/meetings/$id", null);
			return json_decode($rsp);
		} catch (Exception $e) {
			$this->setException($e->getMessage());
		}
		return $rsp;
	}
	


	private function setException($e) {
		$message = "This service is not working correctly. Try again later.";
		$json 			= json_decode($e);
		
		if($json) {
			$message = $json->message;			
		}
		$this->strerrormessage = $message;
	}

	public function getMetricsMeetings($next_page_token = false) {
		$rsp = FG::getDefaultJSONResponse();
		try {
			$next_page_token = $next_page_token ? "?next_page_token=".$next_page_token : "";
			$rs = $this->curl->zoom($this->getToken(), 'GET', "/metrics/meetings".$next_page_token, null);
			$rsp->data = json_decode($rs);
			$rsp->success = true;
			$rsp->message = '';
		} catch (Exception $e) {
			$rsp->message = $e->getMessage();
		}
		return $rsp;
	}

	public function getException() {
		return $this->strerrormessage;
	}

	public function getInfoReportZoom($meeting_id ,$next_page_token = false) {
		$rsp = FG::getDefaultJSONResponse();
		try {
			//https://api.zoom.us/v2/report/meetings/{meetingId}/participants
			$next_page_token = $next_page_token ? "?next_page_token=".$next_page_token : "";
			$rs = $this->curl->zoom($this->getToken(), 'GET', "report/meetings/".$meeting_id."/participants".$next_page_token, null);

			//FG::debug( $rs);
			$rsp->data = json_decode($rs);
			$rsp->success = true;
			$rsp->message = '';
		} catch (Exception $e) {

			FG::debug( $e->getMessage());
			$rsp->message = $e->getMessage();
		}
		return $rsp;
	}
}