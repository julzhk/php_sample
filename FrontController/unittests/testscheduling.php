<?php
class testschedule extends UnitTestCase {
function testscheduling1(){

   echo('<hr><h2>TESTSCHEDULING.PHP</h2>');
     $this->assertTrue( true );
   $request= request::getInstance();
   $request->deleteAllProperties();
   //* ONE task case.
echo('<h2> test scheduling starts</h2>');

define ('NOW',  time());
define ('ONEDAY', 24*60*60);// secs in a day
define ('ONEWEEK', 7*24*60*60);// secs in a week
define('TOMORROW',  NOW + ONEDAY);
echo('::16<br>');
// MAKE A BLOB
$request->setProperty('object_id','-1');
$request->setProperty('object_type','task');
$request->setProperty('object_name','Schedule task test 1');
$request->setProperty('content','na');
$request->setProperty('owner_id','1');
$request->setProperty('manager_id','2');
$request->setProperty('set_start',NOW);
$request->setProperty('set_finish',TOMORROW);
$request->setProperty("object_id",'2');
$request->setProperty('parent_id','1');
//$request->setProperty('prev_sibling_id','xx8');
$request->setProperty('task','ajaxfacade');
$request->setProperty('option1','saveblob');

$execute = new ajaxfacade();
echo('::33<br>');
$task1_ID = $execute->results();
echo('<pre>');
print_r($task1_ID);
echo('</pre>');
$blobtable = Doctrine::getTable('objectblob');
  $thisblob1= $blobtable->find($task1_ID) ;
echo('::40<br>'); return(true);
print_r($thisblob1->toArray());
// $this->assertTrue($thisblob->urgency_index() == 1, 'Urgency index of task 1 wrong should be 1, is : '.$thisblob->urgency_index());
// Now seed the schedule table
$request->deleteAllProperties();

   $request->setbyarray(array(
     'task' => 'ajaxfacade',
     'option1' => 'savetaskscrum',
     'parent_id' =>$task1_ID,
     'work_done' => '3600',
     'work_remain' => '36000',
     'work_done_desc' => 'work_done_desc2',
     'work_next_desc' => 'work_next_desc2',
     'login_id' => '1',
     'issue_desc' => 'issue_desc2'
    ));

  $s = new ajaxfacade();
  $s->results();
echo('<pre>');
print_r($s);
echo('</pre>');

 // next seed! - insert into schedule link table
$request->deleteAllProperties();
$request->setProperty("start_object_id",$task1_ID);
$request->setProperty("end_object_id",null);
$request->setProperty("target_date",TOMORROW);
$request->setProperty("projected_date",TOMORROW);
$request->setProperty("urgency_index",'1st');
$request->setProperty("relationship_type",'S->S');
$request->setProperty("root_id",'-1');
//$request->setProperty("schedulelinksid",'1');
// THIS CREATES LINK # 2
$sc = schedulelinks::insertlink();
echo('::76<br>');
// DATA SEEDED NOW !!
$request->deleteAllProperties();
  $request->setProperty('object_id',$task1_ID);
  $request->setProperty('option1','getblobddetailsummary');
 $execute = new ajaxfacade();
 $r = json_decode($execute->results());
//echo('<pre>');
// print_r(($r[0]));
//echo('</pre>');
$this->assertTrue($r[0]->urgency_index == 93.75, 'urgency error! '.$r->urgency_index);

// insert a second task object
$request->setProperty('object_id','-1');
$request->setProperty('object_type','task');
$request->setProperty('object_name','Schedule task test 2');
$request->setProperty('content','na');
$request->setProperty('owner_id','1');
$request->setProperty('manager_id','2');
$request->setProperty('set_start',NOW);
$request->setProperty('set_finish',NOW + ONEWEEK);
$request->setProperty('parent_id','1');
//$request->setProperty('prev_sibling_id','xx8');
$request->setProperty('task','ajaxfacade');
$request->setProperty('option1','saveblob');
fb('test sheduling line 94');
$execute = new ajaxfacade();
$task2_ID = $execute->results();

$blobtable = Doctrine::getTable('objectblob');
  $thisblob2= $blobtable->find($task2_ID) ;

  // link task 1 to task 2
$request->deleteAllProperties();
$request->setProperty("start_object_id",1);
$request->setProperty("end_object_id",$task2_ID);
$request->setProperty("target_date",TOMORROW);
$request->setProperty("projected_date",NOW + ONEWEEK);
$request->setProperty("urgency_index",'106');
$request->setProperty("relationship_type",'F->S');
$request->setProperty("schedulelinksid",'1');
$request->setProperty("object_id",'4');
$request->setProperty("root_id",'-1');
$thislinkid =  schedulelinks::insertlink(); // this creates link id = 3
fb('should create a root 112 :'.$thislinkid);

$linkarray = schedulelinks::getlink($thislinkid);
 $this->assertTrue($linkarray['start_object_id'] == '1',$linkarray['start_object_id']);
 $this->assertTrue($linkarray['end_object_id'] == '10' , $linkarray['end_object_id']);
$this->assertTrue($linkarray['urgency_index'] == '106' , $linkarray['urgency_index']);


 fb('<h2>Schedule links tests 121</h2>');
$request->deleteAllProperties();
$request->setProperty("object_id",1);
$request->setProperty("option1",'getschedulechain');
return(true);
$execute = new ajaxfacade();
//echo( $execute->results());

$sch = schedulelinks::findlinks(1); //
$this->assertTrue(count($sch) == 1 , 'count : '.count($sch) );
$this->assertTrue($sch[0] == 13, 'find chains returns :'.$sch[0] );

echo('133<pre>');
print_r( $sch);
echo('<hr>');
//print_r(Doctrine::getTable('schedulelinks')->findAll()->toArray()) ;
echo('</pre>');

echo('137 test adding a link to an existing chain (root_id <> -1)');

$request->deleteAllProperties();
$request->setProperty("target_date",TOMORROW);
$request->setProperty("projected_date",NOW + ONEWEEK);
$request->setProperty("urgency_index",'6');
$request->setProperty("relationship_type",'F->S');
$request->setProperty("schedulelinksid",'1');
$request->setProperty("start_object_id",'1');
$request->setProperty("end_object_id",null);
$request->setProperty("root_id",'-1');
  $sc_id = schedulelinks::insertlink();

  $sch = schedulelinks::findchains(1);
$this->assertTrue(count($sch) == 2 , 'count : '.count($sch) );
$this->assertTrue($sch[0] == 13, 'find chains returns :'.$sch[0] );
$this->assertTrue($sch[1] == 14, 'find chains returns :'.$sch[1] );

// now set the root id to link to a chain, so create a new schedule link , and link it up to the tree.
$request->deleteAllProperties();
//$request->setProperty("parent_id",1);
$request->setProperty("target_date",TOMORROW);
$request->setProperty("projected_date",NOW + ONEWEEK);
$request->setProperty("urgency_index",'163');
$request->setProperty("relationship_type",'163');
//$request->setProperty("schedulelinksid",'1');
$request->setProperty("start_object_id",'10');
$request->setProperty("end_object_id",'2');
$request->setProperty("root_id",'13');

 $thislinkid1 = schedulelinks::insertlink();
 $justinserted = schedulelinks::getlink($thislinkid) ;

// TEST
  $sch = schedulelinks::findchains(2);
//print_r($sch);
  $this->assertTrue(count($sch) == 2 , 'count : '.count($sch) );
$this->assertTrue($sch[0] == 13, 'find chains returns :'.$sch[0] );
$this->assertTrue($sch[1] == 13, 'find chains returns :'.$sch[1] );
 $justinserted = schedulelinks::getlink($thislinkid1) ;
//echo('<pre>');
 //   print_r($justinserted);
 // echo('</pre>');

 $this->assertTrue($justinserted['id'] == 15 ,$justinserted['id']); // THIS IS ID = 5 ! !!
 $this->assertTrue($justinserted['id'] == $thislinkid1 );
 $this->assertTrue($justinserted['start_object_id'] ==10,$justinserted['object_id'] );
 $this->assertTrue($justinserted['end_object_id'] ==2,$justinserted['object_id'] );
 $this->assertTrue($justinserted['urgency_index'] ==163 , $justinserted['urgency_index']);
 $this->assertTrue($justinserted['root_id'] ==15 , $justinserted['root_id'] );
 $this->assertTrue($justinserted['level'] ==1 , $justinserted['level']);
 $this->assertTrue($justinserted['lft'] =='x' ,$justinserted['lft'] );
 $this->assertTrue($justinserted['rgt'] =='x',$justinserted['rgt'] );

 // insert another - as a simple child of object-id = 2 ; id = 5
$request->deleteAllProperties();
$request->setProperty("target_date",TOMORROW);
$request->setProperty("projected_date",NOW + ONEWEEK);
$request->setProperty("urgency_index",'7');
$request->setProperty("relationship_type",'F->S');
$request->setProperty("start_object_id",'10');
$request->setProperty("end_object_id",'9');
$request->setProperty("root_id",'13');

  // inserts id = 6
$thislinkid2 = schedulelinks::insertlink();
 $justinserted = schedulelinks::getlink($thislinkid2) ;

 echo('<pre>');
   // print_r($justinserted);
     echo('</pre>');
// TEST
// test that the new insertion is ok..
 $this->assertTrue($justinserted['id'] == 16,$justinserted['id']);
 $this->assertTrue($justinserted['id'] == $thislinkid2 );
 $this->assertTrue($justinserted['start_object_id'] ==10 ,$justinserted['start_object_id'] );
 $this->assertTrue($justinserted['end_object_id'] ==9 );
 $this->assertTrue($justinserted['urgency_index'] ==7 );
 $this->assertTrue($justinserted['root_id'] ==16 ,$justinserted['root_id'] );
 $this->assertTrue($justinserted['level'] ==1,$justinserted['level'] );
 $this->assertTrue($justinserted['lft'] =='x' ,$justinserted['lft'] );
 $this->assertTrue($justinserted['rgt'] =='x' , $justinserted['rgt']);

 // now check the previous insert to see if it's still correct (cf levels)
 $justinserted1 = schedulelinks::getlink($thislinkid1) ;
echo('<pre>');
 //   print_r($justinserted1);
     echo('</pre>');

 $this->assertTrue($justinserted1['id'] == $thislinkid1 );
 $this->assertTrue($justinserted1['id'] == 15,$justinserted1['id'] ); // HARD CODED CHECK! ! !
 // START OBJECT IS DIFFERENT THAN ABOVE - COZ ITS AN INSERT!!!
 $this->assertTrue($justinserted1['start_object_id'] ==10 ,$justinserted1['start_object_id']  );
 $this->assertTrue($justinserted1['urgency_index'] ==163 );
 $this->assertTrue($justinserted1['root_id'] ==15 ,$justinserted1['root_id'] );
 $this->assertTrue($justinserted1['level'] ==1 );
 $this->assertTrue($justinserted1['lft'] =='x' ,$justinserted1['lft'] );
 $this->assertTrue($justinserted1['rgt'] =='x' ,'this has changed to make room for the new insert.'.$justinserted1['rgt']); // this is changed.


 // NOW parent_id is set to : 4, and root_id is 3 = hence it should insert between id = 3 and id=5
$request->deleteAllProperties();
$request->setProperty("start_object_id",'5');
$request->setProperty("end_object_id",'9');
$request->setProperty("root_id",'3');
$request->setProperty("target_date",TOMORROW);
$request->setProperty("projected_date",NOW + ONEWEEK);
$request->setProperty("urgency_index",'8');
$request->setProperty("relationship_type",'F->S');
   $thislinkid3 = schedulelinks::insertlink();
 $justinserted = schedulelinks::getlink($thislinkid3) ;

 echo('<pre>');
   // print_r($justinserted);
    echo('</pre>');
// test that the insert worked ok.
    $this->assertTrue($justinserted['id'] == $thislinkid3 );
    $this->assertTrue($justinserted['id'] == 17 , $justinserted['id'] );
 $this->assertTrue($justinserted['start_object_id'] ==5,'this id :'.$justinserted['object_id'] );
 $this->assertTrue($justinserted['urgency_index'] ==8 );
 $this->assertTrue($justinserted['root_id'] ==17 ,$justinserted['root_id']);
 $this->assertTrue($justinserted['level'] ==0 ,$justinserted['level']  );
 $this->assertTrue($justinserted['lft'] ==1 , $justinserted['lft']  );
 $this->assertTrue($justinserted['rgt'] ==2 , $justinserted['rgt'] );


 // now check the previous insert to see if it's still correct (1st)
 $justinserted = schedulelinks::getlink(5) ;
echo('<pre>');
  // print_r($justinserted);
    echo('</pre>');
 $this->assertTrue($justinserted['id'] == 5 , $justinserted['id'] );

 $this->assertTrue($justinserted['start_object_id'] ==9 );
 $this->assertTrue($justinserted['urgency_index'] ==163 );
 $this->assertTrue($justinserted['root_id'] ==3 );

 $this->assertTrue($justinserted['level'] ==2 );
 $this->assertTrue($justinserted['lft'] ==3 );
 $this->assertTrue($justinserted['rgt'] ==4 );


 // now check the previous insert to see if it's still correct (2nd)
 $justinserted1 = schedulelinks::getlink($thislinkid1) ;
   echo('<pre>');
     print_r($justinserted1);
    echo('</pre>');
 $this->assertTrue($justinserted1['id'] == $thislinkid1 );
 $this->assertTrue($justinserted1['id'] == 5 );
 $this->assertTrue($justinserted1['start_object_id'] ==9 );
 $this->assertTrue($justinserted1['urgency_index'] ==163 );
 $this->assertTrue($justinserted1['root_id'] ==3 );

 $this->assertTrue($justinserted1['level'] == 2);
 $this->assertTrue($justinserted1['lft'] ==3 );
 $this->assertTrue($justinserted1['rgt'] ==4 ,'this has changed to make room for the new insert.'); // this is changed.
// test to see if the chain returns properly:
$sch = schedulelinks::findchains(5);
$this->assertTrue(count($sch) == 1 , 'count : '.count($sch) );
$this->assertTrue($sch[0] == 3, 'find chains returns :'.$sch[0] );


$this->assertTrue( schedulelinks::getroot(1) == 1,schedulelinks::getroot(1)  );
$this->assertTrue( schedulelinks::getroot(2) == 2 ,schedulelinks::getroot(2) );
$this->assertTrue( schedulelinks::getroot(3) == 3 ,schedulelinks::getroot(3));
$this->assertTrue( schedulelinks::getroot(4) == 4 ,schedulelinks::getroot(3));

$request->deleteAllProperties();

$request->setProperty("start_object_id",'9');
$request->setProperty("root_id",'-1');
$request->setProperty("urgency_index",'311');

     $thislinkid4 = schedulelinks::insertlink();
  $justinserted = schedulelinks::getlink($thislinkid4) ;
$this->assertTrue( schedulelinks::getroot(7) == 7 ,schedulelinks::getroot(4));

}
}

?>