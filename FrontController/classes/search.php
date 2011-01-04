<?php
  class search{
   function __construct(){
   }
static public function searchForTerm($term) {
    // just blob title and content at the moment..
    $results = Doctrine::getTable('objectblob')->search("*$term*");
    $blobobjecttable = Doctrine::getTable('objectblob');
    foreach ($results as &$thisresult){
        $thisblob = $blobobjecttable->find($thisresult['object_id'])->toArray();
        $thisresult =  array_merge($thisresult , $thisblob);
     }
    return($results);
    }
  }

?>