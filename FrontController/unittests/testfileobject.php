<?php

  class Testfileobject extends UnitTestCase{
function testupload(){
    // cant really test, without sending a file, but can test the db actions..
   //  public static function upload($title, $description, $submission_status, $object_blob_id, $fileid){
echo('<h3>Testfileobject</h3>');
         $request=request::getInstance();
     $r =     fileobject::uploaddatabaserecord("test title",'test desc','sub status',2,-1);
     //TEST IT

     $result = fileobject::getfilelistbyobjectid(2);
   $this->assertTrue(count($result) == 1   );
   $this->assertTrue($result[0]['title'] ==  "test title" );
   $this->assertTrue($result[0]['description'] ==  'test desc' );
   $this->assertTrue($result[0]['root_id'] ==  '' );
   $this->assertTrue($result[0]['version'] ==  '1' );
// ok done once! now update it

$r2 =     fileobject::uploaddatabaserecord("test title2",'test desc2','sub status2',2,1); //update to previous upload.
    $result = fileobject::getfileversionslistbyfileid(2);
    $this->assertTrue(count($result) == 2   );
    $this->assertTrue($result[1]['title'] ==  "test title" );
   $this->assertTrue($result[1]['description'] ==  'test desc' );
   $this->assertTrue($result[1]['root_id'] ==  '2' );
   $this->assertTrue($result[1]['version'] ==  '1' );

  $this->assertTrue($result[0]['title'] ==  "test title2" );
   $this->assertTrue($result[0]['description'] ==  'test desc2' );
   $this->assertTrue($result[0]['root_id'] ==  '' );
   $this->assertTrue($result[0]['version'] ==  '2' );

   // ok done 2 times! now update it
$r3 =     fileobject::uploaddatabaserecord("test title3",'test desc3','sub status3',2,2); //update to previous upload.
    $result = fileobject::getfileversionslistbyfileid(3);
   $this->assertTrue(count($result) == 3   );
    $this->assertTrue($result[2]['title'] ==  "test title" );
   $this->assertTrue($result[2]['description'] ==  'test desc' );
   $this->assertTrue($result[2]['version'] ==  '1' );

  $this->assertTrue($result[1]['title'] ==  "test title2" );
   $this->assertTrue($result[1]['description'] ==  'test desc2' );
   $this->assertTrue($result[1]['version'] ==  '2' );

  $this->assertTrue($result[0]['title'] ==  "test title3" );
   $this->assertTrue($result[0]['description'] ==  'test desc3' );
   $this->assertTrue($result[0]['version'] ==  '3' );

// ok done 3 times! now update it AGAIN
$r3 =     fileobject::uploaddatabaserecord("test title4",'test desc4','sub status4',2,3); //update to previous upload.
    $result = fileobject::getfileversionslistbyfileid(4);
   $this->assertTrue(count($result) == 4   );


   echo('<pre>');
print_r($result);
echo('</pre><hr>');


}
function testrename(){


}
  }
?>