<?php

class team extends base_data_class
{

    public function setTableDefinition()
    {
        $this->hasColumn('team_name', 'string');
        $this->hasColumn('space_id', 'integer'); // this is linked to the object_blob_root_id 
        $this->hasColumn('account_admin', 'integer');
        $this->hasColumn('service_level', 'integer');
    }

    public function setUp()
    {
        $this->hasMany('user', array(
            'local' => 'team_id',
            'foreign' => 'user_id',
            'refClass' => 'teamuser')
        );

        $this->hasMany('objectblob', array(
            'local' => 'team_id',
            'foreign' => 'blob_id',
            'refClass' => 'blobteam'
                )
        );


        $this->hasMany('approvalchain', array('local' => 'id',
            'foreign' => 'team_id',
        ));
        $this->hasMany('approvalchaintemplate', array('local' => 'id',
            'foreign' => 'team_id',
        ));
        $this->hasMany('reportsubscription', array('local' => 'id',
            'foreign' => 'team_id'
        ));


        parent::timeStampable(); // The updated at and created at fields..
        // $this->actAs('Searchable', array('fields' => array('name', 'password')));
    }

    /**
     * @desc simple team creator
     * @return id of created team
     * @param $teamname,$space_id ,$is_personalteam defaults to false
     */
    public static function createteam($teamname, $space_id = null)
    {
        $t = new team();
        //print_r($t->toArray());
        $t->state('TDIRTY'); // save a blank
        $t->team_name = $teamname;
        fb('42... ');
        $t->space_id = $space_id;
        $t->account_admin = 0;
        $t->service_level = 0;
        $t->save();
        fb('43... ' . $t->id);
        return($t->id);
    }

    public static function assignmembertoteam($user_id, $team_id)
    {
        fb('assignmembertoteam started');
        $result = teamuser::checkMebershipByTeamIdUserId($team_id, $user_id);
        if (!$result) {
            $t = new teamuser();
            $t->user_id = $user_id;
            $t->team_id = $team_id;
            try {
                $t->save();
                fb('teamuser saved successfully');
                $result = TRUE;
            } catch (Exception $e) {
                fb("ERROR CAUGHT- cant add this user($user_id) to this team($team_id)");
                fb('Caught exception: ' . $e->getMessage());
                fb('<br>not assigned ' . $user_id);
            }
        }
        return ($result);
    }

    public static function getteammember_id($team_id)
    {
        $userlist = Doctrine_Query::create()
                        ->select("user_id")
                        ->from('teamuser t')
                        ->where('t.team_id = ?', array($team_id))
                        ->fetchArray();
        $userlistarray = array();
        foreach ($userlist as $thisuser) {
            $userlistarray[] = $thisuser["user_id"];
        }
        return($userlistarray);
    }

    public static function getteammember_info($team_id)
    {
        $userlist = Doctrine_Query::create()
                        ->select("id ,first_name ,last_name,email,status,userimage")
                        ->from('user u')
                        ->leftJoin('u.team t')
                        ->where('t.id = ?', array($team_id))
                        ->fetchArray();
        if (count($userlist)) {
            return($userlist);
        } else {
            return(NULL);
        }
    }

    /**
     * @desc get team info for a particular user
     * @param user id
     * @return an array (of arrays)
     */
    public static function getteam_info($user_id)
    {
        $teamlist = Doctrine_Query::create()
                        ->select("*")
                        ->from('team t')
                        ->leftJoin('t.user u ')
                        ->where('u.id = ?', array($user_id))
                        ->fetchArray();
        foreach ($teamlist as &$thisteam) {
            unset($thisteam ['created_at']);
            unset($thisteam ['updated_at']);
        }
        return($teamlist);
    }

    public static function updateteamadminstatus($account_admin, $service_level, $team_id)
    {
        fb("set admin team permissions");
        $adminquery = Doctrine_Query::create()
                        ->update('team t')
                        ->where('t.id = ?', array($team_id))
                        ->set('t.account_admin', $account_admin)
                        ->set('t.service_level', $service_level)
                        ->set('t.updated_at', time());
        try {
            $adminquery->execute();
        } catch (Exception $e) {
            fb("ERROR CAUGHT- cant update this space/team ($space_id/$team_id) field: $admin_type");
            fb('Caught exception: ' . $e->getMessage());
            return(false);
        }
        return(true );
    }

    static public function getteamidsbyuserandspaceid($user_id, $space_id)
    {
        $teamlist = Doctrine_Query::create()
                        ->select("t.id")
                        ->from('team t')
                        ->leftJoin('t.user u ')
                        ->where('u.id = ?', array($user_id))
                        ->andWhere('t.space_id = ?', array($space_id))
                        ->fetchArray();
        $teamidlist = array();
        foreach ($teamlist as $thisteam) {
            $teamidlist[] = $thisteam['id'];
        }
        return($teamidlist);
    }

    private static function deleteallmemberfromteam($team_id)
    {
        // echo('start delete all members..<br>');
        try {
            $deleted = Doctrine_Query::create()
                            ->delete()
                            ->from('teamuser')
                            ->where('team_id = ?', array($team_id))
                            ->execute();
            // print out the number of deleted phonenumbers
            //        print $deleted;
            return(true);
        } catch (Exception $e) {
            fb("ERROR CAUGHT- cant delete all users from this team($team_id)");
            fb('Caught exception: ' . $e->getMessage());
            return(false);
        }
    }

    static function deletememberfromteam($user_id, $team_id)
    {

        try {
            $teaminfo_array = team::getinfo($team_id);
            //is this an admin team?
            if ($teaminfo_array['account_admin']) {
                // if so
                $admincount = space::countadminusersbyspace($teaminfo_array['space_id']);
                // count how many admin users there are in space
                // if count>1 then carry on..
                if ($admincount < 2) {
                    throw new ajaxfacadeException(AJAX_ARGUMENT_MISSING, "ERROR - must have at least one admin for a space");
                }
            }

            $team_id_array = utilityclass::cast_as_array($team_id);
            $deleted = Doctrine_Query::create()
                            ->delete()
                            ->from('teamuser')
                            ->where('user_id = ?', array($user_id))
                            ->whereIn('team_id', ($team_id_array))
                            ->execute();
            // print out the number of deleted phonenumbers
            //        print $deleted;
            return(true);
        } catch (Exception $e) {
            fb("ERROR CAUGHT- cant delete this user($user_id) from this team($team_id)");
            fb('Caught exception: ' . $e->getMessage());
            return(false);
        }
    }

    public static function assignmemberarraytoteam($team_id, $new_user_id_array)
    {
        $currentteammembers = self::getteammember_id($team_id);
        // echo('current members');
        //  print_r($currentteammembers);
        //   echo('<br>new members');
        //  print_r($new_user_id_array);
        $user_ids_toadd = array_diff($new_user_id_array, $currentteammembers);
        $user_ids_toremove = array_diff($currentteammembers, $new_user_id_array);
        $failflag = true;
        foreach ($user_ids_toadd as $user_id) {
            //      echo('user '.$user_id.'to add to team '.$team_id.'<br>');
            $successful = self::assignmembertoteam($user_id, $team_id);
            //   echo('<br>successful '.$successful.'..<br>' );
            if (!$successful) {
                $failflag = false;
            }
        }
        foreach ($user_ids_toremove as $user_id) {
            //   echo('user '.$user_id.'to remove from  team '.$team_id.'<br>');
            $successful = self::deletememberfromteam($user_id, $team_id);
            //   echo('<br>successful '.$successful.'..<br>' );
            if (!successful) {
                $failflag = false;
            }
        }
        //  echo('fail flag is '.$failflag);
        return($failflag);
    }

    static public function getmyteam_ids($user_id)
    {
        $teamlist = Doctrine_Query::create()
                        ->select("t.team_id")
                        ->from('teamuser t')
                        ->where('t.user_id = ?', array($user_id))
                        ->fetchArray();
        foreach ($teamlist as &$thisteam) {
            $thisteam = $thisteam['team_id'];
        }
        return($teamlist);
    }

    static public function setteamsbyuser($user_id, $team_id_array)
    {
        $users_teams_array = self::getmyteam_ids($user_id);
//echo('<pre>');
//print_r($users_teams_array);
//echo('</pre>');
        $team_ids_toadd = array_diff($team_id_array, $users_teams_array);
        $team_ids_toremove = array_diff($users_teams_array, $team_id_array);
        // print_r($team_ids_toadd );
        $failflag = true;
        foreach ($team_ids_toadd as $team_id) {
            //      echo('user '.$user_id.'to add to team '.$team_id.'<br>');
            $successful = self::assignmembertoteam($user_id, $team_id);
            //   echo('<br>successful '.$successful.'..<br>' );
            if (!$successful) {
                $failflag = false;
            }
        }
        foreach ($team_ids_toremove as $team_id) {
            //   echo('user '.$user_id.'to remove from  team '.$team_id.'<br>');
            $successful = self::deletememberfromteam($user_id, $team_id);
            //     echo('<br>successful '.$successful.'..<br>' );
            if (!successful) {
                $failflag = false;
            }
        }
        //  echo('fail flag is '.$failflag);
        return($failflag);
    }

    static public function deleteteam($team_id)
    {
        $thisteam = Doctrine::getTable('team')->find($team_id);
        try {
            $thisteam->delete();
            return(true);
        } catch (Exception $e) {
            fb("ERROR CAUGHT- cant delete this team($team_id)");
            fb('Caught exception: ' . $e->getMessage());
            return(false);
        }
    }

    /**
     * @desc get information about a particular team
     * @param $team_id
     * @return Array
     * @exception raised if supplied arg not found
     */
    static public function getinfo($team_id)
    {
        try {
            $thisteam = Doctrine_Query::create()
                            ->select('')
                            ->from('team t')
                            ->where('t.id = ?', $team_id)
                            ->fetchArray();
        } catch (Exception $e) {
            fb($e);
            return(null);
        }
        if (!count($thisteam)) {
            throw new ajaxfacadeException(AJAX_RETURN_BADREQUEST, "ERROR CAUGHT-   team id supplied, but doesnt exist");
            return(null);
        }
        $thisteam = $thisteam[0];
        return($thisteam);
    }

    /**
     * @desc simple setter of service_level, and admin level to a particular team
     * @param ($team_id,$service_level=null, $admin_level)
     * @return null if failed, true is successful
     */
    static public function setpermissions($team_id, $service_level=null, $admin_level=null)
    {
        self::updateteamadminstatus($admin_level, $service_level, $team_id);
    }

    static public function teamsbybloblist($blob_id_list, $timecode)
    {
        $blob_id_list = utilityclass::cast_as_array($blob_id_list);
        $thisteam = Doctrine_Query::create()
                        ->select('t.*')
                        ->from('team t')
                        ->leftJoin('t.blobteam b')
                        ->where('t.updated_at > ?', $timecode)
                        ->whereIn('b.blob_id', $blob_id_list)
                        ->fetchArray();
        return($thisteam);
    }

    static public function teamsbyrootlist($root_array, $timecode)
    {
        fb('starting teamsbyrootlist');
        $root_array = utilityclass::cast_as_array($root_array);
        $thisteam = Doctrine_Query::create()
                        ->select('t.*')
                        ->from('team t')
                        ->where('t.updated_at > ?', $timecode)
                        ->whereIn('t.space_id', $root_array)
                        ->fetchArray();
        return($thisteam);
    }

    /**
     * Given a team name and the space_id it belongs to, find the team_id.
     * @param <string> $teamname
     * @param <integer> $space_id
     * @return <integer> team_id
     */
    static public function getTeamIdByTeamNameSpaceId($teamname, $space_id)
    {
        $teamid_array = Doctrine_Query::create()
                        ->select('t.id')
                        ->from('team t')
                        ->where('t.team_name = ?', $teamname)
                        ->andWhere('t.space_id = ?', $space_id)
                        ->fetchArray();
        if (count($teamid_array)) {
            return($teamid_array[0]['id']);
        } else {
            return(NULL);
        }
    }

    public static function getTeamInfo($space_id)
    {
        // get all teams apart from 'personal teams'
        $teamlist = Doctrine_Query::create()
                        ->select("*")
                        ->from('team t')
                        ->where('t.space_id = ?', array($space_id))
                        ->fetchArray();
        return($teamlist);
    }

    /**
     * Get an array of spaces a given user can actively access.
     * @param <integer> $user_id
     * @return <array> scaler array of space_ids that are active for that user
     */
    static public function getSpaceIdListByUserId($user_id)
    {
        fb('getSpaceIdListByUserId started user id = ' . $user_id);
        try {
            $f = Doctrine_Query::create()
                            ->select('t.space_id, t.team_name')
                            ->from('team t')
                            ->leftJoin('t.teamuser u')
                            ->whereIn('t.team_name ', array('__active'))
                            ->andWhere('u.user_id = ?', ($user_id))
                            ->fetchArray();
        } catch (Exception $e) {
            return(array());
        }
        $myspaces = array();
        foreach ($f as $thisteam) {
            $myspaces[] = $thisteam['space_id'];
        }
        return(array_unique($myspaces));
    }

}

?>