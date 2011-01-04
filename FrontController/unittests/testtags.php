<?php

class Testtags extends UnitTestCase {
     
 
function testtagscreate(){
echo('<h1>test tags</h1>');
  $this->assertTrue( true );


    echo('ajax ttest');
 
    echo('ajax data set<br>');
  $request=request::getInstance();
     $request->setbyarray(array(
     'task' => 'ajaxfacade',
     'option1' => 'savetag',
     'tag_name' =>'testing tag',
     'object_id' =>'1',
     'tag_value' =>'value: testing tag'
    ));

  $t= new ajaxfacade();
  $t->execute();
  $x = $t->resultsarray();
   echo('<pre>');
print_r($x->data);
$y= $x->data;
print_r($y->id );
$this->assertTrue($y->id == 1 ,$y->id);
$this->assertTrue($y->tag_name == 'testing tag');
$this->assertTrue($y->object_id == 1);

   echo('</pre>');
 
$request->setbyarray(array(
     'task' => 'ajaxfacade',
     'option1' => 'deletetagsbyTagId',
     'tag_id' =>$y->id
    ));

    $t= new ajaxfacade();
      $t->execute();
        $t->debug_show_results();
        $x = $t->resultsarray();
       
$y= $x->data;
 print_r($y[0]);
 $this->assertTrue($y[0] == 1); // ie it's been deleted.
    echo('<hr>');
  
    } 
}
?>