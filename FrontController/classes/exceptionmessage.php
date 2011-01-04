<?php
  class exceptionmessage{
     public $error = array();
     var $errorlookup = array(
     0=>'There is a problem with the API. You are trying to access a function that doesn\'t exist',
     );

     function __construct($code,$message){
        $this->error = array('error'=>'error','code'=>$code, 'debugmessage'=>$message,'errormessage'=>$this->errorlookup[$code]);
     }
   function outputjsonerror(){
    fb($this->error['debugmessage'] ,FirePHP::WARN);
   echo abstractfacade::outputjson($this->error);
   }
  }

?>