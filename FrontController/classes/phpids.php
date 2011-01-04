<?php
    /**
    *@desc wrapper for the phpids component that examines request for suspicious data being passed
    * @param : none
    * @return: none
    */
  class phpids{
   function __construct(){
   fb('php ids started');
   }

   function checkrequest(){
   fb('check request arguments started');
       try {


    $request = array(
        'REQUEST' => $_REQUEST,
        'GET' => $_GET,
        'POST' => $_POST,
        'COOKIE' => $_COOKIE
    );
    // example
   // $request["POST"] = '?test=%22><script>eval(window.name)</script>';
    $init = IDS_Init::init('config_phpids.php');
    // 2. Initiate the PHPIDS and fetch the results
    $ids = new IDS_Monitor($request, $init);
    $result = $ids->run();
    fb('security level :'.$result->getImpact(). ' / '.PHP_IDS_THRESHOLD);
    if($result->getImpact()>PHP_IDS_THRESHOLD ){
        // log error
        require_once("phpids/lib/IDS/Log/File.php");
        require_once("phpids/lib/IDS/Log/Composite.php");
        // drop(eval(javascript('1=1');//
        try{
        $compositeLog = new IDS_Log_Composite();
        $compositeLog->addLogger(IDS_Log_File::getInstance($init));
         $compositeLog->execute($result);
        } catch ( Exception $e){
            fb("CANT LOG INTRUSION ATTEMPT:".$e);
            return(null);
        }
        fb('That request triggered a security breach alert' ,FirePHP::WARN);
        //throw new ajaxfacadeException(AJAX_SECURITY_BREACH,"ERROR - possible hacking attempt..");
        //die('phpids1');
        }
} catch (Exception $e) {
    /*
    * sth went terribly wrong - maybe the
    * filter rules weren't found?
    */
    fb(
        'An error occured: %s',
        $e->getMessage()
    );
 //throw new ajaxfacadeException(AJAX_SECURITY_BREACH,"ERROR - possible hacking attempt..");
 //die('phpids2');
}
   }

  }

?>