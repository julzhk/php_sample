<?php

/**
 * A CONTROLLER to handle the ajax part of the templates.
 * @package ajaxfacade
 * @version 1.0
 */
class ajaxfacade extends abstractfacade
{
    /**
     * @category Utility Methods
     * */

    /**
     * a private method that actually does the mapping to an object of the data sent here by a js form
     * illegal fields are ignored (c.f: doctrine's merge, or map functions that are fussy..
     */
    private static function maprequest($thisobject)
    {
        $r = utilityclass::maprequest($thisobject);
        return ($r);
    }

    /**
     * @category AJAXfacade Methods
  
     * Create and save an object - called from a front end ajax form
     *
     */
    public function saveblob()
    {
        fb('save blob started');
        $this_id = $this->request->getProperty('object_id');
        $this_parent = $this->request->getProperty('parent_id');
        if (utilityclass::missingvalues(array($this_id))) {
            $this->error = new jsonerror(AJAX_ARGUMENT_MISSING);
        } else {
            $user_id = utilityclass::getcookie_id();
            permissioncheck::createblobpermitted($this_parent, $this_id);
            $this_id = ( objectblob::saveblob($this_id, $this_parent, null, $user_id));
            fb('the new blob id has been created with an id of  ' . $this_id);
            self::userdata();
        }
    }

    /**
     * This is used for saving a new comment or a new comment conversation.
     * */
    public function savecomment()
    {
        $comment_parent_id = $this->request->getProperty('comment_parent_id');  //y
        $parent_id = $this->request->getProperty('parent_id');  //y
        $thiscommentid = $this->request->getProperty('comment_id'); //y
        $content = $this->request->getProperty('content'); //yy
        $title = $this->request->getProperty('title');
        $login_id = utilityclass::getcookie_id();
        fb('parent id: ' . $parent_id);
        fb('comment_parent_id: ' . $comment_parent_id);
        permissioncheck::savecommentpermitted($parent_id, $comment_parent_id);
        if (utilityclass::missingvalues(array($comment_parent_id, $parent_id, $content, $login_id))) {
            fb('cant save the comment - not enough arguments');
            $this->error = new jsonerror(AJAX_ARGUMENT_MISSING);
        } else {
            $output = comment::savecomment($comment_parent_id, $parent_id, $thiscommentid, $content, $title, $login_id);
            self::userdata();
        }
    }

    /**
     * This is used to save the Object Update.
     * */
    public function savetaskscrum()
    {
        $supplieddata = $this->request->getallproperties();
        fb('ajax facade: save task scrum started');
        fb($supplieddata);
        $supplieddata['object_id'] = $supplieddata['parent_id'];
        fb('fix the data a bit for task scrum started');
        fb($supplieddata);
        permissioncheck::savetaskscrumpermitted($supplieddata['object_id']);
        if ((!array_key_exists('work_remain', $supplieddata)) OR utilityclass::missingvalues(array($supplieddata['parent_id'], $supplieddata['work_remain']))) {
            fb('error - missing arguments');
            $this->error = new jsonerror(AJAX_ARGUMENT_MISSING);
        } else {
            $user_id = utilityclass::getcookie_id();
            $supplieddata['owner_id'] = $user_id;
            fb(' do a save of the task scrum..');
            $result = taskscrum::savetaskscrum($supplieddata);
            self::userdata();
        }
    }

    /**
     * This is used to create a schedule link relationship between two objects.
     * */
    public function savelink()
    {
        fb('ajaxfacade savelink started');
        $start_object_id = $this->request->getProperty('start_object_id');
        $end_object_id = $this->request->getProperty('end_object_id');
        $reltype = $this->request->getProperty('relationship_type');
        $creator_id = utilityclass::getcookie_id();
        permissioncheck::addlinkpermitted($start_object_id, $end_object_id);
        if (utilityclass::missingvalues(array($start_object_id, $end_object_id, $reltype))) {
            $this->error = new jsonerror(AJAX_ARGUMENT_MISSING);
        } else {
            $result = schedulelinks::savelink($start_object_id, $end_object_id, $reltype, $creator_id);
            self::userdata();
        }
    }

    /**
     * This is used to delete a schedule link relationship.
     * */
    public function dellink()
    {
        $link_id = $this->request->getProperty('link_id');
        permissioncheck::dellinkpermitted($link_id);
        if (utilityclass::missingvalues(array($link_id))) {
            $this->error = new jsonerror(AJAX_ARGUMENT_MISSING);
        } else {
            $result = schedulelinks::dellink($link_id);
            self::userdata();
        }
    }

    /**
     * the main file upload ajax handler
     */
    public function savefile()
    {
        fb('file upload ajax facade called');
        $file_id = $this->request->getProperty('file_id');
        $object_id = $this->request->getProperty('parent_id');
        $description = $this->request->getProperty('description');
        $title = $this->request->getProperty('title');
        $trans_id = $this->request->getProperty('trans_id');
        $submission_status = $this->request->getProperty('submission_status');
        if (utilityclass::missingvalues(array($object_id))) {
            $this->error = new jsonerror(AJAX_ARGUMENT_MISSING);
        } else {
            permissioncheck::savefilepermitted($object_id);
            $result = fileobject::saveFileEntry($title, $description, $submission_status, $trans_id, $file_id);
            // now check to see if the 'submit for review' checkbox was checked
            if (!is_null($submission_status)) {
                //create an approval chain for this file
                approvalchain::initialize_chain($result['new_file_id'], $submission_status);
            }
            self::userdata();
        }
    }

    public function getfilethumbnail()
    {
        fb('get file thumbnail ajax facade called');
        $file_id = $this->request->getProperty('file_id');
        $filetype = $this->request->getProperty('file_type');
        fb($file_id . ' is the file id');
        fb($filetype . ' is the file type');
        $user_id = utilityclass::getcookie_id();
        // only types of files allowed..
        fb($user_id . ' is the usre id');
        $filetypeok = in_array($filetype, array('main', 'proof', 'avatar'));
        if ($filetypeok AND utilityclass::missingvalues(array($user_id, $file_id))) {
            $this->error = new jsonerror(AJAX_ARGUMENT_MISSING);
        } else {
            fb('facade passed, now get thumbnail');
            $result = fileobject::getthumbnailfile($user_id, $filetype, $file_id);
        }
    }

    /**
     * This sets up a file stream for downloading a file based on the provided file id.
     * */
    public function getfilebyfileid()
    {
        $file_object_id = $this->request->getProperty('file_id');
        $file_type = $this->request->getProperty('file_type');
        if (utilityclass::missingvalues(array($file_object_id))) {
            $this->error = new jsonerror(AJAX_ARGUMENT_MISSING);
        } else {
            permissioncheck::getfilepermitted($file_object_id);
            $result = fileobject::getFilebyFileId($file_type, $file_object_id);
            //This needs to return a file stream, not JSON.
        }
    }

    /**
     * This fetches and streams the Proof file for a given file id.
     * */
    public function getprooffilebyfileid()
    {
        $file_object_id = $this->request->getProperty('file_id');
        if (utilityclass::missingvalues(array($file_object_id))) {
            $this->error = new jsonerror(AJAX_ARGUMENT_MISSING);
        } else {
            permissioncheck::getfilepermitted($file_object_id);
            $result = fileobject::getFilebyFileId('preview_filename', $file_object_id);
            //This needs to return a file stream, not JSON.
        }
    }

    /**
     * delete user cookie
     */
    public function logout()
    {
        fb('ajax logout called');
        user::logoutuser();
        fb('log out done - from ajaxfacade');
    }

    /**
     * Used to assign a tag value to an object.
     * */
    public function savetag()
    {
        fb('ajx savetag');
        $tagvalue = $this->request->getProperty('tag_value');
        $blob_id = $this->request->getProperty('parent_id');
        $tagname = $this->request->getProperty('tag_name');
        $creator_id = utilityclass::getcookie_id(); // gets my user id.
        if (utilityclass::missingvalues(array($tagname, $blob_id, $creator_id))) {
            $this->error = new jsonerror(AJAX_ARGUMENT_MISSING);
        } else {
            permissioncheck::createtagpermitted();
            $result = tag::createtag($tagname, $tagvalue, $blob_id, $creator_id);
            self::userdata();
        }
    }

    /**
     * Used to delete a tag value from an object id.
     * */
    public function deletetagsbyTagId()
    {
        fb('ajx deletetagsbyObjectId');
        $tag_id = $this->request->getProperty('tag_id');
        if (utilityclass::missingvalues(array($tag_id))) {
            $this->error = new jsonerror(AJAX_ARGUMENT_MISSING);
        } else {
            permissioncheck::deletetagpermitted($tag_id);
            $result = tag::deletetagsbyTagId($tag_id);
            self::userdata();
        }
    }

    public function testmethod()
    {
        $result = array(
            "object_id" => '1',
            "space_id" => '2',
            "array_data" => array(2, 4, 6),
            "content" => '4'
        );
        $this->output = $this->outputjson($result);
    }

    /**
     * Move an object based on the sent object ids.
     * @return <JSON> Standard return of userdata.
     */
    public function moveobject()
    {
        fb('starting moveobject');
        $object_id = $this->request->getProperty('object_id');
        $parent_id = $this->request->getProperty('parent_id');
        $sibling_id = $this->request->getProperty('sibling_id'); //can be null.
        $target_object = $parent_id;
        if ($target_object == -1) {
            $target_object = $sibling_id;
        }
        if (utilityclass::missingvalues(array($object_id, $target_object))) {
            $this->error = new jsonerror(AJAX_ARGUMENT_MISSING);
            return(0);
        } else {
            $object_array = explode(",", $object_id);
            //Making sure there are no empty index spots.
            reset($object_array);
            //Flipping so that the last picked element will wind up on the bottom, etc.
            array_reverse($object_array);
            foreach ($object_array as $object_id) {
                permissioncheck::moveObjectPermitted($object_id, $target_object);
                if ($parent_id == -1) {
                    $result = objectblob::reorderblobtreebysibling_id($object_id, $sibling_id);
                } else {
                    $result = objectblob::reorderblobtreebyparent_id($object_id, $parent_id);
                }
            }
        }
        if (!$result) {
            $this->error = new jsonerror(AJAX_RETURN_BADREQUEST);
            return(0);
        }
        self::userdata();
    }

    /**
     * Save a file approval update.
     */
    public function approval()
    {
        $status = $this->request->getProperty('status');
        $user_id = $this->request->getProperty('user_id');
        if (utilityclass::missingvalues(array($status, $user_id))) {
            $this->error = new jsonerror(AJAX_ARGUMENT_MISSING);
        } else {
            $result = approvalchain::approval($status, $user_id);
            $this->output = $this->outputjson($result);
        }
    }

    /**
     * Retrieve all up to date user data based on the time of the last information received.
     */
    public function userdata()
    {
        $timecode = $this->request->getProperty('t_c');
        $user_id = utilityclass::getcookie_id();
        $data = user::user_initial_data($user_id, $timecode);
        $this->output = $this->outputjson($data, 'mapped_data');
    }

    /**
     * Save a placeholder file upload token.
     */
    public function savefileuploadtoken()
    {
        $user_id = utilityclass::getcookie_id();
        $trans_id = $this->request->getProperty('trans_id');
        $object_id = $this->request->getProperty('object_id');
        if (utilityclass::missingvalues(array($trans_id, $object_id))) {
            $this->error = new jsonerror(AJAX_ARGUMENT_MISSING);
            $r = array('success' => 'missing args', "tid" => NULL);
        } else {
            // check permissions
            permissioncheck::savefilepermitted($object_id);
            $file_id = fileobject::createFileEntry($object_id, $user_id, $trans_id);
            $tid = uploadtoken::saveFileUploadToken($trans_id, $file_id);
            $r = array("tid" => $tid);
            self::userdata();
        }
    }

    public function cloneblob()
    {
        $source_id = $this->request->getProperty('source_id');
        $destination_id = $this->request->getProperty('destination_id');
        $user_id = utilityclass::getcookie_id();
        if (utilityclass::missingvalues(array($source_id, $destination_id))) {
            $this->error = new jsonerror(AJAX_ARGUMENT_MISSING);
        } else {
            $result = objectblob::cloneblob($source_id, $destination_id);
            self::userdata(false);
        }
    }

}

?>