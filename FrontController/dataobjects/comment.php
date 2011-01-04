<?php

class comment extends base_data_class
{

    public function setTableDefinition()
    {
        $this->hasColumn('title', 'string');
        $this->hasColumn('content', 'string');
        $this->hasColumn('owner_id', 'integer'); // OWNER
        $this->hasColumn('object_id', 'integer');
        $this->hasColumn('comment_parent_id', 'integer');
    }

    public function setUp()
    {
        $this->index('object_id', array('fields' => 'object_id'));

        $this->hasOne('objectblob', array('local' => 'object_id',
            'foreign' => 'object_id'
        ));
        parent::timeStampable(); // The updated at and created at fields..
    }

    static function savecomment($comment_parent_id, $parent_id, $thiscommentid, $content, $title, $login_id)
    {
        //fb("comment_parent_id : $comment_parent_id, parent_id $parent_id, thiscommentid  $thiscommentid ,  content $content ,  title $title ,  login_id $login_id");
        $commenttable = Doctrine::getTable('comment');
        // if this is a new comment, insert it as a child, otherwise just save it..
        if (('-1' == $thiscommentid)) {
            fb('new comment attempted creation');
            $thiscomment = new comment();
            $thiscomment->state('TDIRTY'); // save a blank comment
            $thiscomment->object_id = $parent_id; // link to a blob
            $thiscomment->owner_id = $login_id; // link to a blob
            // fb('attempt save comment..');
            try {
                $thiscomment->save();
                // fb('comment saved ok..');
            } catch (Exception $e) {
                //fb("ERROR CAUGHT- cant save this comment");
                // fb('Caught exception: '.  $e->getMessage());
                return(AJAX_RETURN_BADREQUEST);
            }
        } else {
            $thiscomment = $commenttable->find($thiscommentid);
        }
        // IF Comment is a new thread. hence set it's 'parent' to itself.
        //fb('comment parent id :'.$comment_parent_id);
        if ((-1 == $comment_parent_id)) {
            //fb(" IF Comment is a new thread. hence set it's 'parent' to itself.");
            //fb('so set it to '.$thiscomment->id);
            $thiscomment->comment_parent_id = $thiscomment->id;
        } else {
            // otherwise set to the parent passed in the arguments.
            $thiscomment->comment_parent_id = $comment_parent_id;
        }
        // adding some data
        // note can only edit title and content
        $thiscomment->title = $title;
        $thiscomment->content = $content;
        $thiscomment->save();
        return ( $thiscomment->toArray());
    }

    /**
     * @desc Simple getter for the blob_id associated with any given comment_id
     * @param a comment id
     * @return a blob id
     */
    public static function get_comment_parent_id($comment_id)
    {
        fb('starting get_comment_parent_id');
        $comment_parent_id = Doctrine_Query::create()
                        ->select('object_id')
                        ->from('comment')
                        ->where('id = ?', $comment_id)
                        ->fetchArray();
        if (count($comment_parent_id)) {
            return($comment_parent_id[0]['object_id']);
        } else {
            throw new ajaxfacadeException(AJAX_RETURN_BADREQUEST, "ERROR CAUGHT- comment id supplied, but doesnt exist");
        }
    }

    public static function getcommentsbybloblist($blob_ids, $timecode)
    {
        $blob_id_list = utilityclass::cast_as_array($blob_ids);
        $comment_list = Doctrine_Query::create()
                        ->select('c.*')
                        ->from('comment c')
                        ->leftJoin('c.objectblob b')
                        ->where('c.updated_at > ?', $timecode)
                        ->whereIn('b.object_id', $blob_id_list)
                        ->orderBy('c.updated_at DESC')
                        ->fetchArray();
        return($comment_list);
    }

}

?>