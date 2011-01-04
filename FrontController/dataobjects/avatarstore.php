<?php

class avatarstore extends base_data_class
{

    public function setTableDefinition()
    {
        $this->hasColumn('attribute_id', 'integer');
        $this->hasColumn('filename', 'string');
        $this->hasColumn('storename', 'string');
        $this->hasColumn('filetype', 'string');
        $this->hasColumn('trans_id', 'string');
        $this->hasColumn('currsize', 'string');
        $this->hasColumn('totalsize', 'string');
        $this->hasColumn('thumbnailable', 'string');
    }

    public function setUp()
    {
        parent::timeStampable(); // The updated at and created at fields..
        $this->hasOne('userattributes', array(
            'local' => 'attribute_id',
            'foreign' => 'id'
        ));
    }

    public static function createAvatarstoreRecord($attribute_id, $storename, $filename, $file_type, $trans_id)
    {
        $t = new avatarstore();
        $t->attribute_id = $attribute_id;
        $t->storename = $storename;
        $t->filename = $filename;
        $t->filetype = $file_type;
        $t->trans_id = $trans_id;
        $t->currsize = 0;
        $t->totalsize = -1;
        $t->thumbnailable = UNVERIFIED;
        $t->save();
        return ($t);
    }

    /**
     * Given the trans_id, return the record along with a status value indicating the upload status.
     * @param <string> $trans_id
     * @return <array> table record plus
     */
    public static function checkAvatarStatus($trans_id)
    {
        $avatar_arr = Doctrine_Query::create()
                        ->select('*')
                        ->from('avatarstore a')
                        ->where('a.trans_id = ?', $trans_id)
                        ->fetchArray();
        $avatar_arr[0]['status'] = 'not_loaded';
        if (count($avatar_arr) > 0) {
            if ($avatar_arr[0]['currsize'] !== $avatar_arr[0]['totalsize']) {
                $avatar_arr[0]['status'] = 'loading';
            } else {
                $avatar_arr[0]['status'] = 'active';
            }
        }
        return ($avatar_arr);
    }

    public static function updateFileSizeByTrans($file_type, $trans_id, $total_size, $curr_size)
    {
        $curr_size = (isset($curr_size)) ? $curr_size : -1;
        $total_size = (!isset($total_size)) ? -1 : ($total_size != $curr_size) ? -1 : $total_size;

        $q = Doctrine_Query::create()
                        ->update('avatarstore')
                        ->set('currsize', '?', $curr_size)
                        ->set('totalsize', '?', $total_size)
                        ->set('updated_at', '?', time())
                        ->where('trans_id = ?', $trans_id)
                        ->andWhere('filetype = ?', $file_type);
        $count = $q->execute();
        if ($count > 0 AND $total_size != 0 AND $curr_size == $total_size) {
            $token_arr = uploadtoken::getTokenByTransId($trans_id);
            userattributes::updateAttributeStatus($token_arr['user_id'], 'avatar_file', $trans_id, VERIFIED, ACTIVE);
            uploadtoken::delTokenByTransId($trans_id);
        }
    }

    public static function updateThumbnailStatus($trans_id, $status)
    {
        $q = Doctrine_Query::create()
                        ->update('avatarstore')
                        ->set('thumbnailable', '?', $status)
                        ->set('updated_at', '?', time())
                        ->where('trans_id = ?', $trans_id);
        $count = $q->execute();
    }

    public static function outputAvatarThumb($trans_id, $width, $height)
    {
        $avatarstore_arr = avatarstore::checkAvatarStatus($trans_id);
        if ($avatarstore_arr[0]['status'] != 'active' || $avatarstore_arr[0]['thumbnailable'] == INACTIVE) {
            return(FALSE);
        }
        $filename = $avatarstore_arr[0]['storename'];
        $publicfilename = $avatarstore_arr[0]['filename'];
        $thumbname = utilityclass::checkThumb($filename, $width, $height);
        if ($thumbname) {
            if ($avatarstore_arr[0]['thumbnailable'] == UNVERIFIED) {
                self::updateThumbnailStatus($trans_id, ACTIVE);
            }
            utilityclass::outputfile($publicfilename, $thumbname, FALSE);
        } else {
            self::updateThumbnailStatus($trans_id, INACTIVE);
        }
    }

}

?>
