<?php
class testscrumsave extends UnitTestCase {
     function testdefaulttest(){
            $this->assertTrue( true );
 }
 function testscrum3(){
     $this->assertTrue(  true);
     echo('<h2>just testing scrum updates tests</h2>');
     
      $request=request::getInstance();
          $request->setbyarray(array(
     'task' => 'ajaxfacade',
     'option1' => 'savetaskscrum',
     'parent_id' => '1',
     'work_done' => '20',
     'work_remain' => 'work_remain',
     'work_done_desc' => 'work_done_desc',
     'work_next_desc' => 'work_next_desc',
     'login_id' => '1',
     'issue_desc' => 'issue_desc'
    ));

 $s = new ajaxfacade();
 $s->results();
/* * * * */
 $request->deleteAllProperties();
   $request->setbyarray(array(
            'task' => 'ajaxfacade',
           'option1' => 'statusactiveissues',
           'login_id' => '1',
           'object_id' => '1'
    ));

 $s = new ajaxfacade();
  $scrumresults = json_decode($s->results());
 echo('33<br>');
  print_r($scrumresults);
  $this->assertTrue( $scrumresults->data->work_done == 20, $scrumresults->data->work_done);
sleep(1); // got to nudge the next save to be a bit later, so the new update comes up as the 'most recent scrum'
 $request->deleteAllProperties();
   $request->setbyarray(array(
     'task' => 'ajaxfacade',
     'option1' => 'savetaskscrum',
     'parent_id' => '1',
     'work_done' => '99',
     'work_remain' => 'work_remain2',
     'work_done_desc' => 'work_done_desc2',
     'work_next_desc' => 'work_next_desc2',
     'login_id' => '1',
     'issue_desc' => 'issue_desc2'
    ));


  $s = new ajaxfacade();
  $s->results();
 $request->deleteAllProperties();

 echo('55<br>');

    $request->setbyarray(array(
            'task' => 'ajaxfacade',
            'option1' => 'statusactiveissues',
            'object_id' => '1'
    ));

 $s = new ajaxfacade();
 echo('64<br>');
 $scrumresults = json_decode($s->results());
//$this->assertTrue( $scrumresults[0]->work_done == 'work_done');
 echo('67<br>');
print_r($scrumresults);
$this->assertTrue( $scrumresults->data->work_done == '99', 'value is '.$scrumresults->data->work_done);
echo('<h2>scrum done!</h2>');

    }
}
?>