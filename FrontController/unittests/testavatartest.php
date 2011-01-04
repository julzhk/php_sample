<?php

 class testavatartest extends UnitTestCase{
  static function getblobarray($id){
      $blobTable = Doctrine::getTable('objectblob');
      $blobArray= $blobTable->find($id);
      return($blobArray->toArray());
 }
 static function comparearrays($fromarray, $toarray, $message = 'compared!'){
    $D = array_diff_assoc($toarray, $fromarray);
    fb('##'.$message."<pre>");
    fb($D);
    fb("</pre>");
    return($D);
}
 static function saveblob($argarray){
     $request=request::getInstance();
     $request->deleteAllProperties();
     $defaultarray = array(
             'task' => 'ajaxfacade',
             'option1' => 'saveblob',
             'owner_id' =>1,
             'object_name'=>$object_name,
              'creator_id' =>1,
             'object_id' => -1,
             'parent_id' => 1,
             'projected_start' =>null,
             'target_start' => null,
             'target_finish' => null
    );
   $newargs =array_merge($defaultarray , $argarray);
 //  fb('##22 ');
 //  fb($newargs);
    foreach($newargs as $key=>$val){
 //                   echo($key.' '.is_null($val).'<br>');
                }
   $request->setbyarray($newargs);
    $t= new ajaxfacade();
    $r = $t->execute();
 }
 static function moveblob($argarray){  $request=request::getInstance();
     $request->deleteAllProperties();
     $defaultarray = array(
             'task' => 'ajaxfacade',
             'option1' => 'reorderblobtree',
             'owner_id' =>1,
             'object_id' => -1,
             'new_parent_id' => 1,
             'sibling_id' =>null
    );
   $newargs =array_merge($defaultarray , $argarray);
   $request->setbyarray($newargs);
    $t= new ajaxfacade();
    $t->execute();
    $r = $t->resultsarray();
    return($r);
    }
 function testavatartest(){
     echo('<h1>testavatartest test</h1>');

 //   $this->assertTrue( true );
  $request=request::getInstance();
     $request->deleteAllProperties();


     $avatararray = array(
             'task' => 'ajaxfacade',
             'option1' => 'uploadavatar',
             'title' => 'the title',
             'description' => 'desc',
             'submission_status' =>'submission',
             'object_blob_id' =>2,
            'fileid'=>-1
        ); //fileid'=>-1 means new file
  $_FILES['preview_file'] ='/Users/julian/Desktop/logo.png';
  $_FILES['main_file'] ='/Users/julian/Desktop/logo.png';
$_FILES["main_file"]["name"] = 'logo.png';
$_FILES["preview_file"]["name"] = 'logo.png';
$_FILES["main_file"]["size"] = '9999';
$_FILES["preview_file"]["size"] = '9999';
   $request->setbyarray($avatararray );
    $t= new ajaxfacade();
    $t->execute();
    $r = $t->resultsarray();

    }


  }
?>