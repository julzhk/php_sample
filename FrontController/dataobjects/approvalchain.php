<?php

class approvalchain extends base_data_class
{

    public static $my_class_type;

    public function setTableDefinition()
    {
        parent::setTableDefinition();
        $this->hasColumn('fileobject_id', 'integer');
        $this->hasColumn('status', 'string');
        $this->hasColumn('approver_user_id', 'string');
        $this->hasColumn('user_id', 'string');
        $this->hasColumn('approved_at', 'integer');
        $this->hasColumn('active_at', 'integer');
        $this->hasColumn('late_at', 'integer');
        $this->hasColumn('team_id', 'integer');
        $this->hasColumn('space_id', 'integer');
        $this->hasColumn('template_step_id', 'integer');
    }

    public function setUp()
    {

        $this->hasOne('team', array('local' => 'team_id',
            'foreign' => 'id',
        ));
        $this->hasOne('fileobject', array('local' => 'fileobject_id',
            'foreign' => 'id',
        ));

        parent::timeStampable(); // The updated at and created at fields..
        $options = array('hasManyRoots' => true, // enable many roots
            'rootColumnName' => 'root_id');  // set root column name, defaults to 'root_id'
        $this->actAs('NestedSet', $options);
    }

    public static function getapprovalchaininfo($chain_id)
    {
        //   echo(' started...');

        $t = Doctrine_Query::create()
                        ->select("*")
                        ->from("approvalchain a")
                        // ->leftJoin("a.team t")
                        ->where('a.root_id = ?', array($chain_id))
                        ->orderBy('level asc')
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                        ->execute();
        if (count($t)) {
            return ($t);
        } else {
            return (null);
        }
    }

    public static function getfirstapprovalstep($chain_id)
    {
        $t = Doctrine_Query::create()
                        ->select("a.id,a.lft,a.rgt,a.root_id")
                        ->from("approvalchain a")
                        // ->leftJoin("a.team t")
                        ->where('a.root_id = ?', $chain_id)
                        ->addWhere('a.lft =?', '2')
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                        ->execute();
        if (count($t)) {
            return ($t[0]);
        } else {
            return(NULL);
        }
    }

    private static function do_clone($this_approvalchaintemplate_array, $root_id, $file_id)
    {
        $t = new approvalchain();
        $fields_to_clone = array('team_id', 'space_id', 'lft', 'rgt', 'level', 'user_id');
        foreach ($fields_to_clone as $this_key) {
            $t->$this_key = $this_approvalchaintemplate_array[$this_key];
            $t->fileobject_id = $file_id;
        }
        if (is_null($root_id)) {
            //if root is not sent, then this is root!
            $t->save();
            $t->root_id = $t->id;
        } else {
            $t->root_id = $root_id;
        }
        $t->template_step_id = $this_approvalchaintemplate_array['id'];
        $t->save();
        return($t->id);
    }

    public static function initialize_chain($file_id, $approval_chain_template_id)
    {
        $approvalchaintemplate_array = approvalchaintemplate::getfullapprovalchaintemplateinfo($approval_chain_template_id);
        $root_id = NULL;
        foreach ($approvalchaintemplate_array as $this_approvalchaintemplate_array) {
            $this_id = self::do_clone($this_approvalchaintemplate_array, $root_id, $file_id);
            if (is_null($root_id)) {
                $root_id = $this_id;
            }
        }
        self::first_approval_initialize($root_id);
    }

    private static function first_approval_initialize($root_id)
    {
        //now kick off first approval request
        $firstapprovalstep_array = self::getfirstapprovalstep($root_id);
        $firstapprovalnodes = self::get_nodes_from_step(
                        $firstapprovalstep_array['root_id'],
                        $firstapprovalstep_array['lft'],
                        $firstapprovalstep_array['rgt']
        );
        self::notifynodes($firstapprovalnodes);
        return(TRUE );
    }

    public static function notifyowner(approvalchain $approvalchain_obj, $message)
    {
        fb($approvalmessage);
        $emailer = new emailhandler();
        $emailer->setmessage($approvalmessage);
        $thisfile_id = $approvalchain_obj->fileobject_id;
        $fileobject_array = fileobject::getFilebyFileId($thisfile_id);
        $file_owner_id = $fileobject_array['owner_id'];
        $this_user_array = user::getuserdetailbyUserId($this_node['user_id']);
        $emailer->addaddress($this_user_array['email'], $this_user_array['first_name'] . $this_user_array['last_name']);
        $approvalmessage = file_get_contents(RELATIVEPATH . 'staticpages/' . $message);
        $approval_name = 'approval file name'; // swap in real value
        $approval_name2 = 'approval file2 person'; // swap in real value
        $approvalmessage = sprintf($approval_name, $approval_name2); // drops in the token into the message. (see %s )
        $emailer->send();
    }

    public static function notifynodes($nodelist_array)
    {
        $emailer = new emailhandler();
        $approvalmessage = file_get_contents(RELATIVEPATH . 'staticpages/approvalemail.html');
        $approval_name = 'approval file';
        $approvalmessage = sprintf($approval_name); // drops in the token into the message. (see %s )
        fb($approvalmessage);
        $emailer->setmessage($approvalmessage);
        foreach ($nodelist_array as $this_node) {
            // is the user a distribution person?
            // if so, send em a file link,
            // else
            // send a message saying they are required to do smthing.
            if ($this_node['user_id']) {
                // this is a person, not a team
                $this_user_array = user::getuserdetailbyUserId($this_node['user_id']);
                $emailer->addaddress($this_user_array['email'], $this_user_array['first_name'] . $this_user_array['last_name']);
            } else {
                $team_members = team::getteammember_info($this_node['team_id']);
                foreach ($team_members as $this_team_member) {
                    $emailer->addaddress($this_team_member['email'], $this_team_member['first_name'] . $this_team_member['last_name']);
                }
            }
        }
        $emailer->send();
        // create email for that user.
    }

    public static function get_nodes_from_step($step_root, $step_lft, $step_rgt)
    {
        $t = Doctrine_Query::create()
                        ->select("*")
                        ->from("approvalchain a")
                        ->where('a.root_id = ?', $step_root)
                        ->addWhere('a.lft > ?', $step_lft)
                        ->addWhere('a.lft < ?', $step_rgt)
                        // ->addWhere('a.status = ?', $status) ->addwhere('s.root_id IS NULL')
                        ->orderBy('a.lft')
                        ->fetchArray();
        if (count($t)) {
            return ($t);
        } else {
            return (null);
        }
    }

    public static function get_active_nodes_from_step($step_root, $step_lft, $step_rgt)
    {

        $t = Doctrine_Query::create()
                        ->select("*")
                        ->from("approvalchain a")
                        ->where('a.root_id = ?', $step_root)
                        ->addWhere('a.lft > ?', $step_lft)
                        ->addWhere('a.lft < ?', $step_rgt)
                        ->addWhere('a.status IS NULL')
                        ->orderBy('a.lft')
                        ->fetchArray();
        if (count($t)) {
            return ($t);
        } else {
            return (null);
        }
    }

    public static function approval_received($approval_id, $approval_status)
    {
        $thisapproval_obj = Doctrine::getTable('approvalchain')->find($approval_id);
        // now lets check siblings
        if ($approval_status == 'approved') {
            $r = self::positive_approval_received($thisapproval_obj);
        } else {
            $r = self::negative_approval_received($thisapproval_obj);
        }
        return($r);
    }

    private static function positive_approval_received(approvalchain $thisapproval_obj)
    {
        self::set_approval($thisapproval_obj, 'approved');  // now lets check siblings
        $this_parent_obj = $thisapproval_obj->getNode()->getParent();
        $node_array = self::get_active_nodes_from_step($this_parent_obj->root_id, $this_parent_obj->lft, $this_parent_obj->rgt);
        if (!$node_array) {
            // All nodes in this step are done now!
            // so set the step to 'done' too.
            self::set_approval($this_parent_obj, 'approved');
            self::startnextstep($this_parent_obj);
        }
    }

    public static function negative_approval_received(approvalchain $thisapproval_obj)
    {
        self::notifyowner($thisapproval_obj, 'ownerstep_completed_approvalemail.html');
        self::set_approval($thisapproval_obj, 'not approved');
        // mark the approval chain root to unapproved.
        $this_parent_obj = $thisapproval_obj->getNode()->getParent();
        if ($thisapproval_obj->level == 0) {
            return(TRUE);
        }
        self::set_approval($this_parent_obj, 'not approved');
        if ($this_parent_obj->level == 0) {
            return(TRUE);
        }
        // now set the approval tree root to not unapproved.
        $this_root_obj = $this_parent_obj->getNode()->getParent();
        self::set_approval($this_root_obj, 'not approved');
    }

    private static function set_approval(approvalchain $thisapproval_obj, $status)
    {
        $thisapproval_obj->status = $status;
        $thisapproval_obj->approved_at = time();
        $thisapproval_obj->approver_user_id = utilityclass::getcookie_id();
        $thisapproval_obj->save();
        return($thisapproval_obj);
    }

    private static function any_noncompletepreviousapprovals(approvalchain $this_approval_obj)
    {
        $t = Doctrine_Query::create()
                        ->select("*")
                        ->from("approvalchain a")
                        ->where('a.root_id = ?', $this_approval_obj->root_id)
                        ->addWhere('a.lft < ?', $this_approval_obj->lft)
                        ->addWhere('a.level > ?', '0')
                        ->addWhere('a.status IS NULL')
                        ->execute();
        if (count($t)) {
            return (TRUE);
        } else {
            return (FALSE);
        }
    }

    public static function startnextstep(approvalchain $this_approval_obj)
    {
        // get any prev siblings (ie steps) that are not done yet..
        if (self::any_noncompletepreviousapprovals($this_approval_obj)) {
            // if any.. then mark this done , but don't start next step..
            // otherwise, carry on!
        } else {
            $nextStep_obj = $this_approval_obj->getNode()->getNextSibling();
            // if there is no next step then we are done with this approval!
            // mark file as approved!
            // otherwise, notify the next steps ppl
            $approvalnodes_array = self::get_nodes_from_step(
                            $nextStep_obj->root_id,
                            $nextStep_obj->lft,
                            $nextStep_obj->rgt
            );
            self::notifynodes($approvalnodes_array);
            self::notifyowner($this_approval_obj, 'ownerstep_completed_approvalemail.html');
        }
    }

    public static function getapprovalchainlistbybloblist($this_blob_id_list, $timecode)
    {
        if (count($this_blob_id_list) == 0) {
            return(array());
        }
        $this_blob_id_list = utilityclass::cast_as_array($this_blob_id_list);
        try {
            $approval_array = Doctrine_Query::create()
                            ->select()
                            ->from('approvalchain a')
                            ->leftJoin('a.fileobject f')
                            ->whereIn(' f.object_id', $this_blob_id_list)
                            ->where('a.updated_at > ?', $timecode)
                            ->fetchArray();
            return($approval_array);
        } catch (Exception $e) {
            throw new ajaxfacadeException(AJAX_RETURN_BADREQUEST, "ERROR CAUGHT- approval chains? ");
            return(array());
        }
    }

    public static function getapprovalchainlistbyrootlist($root_array, $timecode)
    {
        fb('getapprovalchainlistbyrootlist');
        $root_array = utilityclass::cast_as_array($root_array);
        $approval_array = Doctrine_Query::create()
                        ->select("*")
                        ->from('approvalchain a')
                        ->whereIn('a.space_id', $root_array)
                        ->where('a.updated_at > ?', $timecode)
                        ->fetchArray();
        return($approval_array);
    }

}

?>