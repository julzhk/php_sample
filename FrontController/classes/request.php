<?php
  class request{
   private $properties = array();
   private static $instance;
   function __construct(){
        //it's a singleton, so it doesn construct normally.
   }

   public static function getInstance(){
      if ( empty(self::$instance) ) {
        //   fb('make a new request singleton');
        self::$instance = new request();
      }
      //    fb('invoke previous request singleton');
      //   fb(' request properties are:');
      //  fb(self::$instance->properties);
      return self::$instance;
  }

  function init(){
      // do phpids security check first
     // $phpids = new phpids();
     // $phpids->checkrequest();
      if($_SERVER["REQUEST_METHOD"]) {
       // $this->properties = array_merge($_REQUEST, $this->properties);
       $this->setbyarray($_REQUEST);
      return;
  }
  foreach($_SERVER['argv'] as $arg ){
        //   fb('arg is '.$arg);
        if( strpos ($arg, '=' )) {
           list($key, $val) = explode("=",$arg);
           $this->setProperty($key,$val);
       }
   }
  }
  function getProperty($key){
  // Has the 'key' been set in the associative array of this object? if so, return value, otherwise NULL
    if (array_key_exists($key,$this->properties)){
        return ( $this->properties[$key]);
    } else {
        return NULL;
    }
  }
  private static function clean($val){
    return($val);
       //return( htmlentities($val,ENT_QUOTES));
   // or use    mysql_real_escape_string() , strip_tags()
   }
   //* this is a short cut - used in unit tests
  function setbyarray($assoc_arraydata){
    foreach($assoc_arraydata as $thiskey => $thisdata){
        $this->setProperty($thiskey , $thisdata);
    }
  }

  function setProperty($key,$val){
      if(is_null($val)){
          $s = null;
      } else {
          $s = utilityclass::disable_magic_quotes($val);
      }
    $this->properties[$key] = $s;
  }

  function deleteAllProperties(){
    $this->properties = array();
  }

  function getallproperties(){
    return $this->properties;
  }

  function unsetProperty($property){
    unset($this->properties[$property]);
  }

  function keyExists($key){
    return(array_key_exists($key , $this->properties));
  }
  function is_empty(){
    $r = $this->properties;
    unset($r['XDEBUG_SESSION']);
    unset($r['XDEBUG_SESSION_START']);
    return(!(count($r)>0));
  }

}
                
?>