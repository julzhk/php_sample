<?php
ob_start();
// set the user cookie to user 1
 global $unittestinguser;
 $unittestinguser = 1;
 global $user;
 global $pw;
 global $dbname;
 global $conn;
 global $link;
 global $usefb;
 $usefb =  'unittestrun';
 
 
 require_once('../doctrine/lib/Doctrine.php');
 spl_autoload_register(array ('Doctrine','autoload'));
 Doctrine_Manager::getInstance()->setAttribute('model_loading', 'conservative');
 Doctrine::loadModels('../dataobjects'); // lazy loading of doctrine models.

    include_once('../file_includes.php');
    include_once ("../commands/initdb.php");
    include_once ("../commands/ajaxfacade.php");
    include_once("../config.php");
    $initdb = new initdb();
    $initdb->execute();
    $request= request::getInstance();
    $request->init();
 require_once ('../simpletest/simpletest/autorun.php');
 require_once ('../simpletest/simpletest/unit_tester.php');
    require_once ('../simpletest/simpletest/reporter.php');

  class testloginTests extends TestSuite {
   function __construct(){
    parent::__construct('Log in  tests!');
    foreach(array(1,2,3,4,5) as $thislink){
        echo("<a href ='AllTests.php?i=$thislink'>set $thislink </a> | ");
    }
    echo("<hr>");
fb('59');
 $i ="";
 if(array_key_exists('i',$_GET)){ $i= $_GET['i'];   }
switch($i){

   case 1:
  
    $this->addTestFile('../unittests/testlogin.php');
    $this->addTestFile('../unittests/testtasks.php');
    $this->addTestFile('../unittests/testtags.php');
    $this->addTestFile('../unittests/testcomments.php');
    $this->addTestFile('../unittests/testajaxfacadefunctions3.php');
    $this->addTestFile('../unittests/testschedulelinks.php');
    $this->addTestFile('../unittests/testscrumsave.php');
    $this->addTestFile('../unittests/testscheduling.php');

   break;
case 2:
    $this->addTestFile('../unittests/testlogin.php');
    $this->addTestFile('../unittests/testuserregistration.php');
    $this->addTestFile('../unittests/testfileobject.php');
    $this->addTestFile('../unittests/testteam.php');
    $this->addTestFile('../unittests/testtasks.php');

   break;
case 3:
    $this->addTestFile('../unittests/testlogin.php');
    $this->addTestFile('../unittests/testtasks.php');
    $this->addTestFile('../unittests/testajaxfacadefunctions3.php');
    $this->addTestFile('../unittests/approvalchaintest.php');
    break;
case 4:
    $this->addTestFile('../unittests/testlogin.php');
    $this->addTestFile('../unittests/testreorderblob.php');
    $this->addTestFile('../unittests/testschedulelinkmethods.php');
    $this->addTestFile('../unittests/getavatar.php');
    $this->addTestFile('../unittests/testavatartest.php');
    break;
case 5:
    default:
      $this->addTestFile('../unittests/testlogin.php');
      $this->addTestFile('../unittests/testmovetest.php');
      $this->addTestFile('../unittests/testapprovals.php');
    break;

}
   }
  }
  echo('<h1><a ID = header></a> <a href ="#footer">go to footer</a></h1><hr>');

   $test = new testloginTests();
    $test->run(new HtmlReporter());
   echo('<h1><a ID = footer></a> <hr><a href ="#header">go to header</a></h1>');

 ?>