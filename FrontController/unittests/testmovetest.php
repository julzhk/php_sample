<?php

 class testmovetest extends UnitTestCase{
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
             'task' => 'adminfacade',
             'option1' => 'reorderblobtree',
             'owner_id' =>1,
             'object_id' => -1,
             'new_parent_id' => 1,
             'sibling_id' =>null,
    );
   $newargs =array_merge($defaultarray , $argarray);
   $request->setbyarray($newargs);
    $t= new adminfacade();
    $t->execute();
    $r = $t->resultsarray();
    return($r);
    }
 function testsimplemove(){
     echo('<h1>move test</h1>');
    $this->assertTrue( true );
    self::saveblob(array('object_name'=>'blob1','parent_id' => 1 )); //id =3
    self::saveblob(array('object_name'=>'blob2','parent_id' => 1 )); // id 4
    self::saveblob(array('object_name'=>'blob3','parent_id' => 1 )); // id 5
     self::saveblob(array('object_name'=>'blob4','parent_id' => 1 )); // id 6
   echo('<hr>');
   $s1 = self::getblobarray(3);
    // THIS MOVES THE BLOB 3 to be a child of 4.
   $json_post_data_array = json_encode(array(array("object_id"=>3,"parent_id"=>4)));
    self::moveblob(array("json_post_data"=>"$json_post_data_array", "object_id"=>'3','new_parent_id'=>'4'));
    $s2 = self::getblobarray(3);
    $diff1 = self::comparearrays($s1,$s2,'simple move');
    echo('<pre>');
   // print_r($diff1);
    $this->assertTrue($diff1['lft'] == '3','left for blob 3 is wrong -  is '.$diff1['lft'] );
    $this->assertTrue($diff1['rgt'] == '4','rgt for blob 3 is wrong -  is '.$diff1['rgt'] );
    $this->assertTrue($diff1['level'] == '2','level for blob 3 is wrong -  is '.$diff1['level'] );
 echo('</pre>');
    // THIS MOVES THE BLOB 3 to just before blob 6.
    $json_post_data_array = json_encode(array(array("object_id"=>3,"sibling_id"=>6)));
   self::moveblob(array("json_post_data"=>"$json_post_data_array","object_id"=>'3','new_parent_id'=>'1','sibling_id'=>'6'));
    $s3 = self::getblobarray(3);
    // echo('s3');
   // print_r($s3);
   $diff2 = self::comparearrays($s2,$s3,'sibling move');
  // print_r($diff2);
     $this->assertTrue($diff2['lft'] == '6','left for blob 3 is wrong -  is '.$diff1['lft'] );
    $this->assertTrue($diff2['rgt'] == '7','rgt for blob 3 is wrong -  is '.$diff1['rgt'] );
    $this->assertTrue($diff2['level'] == '1','level for blob 3 is wrong -  is '.$diff1['level'] );
    // ATTEMPT TO PUT INTO A DIFFERENT TREE - should fail. gracefully
   $json_post_data_array = json_encode(array(array("object_id"=>3,"parent_id"=>2)));
  //  $s4 = self::moveblob(array("json_post_data_array"=>"$json_post_data_array","object_id"=>'3','new_parent_id'=>'2'));
  //  $this->assertTrue($s4->status == 0);
  //  $this->assertTrue($s4->data[0] == 0);
    // CREATE A BUNCH OF CHILDREN
    self::saveblob(array('object_name'=>'blob5','parent_id' => 3 )); //id =3
    self::saveblob(array('object_name'=>'blob6','parent_id' => 3 )); // id 4
    self::saveblob(array('object_name'=>'blob7','parent_id' => 3 )); // id 5
    self::saveblob(array('object_name'=>'blob8','parent_id' => 3 )); // id 6

    self::saveblob(array('object_name'=>'blob9','parent_id' => 8 )); //id =7
    self::saveblob(array('object_name'=>'blob10','parent_id' => 8 )); // id 8
    self::saveblob(array('object_name'=>'blob11','parent_id' => 8 )); // id 9
    self::saveblob(array('object_name'=>'blob12','parent_id' => 8 )); // id 10

     

    return(true);
    $s6 = self::getblobarray(13);
    $json_post_data_array = json_encode(array(array("object_id"=>3,"parent_id"=>2)));

    self::moveblob(array("json_post_data_array"=>"$json_post_data_array","object_id"=>'13','new_parent_id'=>'7'));
    $s7 = self::getblobarray(13);
    $diff4 = self::comparearrays($s6,$s7,'big tree move 2');

    $this->assertTrue($diff4['lft'] == '10','left for blob 3 is wrong -  is '.$diff4['lft'] );
    $this->assertTrue($diff4['rgt'] == '11','rgt for blob 3 is wrong -  is '.$diff4['rgt'] );
      
    self::moveblob(array("object_id"=>'12','new_parent_id'=>'3','sibling_id'=>'9'));
    self::moveblob(array("object_id"=>'3','new_parent_id'=>'4'));
    // TEST INCORRECT ARGUMENTS
    $ret = self::moveblob(array("object_id"=>'3','new_parent_id'=>'140')); // blob id 140 doesnt exist
    $this->assertTrue(is_null($ret),'move was illegal should return NULL');
       $ret = self::moveblob(array("object_id"=>'3','new_parent_id'=>'14','sibling_id'=>'9'));
    $this->assertTrue(is_null($ret),'move was illegal sibling wrong ');
  }


  }
?>