<?php

class cloudhosting{
   public $auth,$conn;
   function __construct(){       
        $this->auth = new CF_Authentication('julz',"FAKE_ID_be7f4097f65b42e786e1b5583bf3e");
        $isok  = $this->auth->authenticate();
        # Establish a connection to the storage system
        $this->conn = new CF_Connection($this->auth);
   }

    public function upload($fileSourcename, $newfilename){
        $save_path = WEB_ROOTPATH.'/uploads/' ;
       try{
           $folder =  $this->conn->create_container("toybox5");
       } catch (Exception $e) {
            return FALSE;
       }
        $cloudobject = $folder->create_object($newfilename);
        $size = filesize($save_path.$fileSourcename);
        
        $fp = fopen($save_path.$fileSourcename, "r");
        $returnval = $cloudobject->write($fp, $size, TRUE);
        if($returnval){
            unlink($save_path.$fileSourcename);
        }
        $uri = $folder->make_public();
        file_put_contents($save_path.$newfilename . '_uri.txt', $uri);
        return( $cloudobject->public_uri());
      }

    public static function download($privatefilename, $publicfilename){
        # Establish a connection to the storage system
        $my_docs = $this->conn->get_container("toybox5");
        $doc = $my_docs->get_object($privatefilename);
        return ($doc);
    }
     
   public  function sanitizename($name){
      return  (fileobject::sanitizename($name));
    }
}
?>