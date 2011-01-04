<?php

class taskscrum extends base_data_class
{

    public function setTableDefinition()
    {
        $this->hasColumn('work_done', 'integer');
        $this->hasColumn('work_remain', 'integer');
        $this->hasColumn('work_done_desc', 'string');
        $this->hasColumn('work_next_desc', 'string');
        $this->hasColumn('issue_desc', 'string');
        $this->hasColumn('object_id', 'integer');
        $this->hasColumn('owner_id', 'integer');
        $this->hasColumn('work_date', 'integer');
    }

    public function setUp()
    {
        $this->hasOne('objectblob'
                , array('local' => 'object_id',
            'foreign' => 'object_id',
            'onDelete' => 'CASCADE'
                )
        );

        parent::timeStampable(); // The updated at and created at fields..
    }

    /**
     * Given an array of values, save a new update report.
     * @param array $status_arr array of values for the update
     * @return integer object_id of the update
     */
    public static function savetaskscrum($status_arr)
    {
        fb('savetaskscrum started..');
        $status_arr = self::saveNewStatus($status_arr);
        objectblob::setWorkStatusByObjectId($status_arr['parent_id']);
        uicalc::updateUrgencyIndexByObjectID($status_arr['parent_id'], $status_arr['owner_id']); // Update the relevant urgency indexes.
        return($status_arr['parent_id']);
    }

    /**
     * Given a valid object and user, create a taskscrum entry if they don't have one with work_remain of -1.
     * @param integer $object_id A valid object in the system.
     * @param integer $owner_id A valid user in the system.
     */
    public static function saveNewOwnerReport($object_id, $owner_id)
    {
        if ($object_id > 0 && $owner_id > 0) {
            $curr_status = self::getStatusByObjectIdOwnerId($object_id, $owner_id);
            if ($curr_status == -3) {
                $new_taskscrum = new taskscrum();
                $new_taskscrum->object_id = $object_id;
                $new_taskscrum->owner_id = $owner_id;
                $new_taskscrum->work_done = 0;
                $new_taskscrum->work_remain = -1;
                $new_taskscrum->work_date = time();
                $new_taskscrum->save();
            }
            uicalc::updateUrgencyIndexByObjectID($object_id, $owner_id);
        }
    }

    /**
     * Given an array of status values, update it with defaults and save it into the db.
     * @param array $status_arr
     * @return array $status_arr Updated by this method.
     */
    public static function saveNewStatus($status_arr)
    {
        $new_taskscrum = new taskscrum();

        $fieldslist = array('object_id', 'work_done', 'work_done_desc', 'work_remain', 'owner_id', 'work_done_desc', 'issue_desc', 'work_next_desc', 'work_date');
        foreach ($fieldslist as $thisfield) {
            if ($thisfield == 'work_done') {
                if (!array_key_exists($thisfield, $status_arr)
                        || is_null($status_arr[$thisfield])
                        || !is_numeric($status_arr[$thisfield])
                        || $status_arr[$thisfield] <= 0) {

                    $status_arr[$thisfield] = 60;
                }
            }
            if ($thisfield == 'work_remain') {
                if (!array_key_exists($thisfield, $status_arr)
                        || is_null($status_arr[$thisfield])
                        || !is_numeric($status_arr[$thisfield])) {

                    $status_arr[$thisfield] = -1;
                }
            }
            if ($thisfield == 'work_date') {
                if (!array_key_exists($thisfield, $status_arr) || is_null($status_arr[$thisfield]) || $status_arr[$thisfield] <= 0) {
                    $status_arr[$thisfield] = time();
                }
            }
            if (array_key_exists($thisfield, $status_arr)) {
                $new_taskscrum->$thisfield = $status_arr[$thisfield];
                //fb('set the '.$thisfield.' field to '.$supplieddata[$thisfield]);
            } else {
                //fb('this field has no data: '.$thisfield);
                $new_taskscrum->$thisfield = NULL;
            }
        }
        $new_taskscrum->save();
        return ($status_arr);
    }

    /**
     * Returns the last taskscrum work_remain value for a given object_id and user_id.
     * @param integer $object_id valid object_id
     * @param integer $owner_id valid user_id
     * @return integer $result Last work_remain value or -3 if none.
     */
    public static function getStatusByObjectIdOwnerId($object_id, $owner_id)
    {
        fb('start getStatusByObjectIdOwnerId');
        $result = -3;
        $q = Doctrine_Query::create()
                        ->select('t.work_remain')
                        ->from('taskscrum t')
                        ->where('t.object_id = ?', $object_id)
                        ->andWhere('t.owner_id= ?', $owner_id)
                        ->orderBy('t.work_date DESC')
                        ->limit(1)
                        ->fetchArray();
        if (count($q) > 0) {
            $result = $q[0]['work_remain'];
        }
        return ($result);
    }

    /**
     * Given an object_id, return the total of the work_done by all users.
     * @param integer $object_id
     * @return integer
     */
    static public function getWorkTotalByObjectId($object_id)
    {
        fb('start work_total');
        //fb('blob id is '.$blob_id);
        $result = 0;
        $q = Doctrine_Query::create()
                        ->select('SUM(t.work_done) as the_total')
                        ->from('taskscrum t')
                        ->where('t.object_id = ?', $object_id)
                        ->fetchArray();
        //fb($result_array);
        // gotta check for when $result_array is null..
        if (count($q) AND count($q[0]) AND strlen($q[0]['the_total'])) {
            $result = $q[0]['the_total'];
        }
        return ($result);
    }

    /**
     * Grab the sum of the work remaining (worst case) for a given object_id.
     * @param integer $object_id
     * @return integer the work remaining total
     */
    static public function getWorkRemainByObjectId($object_id)
    {
        fb('start getWorkRemainByObjectId');
        $result = 0;
        $q = Doctrine_Query::create()
                        ->select('work_remain, owner_id')
                        ->from('taskscrum')
                        ->where('object_id = ?', $object_id)
                        ->orderBy('work_date DESC, owner_id ASC')
                        ->fetchArray();
        $user_list = array();
        foreach ($q as $this_update) {
            if ($this_update['work_remain'] < 0) {
                if ($this_update['work_remain'] == -2) {
                    return (0);
                }
            } else if (!in_array($this_update['owner_id'], $user_list)) {
                $user_list[] = $this_update['owner_id'];
                $result += $this_update['work_remain'];
            }
        }
        return ($result);
    }

    static public function getscrumsbybloblist($blob_ids, $timecode)
    {
        $blob_id_list = utilityclass::cast_as_array($blob_ids);
        $scrum_list = Doctrine_Query::create()
                        ->select('s.*')
                        ->from('taskscrum s')
                        ->where('s.updated_at > ?', $timecode)
                        ->whereIn('s.object_id', $blob_id_list)
                        ->orderby('s.work_date DESC')
                        ->fetchArray();
        return($scrum_list);
    }

}

?>
