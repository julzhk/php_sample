<?php

class postDeleteCleanUp extends Doctrine_Record_Listener
{

    public function postDelete(Doctrine_Event $event)
    {
        fb('deleted ' . $event->getInvoker()->id);
    }

}

class user extends base_data_class
{

    public function setTableDefinition()
    {
        $this->hasColumn('first_name', 'string', 25, 'not-blank');
        $this->hasColumn('last_name', 'string', 25, 'not-blank');
        $this->hasColumn('email', 'string', 125, 'not-blank');
        $this->hasColumn('userstatus', 'string', 25, 'not-blank');
        $this->hasColumn('password', 'string', 32, 'not-blank');
        $this->hasColumn('userimage', 'string', 125);
        $this->hasColumn('status', 'string', 125);
        $this->hasColumn('language_id', 'integer');
        $this->hasColumn('timezone', 'string', 256); //This is for the PHP timezone string http://hk.php.net/timezones
        $this->hasColumn('detailedinfo', 'string');
    }

    public function setUp()
    {

        $this->hasMany('team', array(
            'local' => 'user_id',
            'foreign' => 'team_id',
            'refClass' => 'teamuser'
                )
        );
        $this->hasMany('userattributes', array(
            'local' => 'id',
            'foreign' => 'user_id'
                )
        );

        $this->hasMany('userlogintoken', array(
            'local' => 'id',
            'foreign' => 'user_id'
                )
        );
        $this->hasMany('userinvitetoken', array(
            'local' => 'id',
            'foreign' => 'user_id'
                )
        );
        $this->hasMany('translationuser', array(
            'local' => 'id',
            'foreign' => 'user_id'
                )
        );
        $this->hasOne('languages', array(
            'local' => 'language_id',
            'foreign' => 'id'
                )
        );
        $this->addListener(new postDeleteCleanUp());

        parent::timeStampable(); // The updated at and created at fields..
        // $this->actAs('Searchable', array('fields' => array('name', 'password')));
    }

    // see ajax facade : getuserdetailbyUserId
    static function getuserdetailbyUserId($user_id, $timecode = 0)
    {
        fb('starting getuserdetailbyUserId');
        $thisuser = Doctrine_Query::create()
                        ->select("u.id , u.first_name , u.last_name , u.status ,u.userstatus , u.email,  u.userimage , u.language_id")
                        ->from('user u')
                        ->where('u.id = ?', ($user_id))
                        ->addWhere('u.updated_at > ?', $timecode)
                        ->limit(1)
                        ->fetchArray();
        //fb($thisuser);
        if (count($thisuser)) {
            // fb('results ok, finding the emails');
            $thisuser_arr = $thisuser[0];
            //fb($thisuser_arr);
            $email_arr = userattributes::getAttributeByUserIdStatusVerified($thisuser_arr['id'], 'email', ACTIVE, VERIFIED);
            if (count($email_arr)) {
                //fb($email_arr);
                // swap in email from attributes table
                //@TODO - will need to activate one of the e-mail addresses as the main one, used for sending notices.
                if (isset($email_arr['value'])) {
                    $thisuser_arr['email'] = $email_arr['value'];
                } else if (isset($email_arr[0]['value'])) {
                    $thisuser_arr['email'] = $email_arr[0]['value'];
                }
            }
            return($thisuser_arr);
        }
        return(null);
    }

    static function getName($user_id)
    {
        $user_name_array = Doctrine_Query::create()
                        ->select("u.id , u.first_name , u.last_name , u.status , u.userimage")
                        ->from('user u')
                        ->where('id = ?', array($user_id))
                        ->execute(array(), Doctrine::HYDRATE_ARRAY);
        if (count($user_name_array)) {
            $owner = $user_name_array[0]['first_name'] . ' ' . $user_name_array[0]['last_name'];
            return $owner;
            // cf http://www.phpdoctrine.org/documentation/manual/0_10?one-page#working-with-objects:fetching-objects
        } else {
            return(null);
        }
    }

    /**
     * This returns the user's default language given the user_id.
     * @param <integer> $user_id
     * @return <integer> language_id
     */
    public static function getUserLanguageIdByUserId($user_id)
    {
        $user_arr = Doctrine_Query::create()
                        ->select("u.id , u.language_id")
                        ->from('user u')
                        ->where('id = ?', $user_id)
                        ->fetchArray();
        if ($user_arr && !is_null($user_arr[0]['language_id']) && $user_arr[0]['language_id'] > 0) {
            $result = $user_arr[0]['language_id'];
        } else {
            $result = languages::getLanguageIdByCode(DEFAULT_LANGUAGE_CODE);
        }
        return($result);
    }

    public static function alluserIDarray()
    {
        $namearray = Doctrine_Query::create()
                        ->select('id')
                        ->from('user u')
                        ->execute(array(), Doctrine::HYDRATE_ARRAY);
        $result = array();
        foreach ($namearray as $thisname) {
            $result[] = $thisname["id"];
        }
        return $result;
    }

    static public function logoutuser()
    {
        utilityclass::logout_cookie();
    }

    public static function getusersbySpaceId($space_id)
    {
        $teamlist = Doctrine_Query::create()
                        ->select("u.id as user_id, u.first_name , u.last_name , u.email , u.userimage, u.status, u.created_at , u.updated_at, t.id as team_id , t.team_name as team_name,  t.account_admin as account_admin , t.service_level as service_level")
                        ->from('user u')
                        ->leftJoin('u.team t')
                        ->where('t.space_id = ?', array($space_id))
                        ->fetchArray();
        foreach ($teamlist as &$thisteam) {
            unset($thisteam ['team']);
        }
        return($teamlist);
    }

    public static function getuserbriefinfobyspaceid($space_id)
    {
        $teamlist = Doctrine_Query::create()
                        ->select("u.id as user_id, u.first_name , u.last_name , u.userimage")
                        ->from('user u')
                        ->leftJoin('u.team t')
                        ->where('t.space_id = ?', array($space_id))
                        ->fetchArray();
        foreach ($teamlist as &$thisteam) {
            unset($thisteam ['team']);
        }
        return($teamlist);
    }

    static public function getuseridbyemail($email)
    {
        fb('look up user id by email..');
        $my_id = userattributes::getUserIdByAttributeValue('email', $email);
        if (!$my_id) {
            return (null);
        }
        //fb ($my_id);
        return($my_id);
    }

    /**
     * Given a valid non-ghost user email, update the user password.
     * @param <string> $email
     * @param <string> $newpassword
     * @return <boolean> Success (Yeah!) or Failure(Boo!)
     */
    static public function updatePasswordByEmail($email, $newpassword)
    {
        fb('starting updatePasswordByEmail');
        $result = FALSE;
        $user_arr = userattributes::getNonGhostUserByAttribute('email', $email);
        if ($user_arr) {
            $pass_hash = utilityclass::generatepasswordhash($newpassword);
            //fb($user_arr);
            $q = Doctrine_Query::create()
                            ->update('user')
                            ->set('password', '?', $pass_hash)
                            ->where('id = ?', $user_arr['id']);
            $result = $q->execute();
        }
        return($result);
    }

    static public function deleteUserRecords($user_id)
    {
        $q = Doctrine_Query::create()
                        ->delete('user u')
                        ->where('u.id = ?', $user_id);
        $result = $q->execute();
        return($result);
    }

    static public function replaceUserStatus($user_id, $curr_status, $new_status)
    {
        $q = Doctrine_Query::create()
                        ->update('user')
                        ->set('userstatus', '?', $new_status)
                        ->where('id = ?', $user_id)
                        ->andWhere('userstatus = ?', $curr_status);
        $result = $q->execute();
        return($result);
    }

    static public function deleteuser($user_id)
    {
        $result = self::replaceUserStatus($user_id, LIVE_REGISTERED_USER, USER_STATUS_SOFT_DELETE);
        if ($result === 0) {
            // hard delete (- for ghost user records)
            $result = self::deleteUserRecords($user_id);
        }
        return ($result);
    }

    static public function updateuserinfo($user_id, $first_name, $last_name)
    {
        $thisuser = Doctrine::getTable("user")->find($user_id);
        if ($thisuser) {
            // do update b/c the user exists
            if (!is_null($first_name)) {
                $thisuser->first_name = $first_name;
            }
            if (!is_null($last_name)) {
                $thisuser->last_name = $last_name;
            }
            return( array("post_success" => SUCCESSFUL));
        } else {
            return array("post_success" => NOT_SUCCESSFUL);
        }
    }

    static public function user_update_data($user_id)
    {
        $result = array();
        $result['user_objects'] = objectblob::allblobarray($user_id);
        $result['user_permissions'] = objectblob::getblobpermissionsbyuserid($user_id);
        return($result);
    }

    public static function getIsoCodeByUserId($user_id)
    {
        fb('starting getIsoCodeByUserId ' . $user_id);
        $result = DEFAULT_LANGUAGE_CODE;
        $lang_arr = Doctrine_Query::create()
                        ->select('u.*, l.iso_code as iso_code')
                        ->from('user u')
                        ->leftJoin('u.languages l')
                        ->where('u.id = ?', $user_id)
                        ->fetchArray();
        //fb($lang_arr);
        if ($lang_arr && !is_null($lang_arr[0]['iso_code'])) {
            $result = $lang_arr[0]['iso_code'];
        }
        return($result);
    }

    static public function user_initial_data($user_id, $timecode = 0, $iso_code = null)
    {
        fb('starting user_initial_data');
        $iso_code = (is_null($iso_code)) ? self::getIsoCodeByUserId($user_id) : $iso_code;
        $result_arr = user::userdata($user_id, $timecode, $iso_code);
        $result_arr = array_merge($result_arr, user::admindata($user_id, $timecode));
        $map_arr = utilityclass::createMapDataArray($result_arr);
        return($map_arr);
    }

    static public function userdata($user_id, $timecode, $iso_code)
    {
        fb('starting userdata');
        $obj_arr = objectblob::allblobarray($user_id, 0); //all of them
        // get a simple array of just ids
        $obj_id_arr = utilityclass::reduceArrayToListByKey($obj_arr, 'object_id');
        $team_obj_arr = objectblob::getTeamUserParentObjectIdsByUserId($user_id);

        $return = array('object' => objectblob::allblobarray($user_id, $timecode),
            'approvalchain' => approvalchain::getapprovalchainlistbybloblist($obj_id_arr, $timecode),
            'file' => fileobject::getfilelistbybloblist($obj_id_arr, $timecode),
            'filestore' => filestore::getfilestorelistbybloblist($obj_id_arr, $timecode),
            'schedulelinks' => schedulelinks::schedulelinksbybloblist($obj_id_arr, $timecode),
            'team' => team::teamsbybloblist($team_obj_arr, $timecode),
            'user_info' => user::getuserdetailbyUserId($user_id, $timecode),
            'user_perm' => objectblob::getblobpermissionsbyuserid($user_id, $timecode),
            'user' => blobteam::getusersbyblobids($team_obj_arr, $timecode),
            'userattributes' => userattributes::getUserAttributesByObjectId($team_obj_arr, $timecode),
            'blob_team' => blobteam::getteamsbyblob($obj_id_arr, $timecode),
            'team_user' => teamuser::getTeamUserByObjectId($team_obj_arr, $timecode),
            'comment' => comment::getcommentsbybloblist($obj_id_arr, $timecode),
            'tag' => tag::gettagsbybloblist($obj_id_arr, $timecode),
            'taskscrum' => taskscrum::getscrumsbybloblist($obj_id_arr, $timecode),
            'report' => reportsubscription::getreportsbyuser_id($user_id, $timecode),
            'dic' => translation::getLanguageArrayByIso_code($iso_code, $timecode),
            'languages' => languages::getActiveLanguageArray($timecode)
        );
        //quick fix to getuserdetailbyUserId when it returns null
        if (is_null($return['user_info'])) {
            $return['user_info'] = array();
        } else {
            $return['user_info'] = array($return['user_info']);
        }
        return ($return);
    }

    static public function admindata($user_id, $timecode)
    {
        $timecode = (isset($timecode)) ? $timecode : 0;
        $root_ids = objectblob::adminspaceidarray($user_id); //all of them
        if (count($root_ids) == 0) {
            return(array());
        }
        $return = array('admin_object' => objectblob::adminblobarray($root_ids, $timecode),
            'admin_approvalchain' => approvalchain::getapprovalchainlistbyrootlist($root_ids, $timecode),
            'admin_approvaltemplate' => approvalchaintemplate::getapprovaltemplatelistbyrootlist($root_ids, $timecode),
            'admin_file' => fileobject::getfilelistbyrootlist($root_ids, $timecode),
            'admin_filestore' => filestore::getFileStoreListBySpaceId($root_ids, $timecode),
            'admin_team' => team::teamsbyrootlist($root_ids, $timecode),
            'admin_user' => blobteam::getusersbyrootids($root_ids, $timecode),
            'admin_user_attributes' => userattributes::getUserAttributesBySpaceId($root_ids, $timecode),
            'admin_blob_team' => blobteam::getteamsbyroot($root_ids, $timecode),
            'admin_team_user' => teamuser::getTeamUserByRootId($root_ids, $timecode)
        );
        return ($return);
    }

    static public function deleteuserfromspace($user_id, $space_id)
    {
        // get space's inactive team id
        $inactive_team_id = team::getTeamIdByTeamNameSpaceId(INACTIVE_TEAM_NAME, $space_id);
        // get the user's (where != _inactive) teams for the space
        $team_id_array = team::getteamidsbyuserandspaceid($user_id, $space_id);
        //remove inactive team from list
        $inactiveteamkey = array_search($inactive_team_id, $team_id_array);
        if ($inactiveteamkey) {
            unset($team_id_array[$inactiveteamkey]);
        } else {
            // put user into the inactive team
            team::assignmembertoteam($user_id, $inactive_team_id);
        }
        // so now $team_id_array is just the active teams
        // step thru and remove user from these teams.
        team::deletememberfromteam($user_id, $team_id_array);
    }

    public static function updateavatar($user_id, $filename)
    {
        $q = Doctrine_Query::create()
                        ->update('user')
                        ->set('userimage', '?', $filename)
                        ->set('updated_at', '?', time());
        $q->where('id = ?', $user_id);
        $q->execute();
        fb('user avatar updated');
    }

    public static function allactiveusers()
    {
        $activeUsersArray =
                        Doctrine_Query::create()
                        ->select('')
                        ->from('user u')
                        ->where('userstatus = ?', '1')
                        ->execute(array(), Doctrine::HYDRATE_ARRAY);
        return $activeUsersArray;
    }

    public static function sendstatusupdate($user_array, $timecode)
    {

        $mail = new emailhandler();
        $mail->addaddress($user_array['email'], ($user_array['first_name'] . ' ' . $user_array['last_name']));
        // now send out..
        $update_message = file_get_contents(RELATIVEPATH . 'staticpages/fieldupdatedemail.html');
        $userdata = self::userdata($user_array['id'], $timecode);
        echo("Hi " . $user_array['first_name'] . ' ' . $user_array['last_name'] . '<br><br>');

        $updatemessage = '';
        foreach ($userdata as $userdatakey => $userdataarray) {
            $outputfunction = $userdatakey . 'output';
            if (method_exists('user', $outputfunction) AND $userdataarray) {
                $updatemessage .= '<br>' . $userdatakey . '<br>----<br>';
            }
            foreach ($userdataarray as $thisdatumkey => $thisdatumvalue) {
                if (method_exists('user', $outputfunction)) {
                    $updatemessage .= self::$outputfunction($thisdatumvalue);
                } else {
                    $updatemessage .= '';
                }
                //$thiskey."-> ".$thisval. " <br> ";
            }
        }
        $update_message = sprintf($update_message, $updatemessage); // drops in the token into the message. (see %s )
        //  fb('update message to :'.$userdata['email'],($userdata['first_name'].' '.$userdata['last_name']));
        echo($update_message);
        $mail->setmessage($update_message);
        $mail->setsubject(EMAIL_UPDATE_SUBJECT);
        $sentok = $mail->send();
        return($sentok);
    }

    // user factory method
    static public function createnewuser($password, $first_name, $last_name, $status, $iso_code=DEFAULT_LANGUAGE_CODE)
    {
        $lang_id = languages::getLanguageIdByCode($iso_code);
        if (isset($password) && isset($status)) {
            $u = new user();
            $u->password = (isset($password)) ? utilityclass::generatepasswordhash($password) : NULL;
            $u->first_name = (isset($first_name)) ? $first_name : '';
            $u->last_name = (isset($last_name)) ? $last_name : '';
            $u->userstatus = $status;
            $u->language_id = $lang_id;
            $u->save();

            return ($u);
        }
    }

    static public function ghostUserSetup($email, $thislanguageIso)
    {
        $newuser = array();
        if (isset($email)) {
            $newuser = self::createnewuser(mt_rand(), '', '', GHOST_USER, $thislanguageIso);
            userattributes::createUserAttribute($newuser->id, 'email', $email, VERIFIED, ACTIVE);
        }
        return ($newuser);
    }

    static public function newUserSetup($password, $email, $first_name, $last_name, $invite_email, $iso_code = DEFAULT_LANGUAGE_CODE)
    {
        $newuser = self::createnewuser($password, $first_name, $last_name, LIVE_REGISTERED_USER, $iso_code);
        $myname = $first_name . ' ' . $last_name;

        if (isset($invite_email)) {
            //fb('creating user attribute for invite_email '.$invite_email);
            $userattributeobject1 = userattributes::createUserAttribute($newuser->id, 'email', $invite_email, VERIFIED, ACTIVE);
        }
        if (isset($email) && $invite_email != $email) {
            //fb('creating user attribute for email '.$email);
            $userattributeobject2 = userattributes::createUserAttribute($newuser->id, 'email', $email, UNVERIFIED, ACTIVE);
        }

        $thisspace = space::createspace($myname, $newuser->id, PERSONAL_SPACE, PRO_USER);
        //fb('Created new space.');

        return ($newuser);
    }

}

?>
