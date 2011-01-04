<?php

class testcomments extends UnitTestCase {
    private $link;
    
 
function testcommentMethods(){
echo('<h1>test comments</h1>');
 $request=request::getInstance();
 $request->deleteAllProperties();
 $request->setbyarray(array(
        'task' => 'ajaxfacade',
        'comment_parent_id' =>-1,
        'parent_id'=>1,
        'comment_id'=>-1,
        'content' =>"NEW MESSAGE" ,
        'option1' =>'savecomment'
    ));
    print_r($request->getallproperties());

    $r = new ajaxfacade();
$results =($r->debug_show_results());
    print_r($results);

    $c1 = new comment();
 $c1->title = 'c1';
 $c1->object_id = '1';
  $c->owner_id = 1;
 $c1->comment_parent_id = NULL; // its a thread header
 $c1response = $c1->save();
 $c1_id = $c1->id;
 $this->assertNotNull($c1_id,'c1 comment id is null?');
 $c2 = new comment();
 $c2->title = 'c2';
 $c2->object_id = '1';
 $c2->owner_id = 1;
 $c2->comment_parent_id = 2;
 
 echo('test comments 19');
  $c2->save();
  $c2_id = $c2->id;
  $this->assertNotNull($c2_id,'c2 comment id is null?');

// $c1participants = $c1->participant_list();
// echo('<br><b>participants</b><br>');
//
// print_r($c1participants);
//$this->assertTrue($c1participants[0] == 'alice surname');
echo('<hr>');
}
}
?>

                       