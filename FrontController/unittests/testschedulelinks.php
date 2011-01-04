<?php

 class testschedulelinks extends UnitTestCase{
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
 function testdefaulttest(){
            $this->assertTrue( true );
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
   fb('##22 ');
 //  fb($newargs);
    foreach($newargs as $key=>$val){
                   // echo($key.' '.is_null($val).'<br>');
                }
   $request->setbyarray($newargs);
    $t= new ajaxfacade();
    $r = $t->execute();
 }
  static function savescrum($argarray){
     $request=request::getInstance();
     $request->deleteAllProperties();
     $defaultarray = array(
              'task' => 'ajaxfacade',
             'option1' => 'savetaskscrum',
             'work_remain'=>"10000",
             'parent_id' => 3,
             'work_next_desc' =>'stuff to do',
             'work_done' => '1000',
             'work_done_desc'=>'yes work was done'
    );

   $newargs =array_merge($defaultarray , $argarray);
   $request->setbyarray($newargs);
    $t= new ajaxfacade();
    $r = $t->execute();
 }
 static function savelink($argarray){
      $request=request::getInstance();
     $request->deleteAllProperties();
     fb(' test savelink #64');
     $defaultarray = array(
              'task' => 'ajaxfacade',
             'option1' => 'savelink',
              'start_object_id' =>3,
             'end_object_id'=>4,
             'relationship_type' =>'SS'
    );
   $newargs =array_merge($defaultarray , $argarray);
   $request->setbyarray($newargs);
    $t= new ajaxfacade();
    $r = $t->execute();

 }

  static function findlink($argarray=array()){
      fb('test find link #79');
      $request=request::getInstance();
     $request->deleteAllProperties();
     $defaultarray = array(
              'task' => 'ajaxfacade',
             'option1' => 'findlinks',
              'object_id' =>'4'
    );
   $newargs =array_merge($defaultarray , $argarray);
   $request->setbyarray($newargs);
      fb('test find link #89');
    $t= new ajaxfacade();
    $t->execute();
   $r=  $t->resultsarray();
    return($r);
 }

  static function dellink($argarray=array()){
      fb('test find link #79');
      $request=request::getInstance();
     $request->deleteAllProperties();
     $defaultarray = array(
              'task' => 'ajaxfacade',
             'option1' => 'dellink',
              'object_id' =>'3'
    );
   $newargs =array_merge($defaultarray , $argarray);
   $request->setbyarray($newargs);
      fb('test find link #89');
    $t= new ajaxfacade();
    $t->execute();
   $r=  $t->resultsarray();
    return($r);
 }



 function testsimplecase(){
   //	Console::logSpeed('Time taken to get to line '.__LINE__);
    $this->assertTrue( true );
    self::saveblob(array('object_name'=>"_badaboom","set_start"=>"2009-09-08"));
    self::saveblob(array('object_name'=>"no nine","set_start"=>null));
     //APPLY WORK TO OBJECT 3

     $blob3info1 =self::getblobarray(9);
     self::savescrum(array('object_id' =>9, 'work_remain'=>"10000",'parent_id' => 3));
     $blob3info2 =self::getblobarray(3);
     $compare1 = self::comparearrays($blob3info1,$blob3info2,"save scrum 10000");
     $this->assertTrue($compare1[work_total] == 1000,$compare1[work_total]);
     $this->assertTrue($compare1[work_remain] == 10000,$compare1[work_remain]);
     $now = time();
     $this->assertTrue($compare1['projected_start'] - $now < 10); // with 10 secs of now!
   //delta: 50399   $this->assertTrue($compare1['target_finish'] - $now < 10 , $compare1['target_finish'] - $now); // with 10 secs of now!
     $this->assertTrue($compare1['target_start'] - $now < 10); // with 10 secs of now!
     $this->assertTrue($compare1['target_finish'] == $compare1['projected_finish'] , $compare1['projected_finish'] - $compare1['target_finish']); // with 10 secs of now!

     self::saveblob(array('object_name'=>"son of _badaboom",'parent_id' => 3 ));
     $blob4info1 =self::getblobarray(4);
     self::savescrum(array('object_id' =>4,'work_remain'=>"30000",'parent_id' => 4));
     $blob4info2 =self::getblobarray(4);
     $compare2 = self::comparearrays($blob4info1,$blob4info2,"##work remain : 30000 applied to blob 4");
     $this->assertTrue($compare2['work_total'] == 1000,$compare2['work_total']);
     $this->assertTrue($compare2['work_remain'] == 30000,$compare2['work_remain']);
    $this->assertTrue($compare2['urgency_index'] == 80,$compare2['urgency_index']);
    $this->assertTrue($compare2['projected_finish'] - $compare2['projected_start'] < 1000 + 1240803296 - 1240652096);
    $this->assertTrue($compare2['target_finish'] - $compare2['target_start'] < 1000 + 1240803296 - 1240652096);

    // update blob 3
     self::saveblob(array('object_id' =>3,'set_start'=> time()+10000) );
     self::savescrum(array('object_id' =>3,'work_remain'=>"20000",'parent_id' => 3));
     self::savescrum(array('object_id' =>4,'work_remain'=>"40000", 'parent_id' => 4));
     // update blob 4
     self::saveblob(array('object_id' =>4, 'set_start'=> time()+20000) );
     self::savescrum(array('object_id' =>4,'work_remain'=>"40000", 'parent_id' => 4));
     $blob3info3 =self::getblobarray(3);
     $blob4info3 =self::getblobarray(4);
     self::comparearrays($blob3info1,$blob3info3,"##All changes to blob 3");
     self::comparearrays($blob4info1,$blob4info3,"##All changes to blob 4");
     // now make a grand child
     self::saveblob(array('object_name'=>"son of son of _badaboom",'parent_id' => 4 ));
   echo('####86');
   self::savescrum(array('object_id' =>5, 'work_remain'=>"10000",'parent_id' => 5));
     $blob5info1 =self::getblobarray(5);
  
   // update blob 3
   self::saveblob(array('object_id' =>3,'set_finish'=> time()+150000) );
   self::savescrum(array('object_id' =>3,'work_remain'=>"10000", 'parent_id' => 3));
   self::savescrum(array('object_id' =>4,'work_remain'=>"10000", 'parent_id' => 4));
   self::savescrum(array('object_id' =>5,'work_remain'=>"10000", 'parent_id' => 5));
   $s = self::savelink(array('start_object_id' =>3,'end_object_id'=>4,'relationship_type' =>'SS'));
   echo('##115 '. $s);
   self::savelink(array('start_object_id' =>3,'end_object_id'=>4,'relationship_type' =>'SS'));
   self::savelink(array('start_object_id' =>3,'end_object_id'=>4,'relationship_type' =>'FS'));
   self::savelink(array('start_object_id' =>4,'end_object_id'=>3,'relationship_type' =>'SF'));
   self::savelink(array('start_object_id' =>4,'end_object_id'=>3,'relationship_type' =>'FF'));
   self::savelink(array('start_object_id' =>4,'end_object_id'=>3,'relationship_type' =>'SS'));;
$s = schedulelinks::getnumberofschedulelinksbyblobid(3);
  $this->assertTrue($s == 3);
  $t = schedulelinks::getnumberofschedulelinksbyblobid(4);
  $this->assertTrue($t == 3);
 $t = self::findlink(array('object_id'=>4) );
 $this->assertTrue(1 == count($t->data),count($t->data));
 // do deleting
 $d = self::dellink(array("link_id"=>3));
  $t = schedulelinks::getnumberofschedulelinksbyblobid(4);
  $this->assertTrue($t == 2);

 $d = self::dellink(array("link_id"=>2));
  $t = schedulelinks::getnumberofschedulelinksbyblobid(4);
  $this->assertTrue($t == 1);

   $d = self::dellink(array("link_id"=>1));
  $t = schedulelinks::getnumberofschedulelinksbyblobid(4);
  $this->assertTrue($t == 0);

  self::saveblob(array('object_name'=>"Sibling1", 'parent_id'=>3,"set_start"=>null)); // ID 6
  self::saveblob(array('object_name'=>"Sibling2", 'parent_id'=>3,"set_start"=>null)); // ID 7
  self::saveblob(array('object_name'=>"Sibling3", 'parent_id'=>3,"set_start"=>null)); // ID 8
     //APPLY WORK TO OBJECT 3
  self::savelink(array('start_object_id' =>6,'end_object_id'=>7,'relationship_type' =>'SS'));
  self::savelink(array('start_object_id' =>7,'end_object_id'=>8,'relationship_type' =>'FS'));
  self::savelink(array('start_object_id' =>6,'end_object_id'=>8,'relationship_type' =>'FS'));

  self::savescrum(array('object_id' =>6,'work_remain'=>"10000", 'parent_id' => 6));
  self::savescrum(array('object_id' =>7,'work_remain'=>"10000", 'parent_id' => 7));
  self::savescrum(array('object_id' =>8,'work_remain'=>"20000", 'parent_id' => 8));

  self::savescrum(array('object_id' =>6,'work_remain'=>"10000", 'parent_id' => 6));
  self::savescrum(array('object_id' =>7,'work_remain'=>"10000", 'parent_id' => 7));

  self::savescrum(array('object_id' =>8,'work_remain'=>"1000", 'parent_id' => 8));
//FF
  self::saveblob(array('object_name'=>"Sibling4", 'parent_id'=>3,"set_start"=>null)); // ID 9
  self::savelink(array('start_object_id' =>9,'end_object_id'=>8,'relationship_type' =>'FF'));
  self::savescrum(array('object_id' =>9,'work_remain'=>"10000", 'parent_id' => 9));
// FF done
  self::savelink(array('start_object_id' =>4,'end_object_id'=>8,'relationship_type' =>'FS'));
 
 self::savescrum(array('work_remain'=>"10000", 'parent_id' => 4));
  self::savescrum(array('object_id' =>6,'work_remain'=>"20000", 'parent_id' => 6));
  self::savescrum(array('object_id' =>7,'work_remain'=>"20000", 'parent_id' => 7));
  

  }


  }
?>