<?php
ob_start();
class Testlogin extends UnitTestCase{
    function testsavenewuser(){
        $this->assertTrue( true );
        /** insert a single user and see if it was inserted correctly **/
?>
        <h1>testlogin.php</h1>
        This test creates 2 users, then attempts a login with proper credentials, then tries again without.
<?php
        $request=request::getInstance();
        $request->setbyarray(array(
            'task' => 'userlogin',
            'first_name' => 'alice',
            'last_name' => 'alice surname',
            'password' => 'alice',
            'email' => 'alice@example.com'
        ));
        user::doregistration();
        $request->deleteAllProperties();
        $request=request::getInstance();
        $request->setbyarray(array(
            'task' => 'userlogin',
            'password' => 'alice',
            'email' => 'alice@example.com',
            'task' =>'userlogin'
        ));
        $login = new userlogin();
        $cookieuser_id=$login->execute();
        echo('this cookie user is '.$cookieuser_id);
        $this->assertTrue( $login->checkloginstatus() != 0   );
        $this->assertTrue( $login->checkloginstatus() == 1   );
        /** insert a second user and check the user ID is 2 **/
        echo('29 user login');
        $request=request::getInstance();
        $request->setbyarray(array(
            'task' => 'userlogin',
            'first_name' => 'bob',
            'last_name' => 'bobsurname',
            'status' => 'user',
            'password' => 'bob',
            'email' => 'bob@example.com'
        ));
        user::doregistration();
        echo('user 2 registered<br>');
        $request->deleteAllProperties();
        $request=request::getInstance();
        $request->setbyarray(array(
            'task' => 'userlogin',
            'password' => 'bob',
            'email' => 'bob@example.com'
        ));
        $login = new userlogin();
        /** check to see if bob is now user 2 **/
        $this->assertTrue( $login->checkloginstatus() != 0   );
        $this->assertTrue( $login->checkloginstatus() == 2   );

        // now lets try to login with the wrong password
        $request->deleteAllProperties();
        $request=request::getInstance();
        $request->setbyarray(array(
            'task' => 'userlogin',
            'password' => 'NOTbob',
            'email' => 'bob@example.com'
        ));
        $login = new userlogin();
        /** check to see if bob is now user 2 **/
        $this->assertTrue( $login->checkloginstatus() == 0 , 'log in returns '. $login->checkloginstatus()   );
    }
}
ob_end_clean();
?>