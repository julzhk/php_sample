<?php
  // used in AllTests.php Suite.

class testToybox extends UnitTestCase {


function testtaskmanipulate(){
     $request= request::getInstance();
  //- - - - - - -//
echo('<h1>testtasks.php</h1>');
     // create a blob  P1
     // give it parent id =1
     //  set type = 'project'  level = 2
$cookieuser_id = utilityclass::getcookie_id();
echo('this cookie user is '.$cookieuser_id);
echo('this cookie is '.utilityclass::getcookie_id());


     $request->setProperty('object_id','-1');
$request->setProperty('object_name','P1');
$request->setProperty('content','P1');
  $request->setProperty('parent_id',1);// join the new parent!
echo('tt19..');
$request->setProperty('option1','saveblob')  ; echo('tt20..');
 $request->setProperty('owner_id','1')  ; echo('tt21..');
 $request->setProperty('object_type','task')  ;echo('tt22..');
 $request->setProperty('work_remain','1')  ; // new - needed for 'tasks'
 $execute = new ajaxfacade(); echo('tt23..');
 $thisblobdata =  $execute->results() ;
 $thisblobid = 3; // the new id..
echo('tt25<br>$thisblobid is '.$thisblobid.'<br><pre>');
   $jsondump = $execute->results();
   $returnarray = json_decode($jsondump,true);
   print_r($returnarray);
   echo('</pre><br>');
// $this->assertTrue($returnarray['data'][0]['object_id'] == '3','<b>Root didnt set properly 31</b>');   // it's a root !
 return('done - the rest is all root setting');
 $request->deleteAllProperties();

 $request->setProperty('option1','getblobddetailsummary')  ;
 $request->setProperty('object_id',$thisblobid)  ; echo('tt29<br>');
 $execute = new adminfacade(); echo('tt30<br>');
 echo('results '. $execute->results().'<pre>');
  $jsondump = $execute->results();
   $returnarray = json_decode($jsondump,true);

   print_r($returnarray);
   echo('</pre>');
 $this->assertTrue($returnarray['data']['level'] == '1','<b>Root didnt set properly 31</b>');   // it's a root !
  $this->assertTrue($returnarray['data']['owner_id'] == '1','owner didnt set properly 34');
  $this->assertTrue($returnarray['status'] == '0');
    // now add tasks..

     // name = C1
      // create a blob, parent id = project above
      // type = 'task
 $request->deleteAllProperties();
    $request->setProperty('object_id','-1');
$request->setProperty('object_name','C1');
$request->setProperty('content','C1');
  $request->setProperty('parent_id',$thisblobid);
 $request->setProperty('object_type','task')  ;
 $request->setProperty('owner_id','1')  ;
 $request->setProperty('option1','saveblob')  ; // same as saveblob currnetly
  $request->setProperty('work_remain','1')  ; // new - needed for 'tasks'
 $execute = new ajaxfacade();
 $e = $execute->results();
 $returnarray = json_decode($e,true);
 echo('<pre>');
 print_r($returnarray);
 echo('</pre>');
 $this->assertTrue($returnarray['data'][1]['object_id'] == $thisblobid + 1,'<b>Root didnt set properly id should be</b>'. $thisblobid + 1); // returns the new blob id.
 //test (should be a child level = 1 bigger than parent. (2)
    $request->setProperty('option1','getblobddetailsummary')  ;
 $request->setProperty('object_id',$thisblobid + 1 )  ;
 $execute = new adminfacade();
 //echo($execute->results().'<pre>');
  $jsondump = $execute->results();
   $returnarray = json_decode($jsondump,true);
 echo('74<pre>');
  print_r($returnarray);
  echo('</pre>');
  $this->assertTrue($returnarray['data']['level'] == '2','<b>level not 1 55</b>');
  $this->assertTrue($returnarray['data']['object_name'] == 'C1','<b>object name not set 56</b>');
   $this->assertTrue($returnarray['data']['owner_id'] == '1','<b>owner name not correct 61</b>');
   $this->assertTrue($returnarray['status'] == '0','<b>status: not correct 61</b>');


      //- - - - - - -//

      // create a blob
      // name = C2

      // add it as a branch..
      // set type = 'task'
      // parent = parent above  P1
      // this should make it a sibling level same as above (3)

       $request->deleteAllProperties();
       $request->setProperty('object_id','-1');
$request->setProperty('object_name','C2');
$request->setProperty('content','C2');
  $request->setProperty('parent_id',$thisblobid);
 $request->setProperty('owner_id','1')  ;
 $request->setProperty('object_type','task')  ;
   $request->setProperty('option1','saveblob')  ;  //same as saveblob
 $request->setProperty('owner_id','1')  ;
 $request->setProperty('work_remain','3000')  ;
  $execute = new ajaxfacade();

 //test (should be a child level = 1 bigger than parent. (2)
    $request->setProperty('option1','getblobddetailsummary')  ;
 $request->setProperty('object_id',$thisblobid + 2)  ;
 $execute = new adminfacade();
 //echo($execute->results().'<pre>');
  $jsondump = $execute->results();
   $returnarray = json_decode($jsondump,true);
   echo('<pre>');
    print_r($returnarray);
  $this->assertTrue($returnarray['data']['object_id']  == '5','blob not retreived correctly</b>');
  $this->assertTrue($returnarray['status'] == '0','<b>status: not correct 105</b>');
  $this->assertTrue($returnarray['data']['object_name']  == 'C2','blob not retreived correctly</b>');

/* 
        //- - - - - - -//

          // create a blob
          //name =  C3

      // set type = 'task'
      // parent = parent above P1
      // prev_sibling_id = C1
$request->deleteAllProperties();

             $request->setProperty('object_id','-1');
$request->setProperty('object_name','C3');
$request->setProperty('content','C3');
$request->setProperty('prev_sibling_id',$thisblobid + 1); //ie C1
  $request->setProperty('parent_id',$thisblobid);
 $request->setProperty('object_type','task')  ;
   $request->setProperty('option1','saveblob')  ;
   $request->setProperty('work_remain','4000')  ;
   $request->setProperty('owner_id','1')  ;
  $execute = new ajaxfacade();

      $request->setProperty('option1','getblobbyblobid')  ;
 $request->setProperty('blob_id',$thisblobid + 3)  ;
 $execute = new ajaxfacade();
 //echo($execute->results().'<pre>');
  $jsondump = $execute->results();
   $returnarray = json_decode($jsondump,true);
 // echo('<pre>');
 //  print_r($returnarray);
  $this->assertTrue($returnarray['data']['level'] == '1');
   $this->assertTrue($returnarray['data']['object_name'] == 'C3');
   $this->assertTrue($returnarray['data']['owner_id'] == '1');

   $request->setProperty('option1','getallblobchildren')  ;
   $request->setProperty('parent_id',$thisblobid + 3)  ;
    $jsondump = $execute->results();
   $returnarray = json_decode($jsondump,true);

       //- - - - - - -//
        // create a blob
          //name =  C4
        // set type = 'task'
      // parent = parent above P1
      // next_sibling_id = C1
$request->deleteAllProperties();
 $request->setProperty('object_id','-1');
$request->setProperty('object_name','C4');
$request->setProperty('content','C4');
$request->setProperty('prev_sibling_id',NULL );
$request->setProperty('next_sibling_id',NULL ); //ie C1
  $request->setProperty('parent_id',$thisblobid+1); // ie c1
   //this will put it on level 2
    $request->setProperty('owner_id','1')  ;
 $request->setProperty('object_type','task')  ;
   $request->setProperty('option1','saveblob')  ;
    $request->setProperty('work_remain','5000')  ;
  $execute = new ajaxfacade();

      $request->setProperty('option1','getblobbyblobid')  ;
 $request->setProperty('blob_id',$thisblobid + 4)  ;      // ie C4
 $execute = new ajaxfacade();
     $jsondump = $execute->results();
   $returnarray = json_decode($jsondump,true);
/*
   echo('<pre>');
echo("PARENT ID $thisblobid <br>Request singleton<br>");
print_r($request->getallproperties());
echo('<br>');
   print_r($returnarray);
  echo('</pre>');
*/
/*
    $this->assertTrue($returnarray['data']['level'] == '2',"level should be 2, is : ".$returnarray[0]['level']);
  $this->assertTrue($returnarray['data']['object_name'] == 'C4','<b>name not set 149</b>');
  $this->assertTrue($returnarray['data']['owner_id'] == '1','<b> owner name not set 169</b>');
 $request->setProperty('object_type','task')  ;
   // now lets MOVE a blob.. make c1 a child of c4
   $request->deleteAllProperties();
 $request->setProperty('blob_id',$thisblobid + 4)  ;      // ie C4



    $request->setProperty('option1','saveblob')  ;
 $request->setProperty('object_id',$thisblobid + 1)  ; //C1
 $request->setProperty('parent_id',$thisblobid + 4)  ; //C4
 $request->setProperty('owner_id','1')  ;
 $request->setProperty('object_type','task')  ;
 $execute = new ajaxfacade();
     $jsondump = $execute->results();
   $return = json_decode($jsondump,true);
/*echo('<pre>');
echo("PARENT ID $thisblobid <br>Request singleton<br>");
print_r($request->getallproperties());
echo('<br>');
   print_r($return);
  echo('</pre>');
 
  $this->assertTrue($return  == '4','182 object id is not 2 is '.$return );
*/
     //- - - - - - -//
        // create a blob
          //name =  C5
        // set type = 'task'
      // parent = parent above P1
     // prev_sibling_id = C4
     // next_sibling_id = C1

     //this will put it on level 3 where C1 used to be and bump C1 and C3 down to level 5, and 6 resp.
     // C4 stays on level 3 unchanged

    //- - - - - - -//
        // create a blob
          //name =  C6
        // set type = 'task'
      // parent = parent above P1
       // parent = parent above P1
     // prev_sibling_id = C4

       //this inserts C6 on level 4 (as a second sibling to C5), with C4 as the parent

}

}

?>

