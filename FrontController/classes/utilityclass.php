<?php
/** 
* @desc  static class holding housekeeping functions that don't belong anywhere else.
*/
           // turn a mysql datetime into a unix epochal timestamp.
  class utilityclass{
       // Doctrine/mysql returns a human readable date. Need to turn this into unix style date
     static function TimeStampToUnix($timestamp) {
      //  form assumed to be 2008-08-19 23:37:56
      if(is_null($timestamp)){
        return(null);
      }
      $dateTimearray = explode(' ',$timestamp); // date is index 0, time = 1
      $datearray = explode('-',$dateTimearray[0]); // year is index0, then MM then DD
      $timearray = explode(':',$dateTimearray[1]); // HR is index0, then MM then SS

        $year=$datearray[0];
        $month=$datearray[1];
        $day=$datearray[2];
        $hour=$timearray[0];
        $minute=$timearray[1];
        $second=$timearray[2];
        $newdate=mktime($hour,$minute,$second,$month,$day,$year);
        RETURN ($newdate);
        }
     static function UnixToTimeStamp($unixtime){
        $r = date('Y-m-d H:i:s',$unixtime); //returns //  form assumed to be 2008-08-19 23:37:56
        return($r);
     }
/**
*@desc this is the standard 'who's askin' method : ie what user id is stored in the cookie?
*/
public static function getcookie_id(){
    // simple switch to avoid cookie nonsense in unittesting.
    global $unittestinguser;
    if (!is_null($unittestinguser)){
        return($unittestinguser);
    }
    // normal user credentials obtained via the cookie
    $info = self::getcookie_info('user_id');
    return($info);
 }
public static function getcookie_info($key){
    //  fb('starting getcookie_info');
    $result = NULL;
    if(self::cookie_exists()){
        $request = request::getInstance();
        $cookievalue = $request->getProperty(USER_COOKIE);
        $userlogin_arr = Doctrine_Query::create()
            ->select()
            ->from('userlogintoken u')
            ->limit(1)
            ->where('login_token = ?', array($cookievalue))
            ->fetchArray();
        if(count($userlogin_arr)>0){
            $result = $userlogin_arr[0][$key];
        }
    }
    return ($result);
 }
static public function cookie_exists() {
      return(array_key_exists(USER_COOKIE,$_COOKIE));
}

static public function cookie_time() {
   $info = self::getcookie_info('updated_at');
   return($info);
 }

static public function handlecookie($task , $request){
    $result = FALSE;
    $cookieuser_id=utilityclass::getcookie_id();
    if($cookieuser_id){
        userlogintoken::setupdatetimenow($cookieuser_id);
        $result = TRUE;
    } else if(is_null($cookieuser_id)){
       $taskswithoutloginApproval = array('loginfacade');
       if(in_array( $task ,$taskswithoutloginApproval)){
            $result = TRUE;
        }
    }
    return ($result);
}
static public function mosso_transfer($fileSourcename , $filedestinationname){
    //header("Content-Type: txt");
    error_reporting(1);
    $c = new cloudhosting();
    $uri = $c->upload($fileSourcename, $filedestinationname);
    //echo('<a href = "'.$uri . '">click!</a>');
    return($uri);
}
/**
*@desc logout by deleting the user cookie
* @param none
* @return none
*/
static public function logout_cookie() {
     $request =request::getInstance();
     $request->setProperty(USER_COOKIE,null);
    setcookie(USER_COOKIE, null);
}


 /**
  * @desc a private method that actually does the mapping to an object of the data sent here by a js form
  * illegal fields are ignored (c.f: doctrine's merge, or map functions that are fussy..
  */
static function maprequest($thisobject){
$request= request::getInstance();
$formdata=$request->getallproperties();
    if($thisobject){
    // yes - update it
        $thisobjectarray = $thisobject->toArray();
        $fieldslist = array_keys($thisobjectarray);
        foreach($formdata as $formdatakey=>$formdatavalue){
            if(('object_id' == $formdatakey) OR ('id' == $formdatakey)){
            continue; // ignore the id: doctrine sets it automatically.
            }
       if (in_array($formdatakey,$fieldslist)){
          // echo($formdatakey.'->'.$formdatavalue.'<br>');
           $thisobject->{$formdatakey} = $formdatavalue;
       }
   }
   return $thisobject;

} else {
// no - we have an error!?
echo(FAILPROCESSING);
}
// return  codes (cf: constants for this class.
/*
 define(RECEIVEDANDPROCESSED,1);// THESE ARE THE RETURN CODES TO THE JS FRONT END.
           define(FAILPROCESSING,O);// THESE ARE THE RETURN CODES TO THE JS FRONT END.
           define(COMMENTFORMID,2);// THESE ARE THE RETURN CODES TO THE JS FRONT END.
 */
  }
      /** rename keys in data array : from, to, array name.**/
 static function renameArrayKey($fromkey,$tokey,&$thearray){
            // is just a simple array!
        $thearray["$tokey"] = $thearray["$fromkey"];
     return($thearray);
}

/**
 *Given a string, return the sha1 hash of it concatinated to the token salt.
 * @param <type> $hashed_data
 * @return <type> Token Hash
 */
static public function generatetoken($hashed_data) {
    fb('starting generatetoken');
    if(!isset($hashed_data) || is_null($hashed_data)){ $hashed_data = mt_rand(); }
    //fb($hashed_data);
        return( sha1(INVITE_TOKEN_SALT.$hashed_data) );
}
static public function checkToken($hash, $hashed_data){
    $result = FALSE;
    if($hash == self::generatetoken($hashed_data)){
        $result = (TRUE);
    }
    return ($result);
}
/**
 * gets yesterdays date as unix epoch
 * @return unix epoch integer
 * @param none
 */
static public function yesterdaysdateUnix() {
   $yesterday  =   time()-86400; //3600 seconds in an hour, 24 hours a day
    return($yesterday);
}
/**
 * gets yesterdays date as time stamp
 * @return string format : 2009-01-05 22:01:36
 * @param none
 */
static public function yesterdaysdate() {
    $yesterday  =   self::yesterdaysdateUnix();
    $oldercutoff = date('Y-m-d H:i:s',$yesterday); // format : 2009-01-05 22:01:36
    return($oldercutoff);
}
/**
*@desc generate the timestamp for the auto log out time. currently 10 mins ago
* $return a timestamp
*/
static public function autologoutifinactive() {
   $logouttime = time() - AUTO_LOGOUT_THRESHOLD ; //ten mins
     $oldercutoff = $logouttime; //self::UnixToTimeStamp($logouttime); // format : 2009-01-05 22:01:36
    // $oldercutoff = '2019-03-30 20:06:5';
 $deletetokens = Doctrine_Query::create()
                 ->delete()
                  ->from('userlogintoken u')
                  ->where('u.updated_at < ?', $oldercutoff)
                  ->execute();
   }
/**
*@desc called by the daily chron as a garbage collector.
*/
static public function deleteexpiredtokens(){
    //fb('deleteexpiredtokens: Delete expired tokens<br>');
    // delete any tokens that are more than a day old
    $oldercutoff = self::yesterdaysdateUnix(); //self::yesterdaysdate();  // format : 2009-01-05 22:01:36
    $deletetokens = Doctrine_Query::create()
                 ->delete()
                  ->from('userlogintoken u')
                  ->where('u.updated_at < ?', $oldercutoff)
                  ->execute();
    if($deletetokens){
    //    fb('deleteexpiredtokens : complete ok');
    } else {
              echo('deleteexpiredtokens : complete -but  nothing deleted');

    }
}
static public function escape($requeststring){
    return ($requeststring);
//     return( htmlentities($requeststring , ENT_QUOTES , SITE_CHAR_SET));
}
static public function generatepasswordhash($password){
   return(  md5(PASSWORD_SALT . $password) );
}

static public function disable_magic_quotes($string_data){
    if(get_magic_quotes_gpc()){
        $string_data = stripslashes($string_data);
    }
    return($string_data);
}
static public function associativeArraytoSimpleArray($assoc_array){
    $r= array();
    $arraylen = count($assoc_array);
    for ($i = 0; $i <= $arraylen-1; $i++) {
        $r[$i] =array_shift($assoc_array);
    }
//     $r=array(1,2,3,4);
//$r=array(0=>1,1=>2,2=>3,3=>4);
    return($r);
}

//simple cast as array for simple variables (not objects or anything fancy)
static public function cast_as_array($this_array){
    if(is_null($this_array)){
        return (array());
    }
    if(!is_array($this_array)){
        $this_array = array($this_array);
    }
    return($this_array);
}

static public function extractkeys($assoc_array){
       
       $n = 0;
       $results = array();
       $keys = array();
           foreach($assoc_array as $thiskey => $this_value){
               $keys[$thiskey] = $n++;
            //   $results[] = $this_value;
           }
           //return(array('keys' =>$keys, 'data'=>$results));
           return($keys);
       }

static public function extractdata($assoc_array){
    $results = array();
    if(is_array($assoc_array) ){
           foreach($assoc_array as $thiskey => $this_value){
               $results[] = $this_value;
           }
      }
    return($results);
    }

    public static function setCookie($value, $expires_time){
        if(!isset($expires_time) OR $expires_time==''){
            $expires_time = time()+COOKIE_EXPIRES_TIME;
        }
        return (setcookie(USER_COOKIE, $value, $expires_time));
    }
    public static function createMapDataArray($input_arr){
        $data_arr = array();
        $result_arr = array();
        $search_arr = array();
        if(count($input_arr)){
            foreach(array_keys($input_arr) as $thistype){
               if(count($input_arr[$thistype])){
                   $thisdataset=array();
                   foreach($input_arr[$thistype] as $thisdata){
                       $thisdataset['data'][] = self::extractdata($thisdata);
                       $thisdataset['map'] = self::extractkeys($input_arr[$thistype][0] );
                   }
                   $result_arr[] = '"'.$thistype.'":'.json_encode($thisdataset);
                   $data_arr[$thistype] = "";
                   $search_arr[] = '"'.$thistype.'":""';
               }
            }
            $temp_str = json_encode($data_arr);
            $output_arr = array('json'=>str_replace($search_arr,$result_arr, $temp_str));
        }
        return($output_arr);
    }
    /**
     *Given an array of arrays, get the value at the specified key for each array.
     * @param <array> $input_arr Array of Arrays
     * @param <string> $key_name name of value holder
     * @return <array> list of values
     */
    static public function reduceArrayToListByKey($input_arr, $key_name){
        $result_arr = array();
        foreach($input_arr as $thiskey => $thisitem){
            if(isset($thisitem[$key_name])){
                $result_arr[] = $thisitem[$key_name];
            }
        }
        return($result_arr);
    }
    
    static function writelog($message,$file='../uploads/thumblog.txt'){
        return(0);
        file_put_contents($file, $message.'
        ', FILE_APPEND | LOCK_EX);

    }
    /**
    *Do the file output for a given gzipped filename
    */
    public static function outputfile($publicfilename, $privatefilename, $is_file = NULL){
        //fb('starting outputfile('.$publicfilename.', '.$privatefilename.', '.$zipped.')');
        $upload_loc = WEB_ROOTPATH.FILE_UPLOAD_FOLDER.$privatefilename;
        //fb($upload_loc);
        //fb(filesize($upload_loc));
        if (file_exists($upload_loc) && filesize($upload_loc)){
            header ('Content-Description: File Transfer');
            header ('Content-Disposition: attachment; filename="'.rawurldecode($publicfilename).'"'); // basename($file));
             if($is_file){
                 header ('Content-Encoding: gzip');
                 header ('Content-Type: application/octet-stream');
             } else {
                 header ('Content-Type: image/jpeg');
             }
            header ('Expires: 0');
            header ('Cache-Control: must-revalidate, post-check=0, pre-check=0');
            header ('Pragma: public');
            header ('Content-Length: '.filesize($upload_loc));
            header ('Last-Modified: '.date('r'));
            readfile ($upload_loc);
            return (true);
        } 
       // fb ('file does not exist');
        return (false);
    }
    /**
     *Check to see if a particular thumbnail exists, create it if it doesn't, return false if it can not make it.
     * @param <string> $filename Name of the file on disk.
     * @param <int> $width size in pixels
     * @param <int> $height size in pixels
     * @return <string> The filename of the thumbnail on disk or FALSE if it is not thumbnailable.
     */
    public static function checkThumb($filename,$width= 50, $height= 50){
        fb("Getting File: ".$filename);
        $thumbname = $filename.'_thmb_'.$width.'_'.$height;
        $upload_loc = WEB_ROOTPATH.FILE_UPLOAD_FOLDER.$thumbname;
       // fb($upload_loc);
        if(!file_exists($upload_loc)){
            //fb ('requested thumbnail file does not exist, checking for original');
            $curr_loc = WEB_ROOTPATH.FILE_UPLOAD_FOLDER.$filename;
            if(file_exists($curr_loc)){
               // fb ('original file exists, generating thumbnail');
               // use '$width' as the prefix, so we know what dimension it is.
               //@TODO use height too.
               $thumbname = utilityclass::processThumbnail($filename,$width,$height);
               //@TODO - if the thumb isn't created then choose a default.
            } else {
                $thumbname = FALSE;
            }
        }
        return ($thumbname);
    }
    public static function createThumbnail($origin_name,$prefix=NULL,$thumbsize = 50){
        fb('image thumbnail started '.$origin_name);
        $thumb = new easyphpthumbnail();
        //fb('ez thumb nail instantiated');

        $thumb->Thumbsaveas='jpg';
        $thumb->Thumbsize  = $thumbsize;
        $thumb->Thumblocation = WEB_ROOTPATH.FILE_UPLOAD_FOLDER;
        $thumb->Clipcorner=array(2,15,0,1,1,1,1);
        $thumb->Thumbsuffix = '_'.$thumbsize.'_'.$thumbsize;
        $thumb->Thumbprefix= '';
        // DEFAULT SETTING: $thumb->Thumbprefix = 'thumbnail_';
       //fb('$thumb->Createthumb('.$origin_name .', file)');
        $thumb->Createthumb($origin_name , 'file');
       //fb("Createthumb Finished");
        if($thumb->invalidimage){
            //fb(" invalid image");
            return(FALSE);
        } else {
            //fb("valid image");
            return($thumb->image); // the thumbnail name
        }
    }

    //This starts the Thumbnail Methods
    static function processThumbnail($filename, $width, $height){
      	$gzipfile = WEB_ROOTPATH.FILE_UPLOAD_FOLDER.$filename;
        //fb('zip file name '.$gzipfile);
        $zippd = file_get_contents($gzipfile);
        if (!$zippd ){
            return (FALSE);
        }
        //fb('got zip contents');
        $d = self::gzdecode($zippd);
        //fb('zip decoded');
        $uncompressedfile = $gzipfile.'_thmb';
        $fok = file_put_contents($uncompressedfile ,$d) ;
        //fb('put unzipped contents saved ok? '.$fok);
        $thumbname = utilityclass::createThumbnail($uncompressedfile, $width, $width);
        $u = unlink($uncompressedfile);
        //fb('delete uncompressed file :'.$u);
        //fb($thumbname);
        return($thumbname);
    }

    static function gzdecode($data){
        fb('  gzdecode started');
        $g=tempnam(WEB_ROOTPATH.FILE_UPLOAD_FOLDER,'gz_');
        @file_put_contents($g,$data);
        ob_start();
        readgzfile($g);
        $d=ob_get_clean();
        $u = unlink($g);
        fb('  gzdecode done');
        return $d;
   }
   static function intruderDetectorSystem(){
      $path = '../classes/phpids/lib/';
      set_include_path(get_include_path() . PATH_SEPARATOR . $path);
        require_once 'IDS/Init.php';
      $request = array(
          'REQUEST' => $_REQUEST,
          'GET' => $_GET,
          'POST' => $_POST,
          'COOKIE' => $_COOKIE
      );
      // $request["POST"] = '?test=%22><script>eval(window.name)</script>';
      $init = IDS_Init::init('../classes/phpids/lib/IDS/Config/Config.ini' );
      $ids = new IDS_Monitor($request, $init);
      $result = $ids->run();

      if (!$result->isEmpty()) {
       // Take a look at the result object
       return ($result);
      }
      return(NULL);
   }
   static function missingvalues($args){
        $missingvalues = FALSE;
        if(!is_array($args)){
            // args is a single value
            $args = array($args);
        }
        foreach($args as $argkey=>$thisarg){
            if(is_null($thisarg)){
                fb("checked arguments, and $argkey is not set");
                $missingvalues = TRUE;
            }
        }
        //    fb('missing value is '.$missingvalues);
        return($missingvalues);
    }
    /**
     * Given two arrays and the name of the value that is to be compared, return the unmatched items in an array.
     * @param <array> $target_arr
     * @param <array> $source_arr
     * @param <string> $key_name
     * @return <array> 
     */
    public static function removeCommonArrayElements($target_arr, $source_arr, $key_name){
        $result_arr = $target_arr;
        if(count($source_arr)>0){
            $result_arr = array();
            foreach($target_arr as $target_item){
                $match = false;
                for($i=0, $len=count($source_arr); $i<$len; $i+=1){
                    if($source_arr[$i][$key_name]===$target_item[$key_name]){
                        $match = true;
                        $i=len;
                    }
                }
                if(!$match){
                    $result_arr[] = $target_item;
                }
            }
        }
        return ($result_arr);
    }
    /**
     * Given an array of arrays, look up the value of the given key for each, and return the first non-null value.
     * @param <array> $base_arr
     * @param <string> $key_name
     * @return <mixed> the value of the array or null
     */
    public static function getNextValueByArrayKey($base_arr, $key_name){
        foreach($base_arr as $this_arr){
            if(isset($this_arr[$key_name]) && !is_null($this_arr[$key_name])){
                return ($this_arr[$key_name]);
            }
        }
        return (null);
    }
}
?>