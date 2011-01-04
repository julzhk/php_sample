<?php

class useradminfacade extends abstractfacade
{

    function __construct()
    {
        $is_allowed = FALSE;
        $user_id = utilityclass::getcookie_id();
        if ($user_id) {
            $is_allowed = TRUE;
        }

        if ($is_allowed) {
            parent::__construct();
        } else {
            $this->error = new jsonerror(AJAX_SECURITY_BREACH);
        }
    }

    /**
     * Gives a user a way to update their own information. This will need to be expanded later.
     * @param $first_name, $last_name
     * @return Return the standard data.
     * */
    public function updateuserinfo()
    {
        fb('started ajaxfacade method updateuserinfo');
        $user_id = utilityclass::getcookie_id();
        $first_name = trim($this->request->getProperty('first_name'));
        $last_name = trim($this->request->getProperty('last_name'));

        if (utilityclass::missingvalues(array($first_name, $last_name, $user_id))) {
            $this->error = new jsonerror(AJAX_ARGUMENT_MISSING);
        } else {
            //This portion will need a method to save the information into the db.
            $result = user::updateuserinfo($user_id, $first_name, $last_name);
            //  returns array("post_success"=> '1');
            self::admindata(false);
        }
    }

    public function deleteuserfromspace()
    {
        $user_id = utilityclass::getcookie_id();
        $space_id = $this->request->getProperty('space_id');
        self::admindata(false);
    }

    /**
     * Retrieve all up to date user data based on the time of the last information received.
     */
    public function admindata($del_flag)
    {
        $del_flag = (isset($del_flag)) ? $del_flag : false;
        $timecode = $this->request->getProperty('t_c');
        $user_id = utilityclass::getcookie_id();
        //If there was a deletion, resend the whole works.
        $timecode = ($del_flag) ? 0 : $this->request->getProperty('t_c');
        $data = user::user_initial_data($user_id, $timecode);
        $data['del_flag'] = $del_flag;
        $this->output = $this->outputjson($data, 'mapped_data');
    }

    /**
     * Retrieve all up to date user data based on the time of the last information received.
     * @TODO - Merge this back with the above method. It has been broken out to make it clean, but I'm assuming there is a better way.
     */
    public function admindatapub()
    {
        $del_flag = (isset($del_flag)) ? $del_flag : false;
        self::admindata($del_flag);
    }

    /**
     * This saves the user avatar confirmation.
     * @param none, just the received request data
     * @return standard JSON updated data
     */
    public function uploadavatar()
    {
        fb('admin facade : uploadavatar started');
        $user_id = utilityclass::getcookie_id();
        $trans_id = ($this->request->getProperty('trans_id'));
        user::updateAvatar($user_id, $trans_id);
        self::admindata(false);
    }

    public function saveavataruploadtoken()
    {
        $trans_id = $this->request->getProperty('trans_id');
        $user_id = utilityclass::getcookie_id();
        if (utilityclass::missingvalues(array($trans_id, $user_id))) {
            $this->error = new jsonerror(AJAX_ARGUMENT_MISSING);
            $r = array('success' => 'missing args', "tid" => NULL);
        } else {
            $attrib = userattributes::createUserAttribute($user_id, 'avatar_file', $trans_id, VERIFIED, INACTIVE);
            $tid = uploadtoken::saveAvatarUploadToken($trans_id, $user_id);
            $r = array("tid" => $tid);
            self::admindata(false);
        }
    }

    public function updateuseremail()
    {
        $new_email = ($this->request->getProperty('email'));
        $user_id = utilityclass::getcookie_id();
        $u = userattributes::updateemailaddress($user_id, $email);
        self::admindata(false);
    }

    public function createspace()
    {
        fb('ajx create space');
        $spacename = $this->request->getProperty('space_name');
        $user_id = utilityclass::getcookie_id();
        if (utilityclass::missingvalues(array($spacename, $user_id))) {
            $this->error = new jsonerror(AJAX_ARGUMENT_MISSING);
        } else {
            $result = space::createspace($spacename, $user_id);
            fb('new space name will be ' . $spacename);
            fb('create space result is :' . $result);
            self::admindata(false);
        }
    }

}

?>
