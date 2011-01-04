<?php

 class testapprovals extends UnitTestCase{
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

    function testcreateapprovalroot(){
        echo('<h1>testsimplecreateapproval test</h1>');
        $this->assertTrue( true );
       $request=request::getInstance();
       $request->deleteAllProperties();
       $newargs = array('option1'=>'createapprovaltemplate',
                        'space_id'=>1,
                        'template_name'=>'approval_template_name',
                        'target_id' =>'-1',
                       );
       $request->setbyarray($newargs);
        $t= new adminfacade();
        $t->execute();
        $r = ($t->resultsarray());
     //   echo('33:<br><pre>');
     //   print_r($r);
    //    echo('33:<br></pre>');
    //    $this->assertTrue($r->data->id  == 1, 'Cant create a approvalchain root :');
       $this->assertTrue($r->data->template_name  == 'approval_template_name', 'Cant create a approvalchain root :');
    }

    function testNegativePermissions(){
   echo('testNegativePermissions started');
   return(1);
   $request=request::getInstance();
       $request->deleteAllProperties();
       $newargs = array('option1'=>'createapprovaltemplate',
                        'user_id'=>1,
                        'space_id'=>99,
                        'status'=>'approve',
                        'approval_template_name'=>'approval_template_name'
                   );

       $request->setbyarray($newargs);
       $t= new adminfacade();
        $t->execute();
         $r = json_decode($t->resultsarray());
   // //    echo('testNegativePermissions<hr>');
   //     print_r($r);
     $this->assertTrue($r->status == 0, 'Should fail with an error');
    }
     function testDeleteApprovalTemplateRoot(){
     echo('<br>testDeleteApprovalTemplate started<br>');
     $request=request::getInstance();
       $request->deleteAllProperties();
       $newargs = array('option1'=>'deleteapprovaltemplate',
                        'user_id'=>1,
                        'approval_template_id'=>1);

       $request->setbyarray($newargs);
       $t= new adminfacade();
        $t->execute();
        $r = json_decode($t->resultsarray());
     //   echo('<hr>');
     //   print_r($r);
        $this->assertTrue($r->status == 0, 'Should fail with an error');

    }
     function testCreateRootAgain(){
        echo('<br>testCreateRecordApprovalTemplate started<br>');
        $this->testcreateapprovalroot();
        $this->assertTrue(true);
     }
    function testCreateFirstApprovalTemplateNode(){

    echo('<br>testCreateRecordApprovalTemplate started<br>');

    $request=request::getInstance();
       $request->deleteAllProperties();
       $newargs = array('option1'=>'create_approvaltemplate_node',
                        'approval_template_id'=>'1',
                        'template_name'=>'node1 step1',
                         'user_id'=>'1',
                         'team_id'=>'1',
                         'space_id'=>'1',
                         'duration'=>'12',
                         'sibling_id'=>'2',
                         'target_id' =>'-1',
                         'template_id'=>'2',
                         'id'=>'-1'
 );

       $request->setbyarray($newargs);
       $t= new adminfacade();
         $t->execute();
         $r = ($t->resultsarray());
        echo('<hr>');
   //     print($r);
    //    $this->assertTrue($r ==TRUE , $r );
    }

    function testCreateSecondApprovalTemplateNode(){
         
    echo('<br>testCreateRecordApprovalTemplateAndInsertinTree started<br>');
    
    $request=request::getInstance();
       $request->deleteAllProperties();
       $newargs = array('option1'=>'create_approvaltemplate_node',
                        'target_id' =>'3',
                        'rel' =>'in',
                        'id' => '-1',
                         'template_name'=>'node3',
                         'user_id'=>'1',
                         'team_id'=>'1',
                         'duration'=>'12',
 );
 
       $request->setbyarray($newargs);
       $t= new adminfacade();
         $t->execute();
         $r = ($t->resultsarray());
    //    echo('<hr>');
    //    print_r($r);
     //   $this->assertTrue($r ,$r );
    }

 function testCreateThirdApprovalTemplateNodeUnderNewTarget_beforeCase(){

    echo('<br>testCreateThirdApprovalTemplateNodeUnderNewTarget started<br>');

    $request=request::getInstance();
       $request->deleteAllProperties();
       $newargs = array('option1'=>'create_approvaltemplate_node',
                        'target_id' =>'3',
                        'rel' =>'before',
                        'id' => '-1',
                         'template_name'=>'node4_with new target too',
                         'user_id'=>'1',
                         'team_id'=>'1',
                         'space_id'=>'1',
                         'duration'=>'12',
 );

       $request->setbyarray($newargs);
       $t= new adminfacade();
         $t->execute();
         $r = ($t->resultsarray());
        echo('<hr>');
    //    print_r($r);
      //  $this->assertTrue($r->data->id == 5,$r->data->id );
        $this->assertTrue($r->data->level == 0);
      //  $this->assertTrue($r->data->root_id == 2 , $r->data->root_id);

    }
function testCreateFourthApprovalTemplateNodeUnderNewTarget_AfterCase(){

    echo('<br>testCreateThirdApprovalTemplateNodeUnderNewTarget started<br>');

    $request=request::getInstance();
       $request->deleteAllProperties();
       $newargs = array('option1'=>'create_approvaltemplate_node',
                        'target_id' =>'3',
                        'rel' =>'after',
                        'id' => '-1',
                         'template_name'=>'node5_with new target too,after #3',
                         'user_id'=>'1',
                         'team_id'=>'1',
                         'space_id'=>'1',
                         'duration'=>'12',
 );

       $request->setbyarray($newargs);
       $t= new adminfacade();
         $t->execute();
         $r = ($t->resultsarray());
    //    echo('<hr>');
   // //    print_r($r);
      //  $this->assertTrue($r->data->id == 5 , $r->data->id);
        $this->assertTrue($r->data[0]->level == 0);
      //  $this->assertTrue($r->data->root_id == 2 , $r->data->root_id );
    }

    function testCreateFifthApprovalTemplateNodeFirstPosition(){

    echo('<br>testCreateThirdApprovalTemplateNodeUnderNewTarget started<br>');

    $request=request::getInstance();
       $request->deleteAllProperties();
       $newargs = array('option1'=>'create_approvaltemplate_node',
                        'target_id' =>'6',
                        'rel' =>'before',
                        'id' => '-1',
                         'template_name'=>'Should be at start #3',
                         'user_id'=>'1',
                         'team_id'=>'1',
                         'space_id'=>'1',
                         'duration'=>'12',
 );

       $request->setbyarray($newargs);
       $t= new adminfacade();
         $t->execute();
         $r = ($t->resultsarray());
   //     echo('<hr>');
   //     print_r($r);
      //  $this->assertTrue($r->data->id == 5 , $r->data->id );
        $this->assertTrue($r->data[0]->level == 0);
      //  $this->assertTrue($r->data->root_id == 2 , $r->data->root_id );
    }
 function testSix_DeleteApprovalTemplateTarget(){
     echo('<br>testDeleteApprovalTemplate started<br>');
     $request=request::getInstance();
       $request->deleteAllProperties();
       $newargs = array('option1'=>'deleteapprovaltemplate',
                        'user_id'=>1,
                        'approval_template_id'=>10);

       $request->setbyarray($newargs);
       $t= new adminfacade();
        $t->execute();
        $r = ($t->resultsarray());
        echo('<hr>');
   //     print_r($r);
        $this->assertTrue($r->status == 0, 'Should fail with an error');

    }
     function testSeven_MoveApprovalTemplateNODEBeforeTarget(){
     echo('<br>testDeleteApprovalTemplate started<br>');
     $request=request::getInstance();
       $request->deleteAllProperties();
       $newargs = array('option1'=>'moveapprovaltemplate',
                        'rel'=>'before',
                        'sibling_id'=>4,
                        'id'=>9
                        );

       $request->setbyarray($newargs);
       $t= new adminfacade();
        $t->execute();

    }
    function test8_MoveSiblingNodesWithSameParent(){
     echo('<br>testDeleteApprovalTemplate started<br>');
     $request=request::getInstance();
       $request->deleteAllProperties();
       $newargs = array('option1'=>'moveapprovaltemplate',
                        'rel'=>'before',
                        'sibling_id'=>9,
                        'id'=>4
                        );

       $request->setbyarray($newargs);
       $t= new adminfacade();
        $t->execute();
    }
        function test9_Move_childLevel2_to_level_1(){
     echo('<br>testDeleteApprovalTemplate started<br>');
     $request=request::getInstance();
       $request->deleteAllProperties();
       $newargs = array('option1'=>'moveapprovaltemplate',
                        'rel'=>'before',
                        'sibling_id'=>6,
                        'id'=>5
                        );

       $request->setbyarray($newargs);
       $t= new adminfacade();
        $t->execute();
    }
function test10_Move_STEPlevel1_to_level_2_And_DeleteEMPTYPARENT(){
     echo('<br>testDeleteApprovalTemplate started<br>');
     $request=request::getInstance();
       $request->deleteAllProperties();
       $newargs = array('option1'=>'moveapprovaltemplate',
                        'rel'=>'before',
                        'sibling_id'=>6,
                        'id'=>12
                        );

       $request->setbyarray($newargs);
       $t= new adminfacade();
        $t->execute();
    }
    function test11_Move_into_Self(){
     echo('<br>testDeleteApprovalTemplate started<br>');
     $request=request::getInstance();
       $request->deleteAllProperties();
       $newargs = array('option1'=>'moveapprovaltemplate',
                        'rel'=>'before',
                        'sibling_id'=>12,
                        'id'=>5
                        );

       $request->setbyarray($newargs);
       $t= new adminfacade();
        $t->execute();
    }
 function test12_Move_STEPlevel2_to_level_1_And_DeleteEMPTYPARENT(){
     echo('<br>testDeleteApprovalTemplate started<br>');
     $request=request::getInstance();
       $request->deleteAllProperties();
       $newargs = array('option1'=>'moveapprovaltemplate',
                        'rel'=>'after',
                        'sibling_id'=>3,
                        'id'=>5
                        );

       $request->setbyarray($newargs);
       $t= new adminfacade();
        $t->execute();
    }
     function test13_Edit(){
     echo('<br>testDeleteApprovalTemplate started<br>');
     $request=request::getInstance();
       $request->deleteAllProperties();
       $newargs = array('option1'=>'updateapprovaltemplate',
                        'template_name'=>'new name',
                        'type'=>'new type',
                        'space_id'=>'1',
                        'id' =>'9'
                        );

       $request->setbyarray($newargs);
       $t= new adminfacade();
        $t->execute();
        $r =($t->resultsarray());
        echo('<hr>');
  //      print_r($r);
        $this->assertTrue($r->status == 0, 'Should work ok');
        $this->assertTrue($r->data[0]->id == 2, $r->data[0]->id . ' :Should work ok');
        $this->assertTrue($r->data[0]->template_name == 'approval_template_name', $r->data[0]->template_name .' Should work ok');

    }


    function test14_assign_approvaltemplate_to_blob(){
     echo('<br>testDeleteApprovalTemplate started<br>');
     $request=request::getInstance();
       $request->deleteAllProperties();
       $newargs = array('option1'=>'create_link_approvaltemplate_to_object',
                        'blob_id'=>'2',
                        'approval_chain_template_id'=>'2'
                        );

       $request->setbyarray($newargs);
       $t= new adminfacade();
        $t->execute();
        $r =($t->resultsarray());
        echo('<hr>');
     //   print_r($r);
        $this->assertTrue($r->status == 0, 'Should work ok');
   
    }

       function test15_delete_approvaltemplate_to_blob(){
     echo('<br>testDeleteApprovalTemplate started<br>');
     $request=request::getInstance();
       $request->deleteAllProperties();
       $newargs = array('option1'=>'delete_link_approvaltemplate_to_object',
                        'blob_id'=>'2',
                        'approval_chain_template_id'=>'2'
                        );

       $request->setbyarray($newargs);
       $t= new adminfacade();
        $t->execute();
        $r =($t->resultsarray());
        echo('<hr>');
    //    print_r($r);
        $this->assertTrue($r->status == 0, 'Should work ok');
    }
        function test16_initialize_template_on_blob(){
            $approvalchain_data = approvalchain::initialize_chain(1,2);
            $approvalchain_data = approvalchain::approval_received('8','approved');
            $approvalchain_data = approvalchain::approval_received('7','approved');
             $approvalchain_data = approvalchain::approval_received('5','not approved');
        }
 }
    
?>