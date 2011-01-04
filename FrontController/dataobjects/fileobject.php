<?php

class fileobject extends base_data_class
{
    public function setTableDefinition()
    {
        $this->hasColumn('title', 'string');
        $this->hasColumn('description', 'string');
        $this->hasColumn('submission_status', 'string');
        $this->hasColumn('owner_id', 'integer');
        $this->hasColumn('object_id', 'integer');
        $this->hasColumn('version', 'integer');
        $this->hasColumn('root_id', 'integer');
        $this->hasColumn('trans_id', 'string');
    }

    public function setUp()
    {
        parent::timeStampable(); // The updated at and created at fields..
        $this->hasOne('objectblob', array('local' => 'object_id',
            'foreign' => 'object_id'
        ));
        $this->hasMany('approvalchain', array('local' => 'id',
            'foreign' => 'fileobject_id',
        ));
        $this->hasMany('filestore', array('local' => 'id',
            'foreign' => 'file_id',
        ));
    }

    public function construct()
    {
        // $cloudhandler= cloudhandler::getInstance();
        fb('initialize fileobject');
    }

    /**
     * Instantiate a placeholder file object.
     * @param <integer> $object_id
     * @param <integer> $user_id
     * @param <string> $trans_id
     * @return <integer> New file id.
     */
    public static function createFileEntry($object_id, $user_id, $trans_id)
    {
        //Check to make sure this isn't a duplicate - only one trans_id is allowed.
        $existing_file = Doctrine_Query::create()
                        ->select('s.id')
                        ->from('fileobject s')
                        ->where('s.trans_id = ?', $trans_id)
                        ->fetchArray();
        if (count($existing_file)) {
            return ($existing_file[0]['id']);
        }
        $t = new fileobject();
        $t->owner_id = $user_id;
        $t->trans_id = $trans_id;
        $t->object_id = $object_id;
        $t->save(); //this generates us an id
        return ($t->id);
    }

    private static function getCurrFileVersion($root_id)
    {
        fb('starting getCurrFileVersion');
        $q = Doctrine_Query::create()
                        ->select('MAX(f.version)')
                        ->from('fileobject f')
                        ->where('f.root_id = ?', $root_id)
                        ->fetchArray();
        return ($q[0]['MAX']);
    }

    public static function getFileByTransId($trans_id)
    {
        fb('starting getFileByTransId');
        $q = Doctrine_Query::create()
                        ->select('')
                        ->from('fileobject f')
                        ->where('f.trans_id = ?', $trans_id)
                        ->fetchArray();
        return ($q[0]);
    }

    /**
     * This updates a placeholder file entry with the file details.
     * @param <string> $title
     * @param <string> $description
     * @param <string> $submission_status
     * @param <string> $trans_id
     * @param <integer> $root_id
     * @return <integer> Number of updated records.
     */
    public static function saveFileEntry($title, $description, $submission_status, $trans_id, $root_id)
    {
        fb('starting saveFileEntry');
        fb('trans id is ' . $trans_id);
        $file_arr = self::getFileByTransId($trans_id);
        fb($title);
        fb($description);
        fb($submission_status);
        if (isset($root_id) && !is_null($root_id) && -1 != $root_id) {
            fb('is new version');
            $version = self::getCurrFileVersion($root_id) + 1;
        } else {
            fb('is new file');
            $version = 1;
            $root_id = $file_arr['id'];
        }
        if (!isset($submission_status) || is_null($root_id)) {
            $submission_status = FALSE;
        }
        fb($root_id);
        fb($version);

        $q = Doctrine_Query::create()
                        ->update('fileobject')
                        ->set('title', '?', $title)
                        ->set('description', '?', $description)
                        ->set('version', '?', $version)
                        ->set('root_id', '?', $root_id)
                        ->set('submission_status', '?', $submission_status)
                        ->where('trans_id = ?', $trans_id);
        $count = $q->execute();
        fb('updated ' . $count . ' files');
        return ($count);
    }

    public static function createThumbnail($origin_name, $prefix=NULL, $thumbsize = 50)
    {
        // moved..
        return(utilityclass::createThumbnail($origin_name, $prefix, $thumbsize));
    }

    public static function getfilelistbybloblist($object_id_array, $timecode)
    {
        fb('starting getfilelistbybloblist');
        $object_id_array = utilityclass::cast_as_array($object_id_array);
        $filelistArray = Doctrine_Query::create()
                        ->select('*')
                        ->from('fileobject s')
                        ->where('s.updated_at > ?', $timecode)
                        ->andWhere('s.root_id > 0')
                        ->whereIn('s.object_id', $object_id_array)
                        ->orderBy('s.updated_at DESC')
                        ->fetchArray();
        return($filelistArray);
    }

    public static function getfilelistbyrootlist($root_array, $timecode)
    {
        fb('starting getfilelistbyrootlist');
        $root_array = utilityclass::cast_as_array($root_array);
        $filelistArray = Doctrine_Query::create()
                        ->select('*')
                        ->from('fileobject s')
                        ->leftJoin('s.objectblob b')
                        ->where('s.updated_at > ?', $timecode)
                        ->andWhere('s.root_id > 0')
                        ->whereIn('b.root_id', $root_array)
                        ->orderBy('s.updated_at DESC')
                        ->fetchArray();
        return($filelistArray);
    }

    public static function getFilebyFileId($filetype, $file_id)
    {
        fb('starting getFilebyFileId(' . $filetype . ', ' . $file_id . ')');
        $store_arr = filestore::getFileInfoByFileIdAndFiletype($file_id, $filetype);
        fb($store_arr);
        $publicfilename = $store_arr[0]['filename'];
        $privatefilename = $store_arr[0]['storename'];
        $result = utilityclass::outputfile($publicfilename, $privatefilename, TRUE);
        return($result);
    }

    public static function getSpaceIdByTransId($trans_id)
    {
        $file_arr = Doctrine_Query::create()
                        ->select('b.root_id as space_id')
                        ->from('fileobject s')
                        ->leftJoin('s.objectblob b')
                        ->where('s.trans_id = ?', $trans_id)
                        ->fetchArray();
        $space_id = (count($file_arr) > 0) ? $file_arr['space_id'] : -1;
        return($space_id);
    }

    /**
     * @desc Simple getter for the blob_id associated with any given file_id
     * @param a file id
     * @return a blob id
     */
    public static function get_blob_id($file_id)
    {

        $file_parent_id = Doctrine_Query::create()
                        ->select('object_id')
                        ->from('fileobject')
                        ->where('id = ?', $file_id)
                        ->fetchArray();
        if (count($file_parent_id)) {
            return($file_parent_id[0]['object_id']);
        } else {
            throw new ajaxfacadeException(AJAX_RETURN_BADREQUEST, "ERROR CAUGHT- file id supplied, but doesnt exist");
        }
    }

//MOVED ~
    static function managethumbnail($trans_id, $file_type)
    {
        return(utilityclass::managethumbnail($trans_id, $file_type));
    }

    static function filetypeallowed($file_type)
    {
        self::writelog('filetypeallowed started for ' . $thistype);
        $allowedtypes = array('tif', 'tiff', 'jpeg', 'jpg', 'gif');
        foreach ($allowedtypes as $thistype) {
            if (strpos($file_type, $thistype) !== FALSE) {
                self::writelog('filetypeallowed ALLOWED');
                return(TRUE);
            }
        }
        return(FALSE);
    }

    static function getthumbnailfile($user_id, $filetype, $file_id)
    {
        // check user is permitted to access this file
        $my_user_id = utilityclass::getcookie_id();
        $allowed = permissioncheck::userssharespace($user_id, $my_user_id);
        if (!$allowed) {
            return(NULL);
        }
        //look up fileobject record.
        // $filetype = main_thumb_src | proof_thumb_src
        fb(" getthumbnailfile($user_id, $filetype, $file_id) started");
        $fileobjectarray = Doctrine_Query::create()
                        ->select('f.id, f.trans_id, f.object_id,f.proof_filename,f.main_filename')
                        // ->select( )
                        ->from('fileobject f')
                        ->where('f.id = ?', $file_id)
                        ->fetchArray();
        fb($fileobjectarray);
        if (!count($fileobjectarray)) {
            fb('no file record');
            return (NULL);
        } else {
            fb('serve file');
            $object_blob_id = $fileobjectarray[0]['object_id'];
            permissioncheck::getfilepermitted($object_blob_id);
            $trans_id = $fileobjectarray[0]['trans_id'];
            ////709352649e7f36e797542b0755482502_proof_file_thmb
            $privatefilename = $trans_id . '_' . $filetype . '_file_thmb';
            fb('$privatefilename ' . $privatefilename);
            $filesize = 0; //filestore::getfilesize($trans_id,$filetype.'_file');
            if ($filetype == 'proof') {
                $publicfilename = $fileobjectarray[0]['proof_filename'];
            } else {
                $publicfilename = $fileobjectarray[0]['main_filename'];
            }
            if (!strlen($publicfilename)) {
                $publicfilename = DEFAULT_FILE_NAME;
            }
            // echo($publicfilename.','. $privatefilename .','. $filesize);
            self::outputfile($publicfilename, $privatefilename);
        }
    }

    public static function recordnewthumbnail($trans_id, $file_type)
    {
        // thumb filename format
        // 3135812ee46787bcef670599bd5375c4_proof_file_thmb
        fileobject::writelog('__recordnewthumbnail started');
        fileobject::writelog('trans ' . $trans_id);
        fileobject::writelog('file ttype ' . $file_type);
        $f = new uploadtoken();
        $f->trans_id = $trans_id;
        $thumbfilename = $trans_id . '_' . $file_type . '_thmb';
        $f->filename = $thumbfilename;
        $thumbfilesize = filesize(THUMBNAIL_UPLOAD_FOLDER . $thumbfilename);
        $f->totalsize = $thumbfilesize;
        $f->currentsize = $thumbfilesize;
        $f->object_id = NULL;
        $f->save();
    }

}

?>