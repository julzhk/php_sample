<?php

/**
 * @desc A CONTROLLER to handle the 'outside the wall' part of the templates.
 * @version 1.0
 */
class loginfacade extends abstractfacade
{

    /**
     * This is to request the password reset.
     */
    public function resetpassword()
    {
        $email = $this->request->getProperty('email');
        $result = forgotpasswordtoken::processResetRequest($email);
        $output = array('sentsuccess' => $result);
        $this->output = ($this->outputjson($output));
    }

    /**
     * Check to see if the user is allowed to register and if they have valid info submitted.
     * Proceed to create a new account and then process a token if there is one.
     */
    public function publicuserregister()
    {
        fb('starting publicuserregister');
        $email = $this->request->getProperty("email");
        $invite_email = $this->request->getProperty("invite_email");
        $token = $this->request->getProperty("token");
        $beta_code = $this->request->getProperty("beta");
        $password = $this->request->getProperty("password");
        $first_name = $this->request->getProperty("first_name");
        $last_name = $this->request->getProperty("last_name");
        $space_id = $this->request->getProperty("space_id");
        $language_iso = $this->request->getProperty("language_iso");
        if (is_null($language_iso)) {
            $language_iso = DEFAULT_LANGUAGE_CODE;
        }
        //fb('beta code check :started');
        //fb('$reg_code, $invite_email, $token'.$reg_code.','. $invite_email.','. $token);
        login::checkBetaInviteToken($beta_code, $invite_email, $token); //This is only for during the beta period - will remove later.
        //fb('beta code check :ok.');
        $RegistrationOK = login::checkRegistrationOK($email, $password, $first_name, $last_name); // ie validate email/names etc throw exception if wrong
        if (!$RegistrationOK) {
            //fb('registration failed. Try login ');
            $loginok = $this->userlogin();
            if (!$loginok) {
                //fb('attempted to login with registration info. Failed.');
                $this->output = $this->createjsonstring(AJAX_DUPLICATE_ENTRY);
            }
            return(0);
        }
        $newuser = user::newUserSetup($password, $email, $first_name, $last_name, $invite_email, $language_iso);
        $user_arr = login::processLogin($email, $password);
        if ($user_arr) {
            login::processToken($token, $invite_email, $space_id, $user_arr['id']);
            $result = user::user_initial_data($user_arr['id'], 0);
            $this->output = $this->outputjson($result, 'mapped_data');
        } else {
            $this->output = $this->createjsonstring(AJAX_BAD_LOGIN_CREDENTIALS);
            return(0);
        }
    }

    public function userlogin()
    {
        fb('starting userlogin');
        $email = $this->request->getProperty("email");
        $password = $this->request->getProperty("password");
        $token = $this->request->getProperty("token");
        $invite_email = $this->request->getProperty("invite_email");
        $space_id = $this->request->getProperty("space_id");
        $reset = $this->request->getProperty("reset");
        //fb('is it a reset or normal login?');
        if ($reset) {
            //fb('reset');
            $user_arr = login::processResetPassword($reset, $password, $email);
        } else {
            //fb('normal');
            $user_arr = login::processLogin($email, $password); // USER ID
        }
        if ($user_arr) {
            login::processToken($token, $invite_email, $space_id, $user_arr['id']);
            $result = user::user_initial_data($user_arr['id'], 0);
            $this->output = $this->outputjson($result, 'mapped_data');
            return(TRUE);
        } else {
            $this->output = $this->createjsonstring(AJAX_BAD_LOGIN_CREDENTIALS);
            return(FALSE);
        }
    }

    public function getinitdic()
    {
        fb('starting getinitdic');
        $iso_code = $this->request->getProperty("iso_code");
        $user_id = utilityclass::getcookie_id();
        if ($user_id) {
            $result = login::processLoggedInUser($user_id, $iso_code);
        } else {
            $result = login::getInitDic($iso_code);
        }
        $this->output = $this->outputjson($result, 'mapped_data');
    }

    public function chron()
    {
        $result = uicalc::chronUrgencyIndexRecalculate();
        $allactiveusersarray = user::allactiveusers();
        $timecode = utilityclass::yesterdaysdateUnix();
        foreach ($allactiveusersarray as $thisuser) {
            $emailupdate = user::sendstatusupdate($thisuser, $timecode);
        }
        $this->output = $this->outputjson('chron complete on ' . $result . ' roots');
    }

}

?>
