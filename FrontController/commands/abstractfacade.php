<?php

/**
 * @desc A abstract parent to the  CONTROLLERS.
 */
class ajaxfacadeException extends Exception
{

    function __construct($status, $message=null)
    {
        fb('ajax facade exception constructed');
        //  echo('ajax facade exception '.$status);
        header('Content-Type: application/json');
        echo( abstractfacade::createjsonstring($status, $message, null));
        // delete the user cookie from database and from cookie
        //  $cookieuser_id=utilityclass::getcookie_id();
        // These log out the user if theres an exception..bug #160 says remove this function
        //  userlogintoken::deleteuserlogintoken($cookieuser_id);
        //  utilityclass::logout_cookie();
    }
}

class jsonerror
{

    private $errorcode;

    function __construct($errorcode)
    {
        fb('error code set to ' . $errorcode);
        $this->errorcode = $errorcode;
    }

    function geterrorcode()
    {
        return ($this->errorcode);
    }
}

class abstractfacade
{

    public $output;
    public $error;
    private $token; // each facade call generates a unique token - this is used for not sending data if it's not changed
    public $request;

    function __construct($request = NULL)
    {
        if (is_null($request)) {
            $this->request = request::getInstance();
        } else {
            $this->request = $request;
        }
        $option1 = $this->request->getProperty("option1");
        if (!method_exists($this, $option1)) {
            //  header("HTTP/1.0 404 Not Found");
            fb('method unavailable');
            $this->output = $this->outputjson(AJAX_METHOD_DOESNT_EXIST);
        } else {
            $this->$option1();
        }
    }

    /** THESE ARE THE WAYS to GET OUTPUT : for testing:
     *   execute - sends to the front end for testing.
     *   results - which is for post-processing
     *   AND
     *   outputjson
     */
    /* echos the output buffer */
    function execute()
    {
        if (!defined('DONT_SET_JSON_HEADERS')) {
            header('Content-Type: application/json');
        }
        //   fb('abstract_facade->execute() started');
        if ($this->error) {
            echo($this->jsonerror($this->error));
        } else {
            fb('echo the output property');
            echo(($this->output));
        }
    }

    function jsonerror($jsonerror)
    {
        //   print_r($jsonerror);
        $outputarray = array();
        $status = $jsonerror->geterrorcode();
        // echo ('status is '.$status);
        return( self::createjsonstring($status, null, null));
    }

    /* returns the output buffer */

    function results()
    {
        return(stripslashes($this->output));
    }

    function resultsarray()
    {
        if (!isset($this->output)) {
            return(null);
        }
        if (is_array($this->output)) {
            return($this->results());
        } else {
            return( json_decode($this->results()));
        }
    }

    static function computetoken($dataarray)
    {
        //   echo('<pre>');
        //  print_r($dataarray);
        //   echo('</pre>');
        if (is_array($dataarray)) {
            //  echo('IT is an array..<br>');
            $tokenstring = mt_rand();
            //   echo("$tokenstring<br>");
        } else {
            $tokenstring = ($dataarray);
        }
        $tokenstring = $tokenstring . 'TOYBOXSALT4326';
        $tokenstring = md5($tokenstring);
        return($tokenstring);
    }

    function outputjson($dataarray = array(), $keys = NULL)
    {
        if (is_null($dataarray) or (count($dataarray) == 0)) {
            //  echo('null array');
            $status = AJAX_RETURN_NODATA;
            $this->error = new jsonerror(AJAX_RETURN_NODATA);
            $dataarray = array();
        }
        if (!is_array($dataarray)) {
            $dataarray = array($dataarray);
        }
        fb('outputjson - get the request object');
        $request = $this->request;
        fb('get token property');
        $token = $request->getProperty("token");
        $newToken = self::computetoken($dataarray);

        if (strlen($token) AND $token == $newToken) {
            $status = AJAX_RETURN_NOCHANGE;
        } else {
            $status = AJAX_RETURN_EVERYTHINGFINE;
        }
        $r = self::createjsonstring($status, $dataarray, $newToken, $keys);
        FB::groupEnd();
        return($r);
    }

    static function createjsonstring($status, $data_arr = null, $newToken = null, $map=null)
    {
        $output_arr = array();
        if (is_null($data_arr)) {
            $data_arr = array();
        }
        fb('ajax facade-createjsonstring started .. status is ' . $status);
        $output_arr['status'] = $status;
        $output_arr['token'] = null;
        switch ($status) {
            case(AJAX_RETURN_EVERYTHINGFINE):
                $output_arr['token'] = $newToken;
                break;
            case(AJAX_RETURN_NOCHANGE):
                fb('no change to data, return nothing');

                break;
            case(AJAX_RETURN_NODATA):
                fb('no data');
                break;
            case(AJAX_BAD_LOGIN_CREDENTIALS):
                fb('AJAX_BAD_LOGIN_CREDENTIALS');
                break;
            case(AJAX_DUPLICATE_ENTRY):
                fb('AJAX_DUPLICATE_ENTRY');
                break;
            default:
                $output_arr['status'] = AJAX_USER_RELOGIN_ERROR;
        }
        if (!is_null($map) && !is_null($data_arr['json'])) {
            $output_arr['mapped_data'] = '';
            $output_arr['del_flag'] = (isset($data_arr['del_flag'])) ? $data_arr['del_flag'] : false;
            $output_arr['t_c'] = time(); //time code
            $jsonstring = json_encode($output_arr);
            $search_arr = array('"mapped_data":""');
            $replace_arr = array('"mapped_data":' . $data_arr['json']);
            $jsonstring = str_replace($search_arr, $replace_arr, $jsonstring);
        } else {
            $output_arr['data'] = $data_arr;
            $jsonstring = json_encode($output_arr);
        }

        FB::groupEnd();
        return $jsonstring;
    }

    /** rename keys in data array : from, to, array name.* */
    static function renameArrayKey($fromkey, $tokey, &$thearray)
    {
        $r = utilityclass::renameArrayKey($fromkey, $tokey, $thearray);
        return($r);
    }

    static function removeNulls(&$dataarray)
    {
        foreach ($dataarray as &$thistask) {
            // if the db returns NULL swap out with ''
            foreach ($thistask as $thiskey => &$thisvalue) {
                if (is_null($thisvalue)) {
                    $thistask[$thiskey] = "";
                }
            }
        }
    }

    public function debug_show_results()
    {
        if (!DEVELOPMENT_ERROR_MESSAGES) {
            echo('Not allowed in live set up');
            return (null);
        }
        $r = json_decode($this->output);
        echo('<pre>');
        print_r($r);
        echo('</pre>');
        return($r);
    }

}

?>