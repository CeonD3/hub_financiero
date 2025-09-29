<?php 
// https://github.com/numsu/google-drive-sdk-api-php-insert-file-parent-example/blob/master/formAction.php#L62

namespace App\Microservice;

use App\Utilitarian\FG;
use App\Model\Empresa;

class GoogleMS {

    protected $client;
    
    function __construct() {
        $client = new \Google_Client();
        $client->setApplicationName($_ENV['GOOGLE_APP_NAME']);
        $client->setClientId($_ENV['GOOGLE_CLIENT_ID']);
        $client->setClientSecret($_ENV['GOOGLE_CLIENT_SECRET']);
        // $client->setScopes(GOOGLE_SCOPES_API);
        $client->setScopes([
            'https://www.googleapis.com/auth/drive',
            'https://www.googleapis.com/auth/drive.appfolder',
            'email',
            'profile'
        ]);
        $client->setAccessType('offline');
        $client->setApprovalPrompt('force');
        $this->client = $client;
    }

    public function getBaseUrl() {
        return sprintf(
            "%s://%s",
            isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off' ? 'https' : 'http',
            $_SERVER['HTTP_HOST']
        );
    }

    public function createAuthUrl($request) {
        $rsp = FG::responseDefault();
        try {
            $param = $request->getParsedBody();
            $company_id = $param['company_id'];

            $company = Empresa::where('id', $company_id)->first();
            if (!$company) {
                throw new \Exception('No se encontró la empresa.');
            }

            $_SESSION['COMPANY_ID'] = $company->id;
            $domain = $this->getBaseUrl().'/google/signin';

            $this->client->setRedirectUri($domain);
            $url = $this->client->createAuthUrl();

            $rsp['success'] = true;
            $rsp['data'] = compact('url');
            $rsp['message'] = '';
        } catch (\Exception $e) {
            $rsp['message'] = $e->getMessage();
        }
        return $rsp;
    }

    public function signin($request) {
        $rsp = FG::responseDefault();
        try {

            $code = $_GET['code'];

            if (!$code) {
                throw new \Exception('No se encontró el parametro de code de google');
            }

            $company_id = is_numeric($_SESSION['COMPANY_ID']) ? $_SESSION['COMPANY_ID'] : null;
            if (!$company_id) {
                throw new \Exception('No se encontró la sesión de la empresa.');
            }

            $company = Empresa::where('id', $company_id)->first();
            if (!$company) {
                throw new \Exception('No se encontró la empresa.');
            }

            $domain = $this->getBaseUrl().'/google/signin';

            $this->client->setRedirectUri($domain);
            $token = $this->client->fetchAccessTokenWithAuthCode($code);
            $this->client->setAccessToken($token);
            
            $account = new \Google_Service_Oauth2($this->client);
            $user = $account->userinfo->get();

            $ntoken = $this->client->getAccessToken();

            $company->token_google = json_encode($ntoken);
            $company->email_google = $user->email;
            $company->save();
           
            $rsp['success'] = true;
            $rsp['data'] = compact('user');
            $rsp['message'] = 'La cuenta del usuario se vínculo correctamente';
        } catch (\Exception $e) {
            $rsp['message'] = $e->getMessage();
        }
        if ($rsp['success']) {
            header('Location: /admin/empresas/1'); exit();
        }
        return $rsp;
    }

    public function signout($request)
    {
        $rsp = FG::responseDefault();
        try {
            //extract($args);
            $param = $request->getParsedBody();
            $company_id = $param['company_id'];

            //$company_id = is_numeric($_SESSION['COMPANY_ID']);
            if (!$company_id) {
                throw new \Exception('No se encontró la empresa.');
            }

            $company = Empresa::where('id', $company_id)->first();
            $this->verifyToken($company->token_google);

            $unlinked = $this->client->revokeToken($this->client->getAccessToken());

            $company->token_google = null;
            $company->email_google = null;
            $company->save();

            $rsp['success'] = true;
            $rsp['message'] = 'Su cuenta se desvinculo corectamente';
        } catch (\Exception $e) {
            $rsp['message'] = $e->getMessage();
        }
        return $rsp;
    }

    public function aboutAccount() {
        $about = null;
        try {
            $api = new \Google_Service_Drive($this->client);
            $about = $api->about->get(["fields"=>"*"]);
        } catch (\Exception $e) {
            FG::debug($e->getMessage());
        }
        return $about;
    }

    public function verifyToken($token) {
        $domain = $this->getBaseUrl().'/google/signin';
        $this->client->setRedirectUri($domain);
        $token = json_decode($token, true); 
        $this->client->setAccessToken($token);
        if ($this->client->getAccessToken()) {
            if($this->client->isAccessTokenExpired()) {
                $refreshToken = $this->client->getRefreshToken();
                $this->client->refreshToken($refreshToken);
                $token = $this->client->getAccessToken();
                $this->client->setAccessToken($token);
            }
        }
        return $token;
    }

    public function getFolderExistsCreateId($folderId, $folderName, $folderDesc = NULL, $folderParentId = NULL) {
        // List all user files (and folders) at Drive root
        $service = new \Google_Service_Drive($this->client);
        $root    = !empty($folderParentId) ? $folderParentId : "root";
        $params  = array(
            "q" => "'{$root}' in parents and trashed=false",
            "fields" => "files(*), nextPageToken"
        );
        $files      = $service->files->listFiles($params);
        $found      = false;    
        $folderId   = null;
        // Go through each one to see if there is already a folder with the specified name
        foreach ($files['files'] as $item) {
            if (trim($item['id']) == trim($$folderId)) {
                $found = true;
                $folderId = $item['id'];
                break;
            }
        }
        // If not, create one
        if ($found == false) {
            $folder = new \Google_Service_Drive_DriveFile($this->client);
    
            //Setup the folder to create
            $folder->setName($folderName);
    
            if(!empty($folderParentId))
                $folder->setParents(array($folderParentId));

            if(!empty($folderDesc))
                $folder->setDescription($folderDesc);
    
            $folder->setMimeType('application/vnd.google-apps.folder');
            //Create the Folder
            try {
                $createdFile = $service->files->create($folder, array(
                    'mimeType' => 'application/vnd.google-apps.folder',
                ));
                // Return the created folder's id
                $folderId = $createdFile->id;
            } catch (\Exception $e) {
                FG::debug($e->getMessage());
            }
        }
        return $folderId;
    }

    public function getFolderExistsCreate($folderName, $folderDesc = NULL, $folderParentId = NULL) {
        // List all user files (and folders) at Drive root
        $service = new \Google_Service_Drive($this->client);
        $root    = !empty($folderParentId) ? $folderParentId : "root";
        $params  = array(
            "q" => "'{$root}' in parents and trashed=false",
            "fields" => "files(*), nextPageToken"
        );
        $files      = $service->files->listFiles($params);
        $found      = false;    
        $folderId   = null;
        // Go through each one to see if there is already a folder with the specified name
        foreach ($files['files'] as $item) {
            if (trim(strtolower($item['name'])) == trim(strtolower($folderName))) {
                $found = true;
                $folderId = $item['id'];
                break;
            }
        }
        // If not, create one
        if ($found == false) {
            $folder = new \Google_Service_Drive_DriveFile($this->client);
    
            //Setup the folder to create
            $folder->setName($folderName);
    
            if(!empty($folderParentId))
                $folder->setParents(array($folderParentId));

            if(!empty($folderDesc))
                $folder->setDescription($folderDesc);
    
            $folder->setMimeType('application/vnd.google-apps.folder');
            //Create the Folder
            try {
                $createdFile = $service->files->create($folder, array(
                    'mimeType' => 'application/vnd.google-apps.folder',
                ));
                // Return the created folder's id
                $folderId = $createdFile->id;
            } catch (\Exception $e) {
                FG::debug($e->getMessage());
            }
        }
        return $folderId;
    }

    public function insertFile($fileName, $fileDesciption, $mimeType, $filePath, $folderParentId) {
        $service     = new \Google_Service_Drive($this->client);
        $file        = new \Google_Service_Drive_DriveFile($this->client);
        $createdFile = null;
        // Set the metadata
        $file->setName($fileName);
        $file->setDescription($fileDesciption);
        $file->setMimeType($mimeType);
    
        // Setup the folder you want the file in, if it is wanted in a folder
        if(!empty($folderParentId))
            $file->setParents(array($folderParentId));
        
        try {
            // Get the contents of the file uploaded
            $data = file_get_contents($filePath);
    
            // Try to upload the file, you can add the parameters e.g. if you want to convert a .doc to editable google format, add 'convert' = 'true'
            $createdFile = $service->files->create($file, array(
                'data' => $data,
                'mimeType' => $mimeType,
                'uploadType'=> 'multipart'
            ));    
        } catch (Exception $e) {
            FG::debug($e->getMessage());
        }
        // Return a bunch of data including the link to the file we just uploaded
        return $createdFile;
    }

    public function getInfoFile($fileId) {
        $service = new \Google_Service_Drive($this->client);
        return $service->files->get($fileId, ['fields' => '*']);
    }
    
}