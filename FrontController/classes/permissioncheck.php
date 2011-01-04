<?php
  class permissioncheck{

      function _construct(){
// NOTHING - AS ITS ALL STATIC
// ie constructor not called.
}
static public function userallowedaccess($user_id,$blob_id = null){
    //fb('userallowedaccess started with user_id ='.$user_id. ', blob_id :'.$blob_id  ,FirePHP::WARN);
    if(is_null($blob_id) OR ($blob_id < 0)){ //new $blob_id has an id = -1
    // creating a blob is assumed to be allowed..
       // fb('no blob_id so return OKAY');
        return(true);
    }
    $permissionsarray = objectblob::useraccesslevel($user_id,$blob_id);
   // fb($permissionsarray);
    $allowed = $permissionsarray['service_level'] > 0 ;
   // fb('user id: '. $user_id.' for blob : '. $blob_id . ' level :'.$allowed);
    return($allowed);
}

static public function savecommentpermitted($parent_id,$comment_parent_id) {
    // get the blob_id for the $comment_parent_id
    if($comment_parent_id > 0){
        //fb('existing comment thread, checking for parent object id');
        $blob_id = comment::get_comment_parent_id($comment_parent_id);
    } else {
        //fb('new thread, using the supplied object_id');
        $blob_id = $parent_id;
    }
    //fb('blob id is '.$blob_id);
    // doesnt return a value : just stops execution if not allowed.
    self::execute($blob_id,READ_WRITE);
}

static public function getcommentpermitted($comment_parent_id) {
        $blob_id = comment::get_comment_parent_id($comment_parent_id);
  //  fb('blob id is '.$blob_id);
// doesnt return a value : just stops execution if not allowed.
    self::execute($blob_id,READ_ONLY_USER);
}

static public function savefactpermitted($json_post_data_array) {
 $blob_id = $json_post_data_array['parent_id'];
 self::execute($blob_id,READ_WRITE);
}

static public function savefilepermitted($blob_id) {
 self::execute($blob_id,FILE_USER);
}

static public function createblobpermitted($this_parent,$this_id) {
    
    if($this_id == -1){
            $blob_to_check_id = $this_parent;
        } else {
            $blob_to_check_id = $this_id;
        }
    // Admins can create blobs always
    $user_id=  utilityclass::getcookie_id();
    $account_admin_permission = objectblob::useradminlevel($user_id , $blob_to_check_id);
        if($account_admin_permission== IS_ADMIN){
            return(true);
        } else {
            self::execute($blob_to_check_id,TASK_USER);        
        }
}


static public function savetaskscrumpermitted($blob_id){
       self::execute($blob_id,TASK_USER);
}
static public function getfilepermitted($file_object_id){
    $blob_id = fileobject::get_blob_id($file_object_id);
    self::execute($blob_id,FILE_USER);
}

static public function getpermitted($blob_id) {
   self::execute($blob_id,READ_ONLY_USER);
}
   static public function moveObjectPermitted($object_id, $target_id){
       self::execute($object_id, TASK_USER);
       self::execute($target_id, TASK_USER);
   }

/**
*@desc you can add a schedule link if you are a project user on EITHER the start OR end blob AND at least readonly on the other.
*/
static public function addlinkpermitted($start_object_id, $end_object_id){
    $user_id=  utilityclass::getcookie_id();
 //   fb('addlinkpermitted??? start_object, end_object, user');
 //   fb($start_object_id);
 //   fb($end_object_id);
 //   fb($user_id);
    $start_object_id_permissionarray = objectblob::useraccesslevel($user_id,$start_object_id);
    $end_object_id_permissionarray = objectblob::useraccesslevel($user_id,$end_object_id);
    //Check to see that the user is a Project user on at least one and at least has Read Only access on the other.
    if ((($start_object_id_permissionarray['service_level'] >= READ_ONLY_USER)
         AND ($end_object_id_permissionarray['service_level'] >= PROJECT_USER))
        OR(($start_object_id_permissionarray['service_level'] >= PROJECT_USER)
         AND ($end_object_id_permissionarray['service_level'] >= READ_ONLY_USER))) {
               return('ok');
        } else {
               throw ajaxfacadeException::Exception("NO permissions on that object");
        }
    }
    
/**
*@desc you can del a schedule link if you are a project user on EITHER the start OR end blob.
*@param $start_object_id, $end_object_id
*@return 'ok' if permitted, else throw exception
*/
static public function dellinkpermitted($link_id){
    $linkinfoArray = schedulelinks::get_link_info($link_id);
    if(0 == count($linkinfoArray)){
        return(-1); //@todo : make a neater ajax return
    }
   $start_object_id = $linkinfoArray['start_object_id'];
   $end_object_id = $linkinfoArray['end_object_id'];
    $user_id=  utilityclass::getcookie_id();
    $start_object_id_permissionarray = objectblob::useraccesslevel($user_id,$start_object_id);
    $end_object_id_permissionarray = objectblob::useraccesslevel($user_id,$end_object_id);
    //Check to see that the user is a Project user on at least one of the objects.
    if (($start_object_id_permissionarray['service_level'] >= PROJECT_USER)
         OR ($end_object_id_permissionarray['service_level'] >= PROJECT_USER)) {
               return('ok');
        } else {
               throw ajaxfacadeException::Exception("NO permissions on that object");
        }
    }
static public function  createtagpermitted(){
    // NOT IMPLEEMENTED YET
}
static public function settagspermitted($blob_id) {
   self::execute($blob_id,TASK_USER);
}
static public function deletetagpermitted($tag_id) {
      $blob_array = Doctrine_Query::create()
               ->select('object_id')
               ->from('tag t')
                ->where('t.id = ?', $tag_id)
               ->fetchArray();
               if(count($blob_array)){
                    $blob_id = $blob_array[0]['object_id'];
   self::execute($blob_id,TASK_USER);
               } else{
                  throw ajaxfacadeException::Exception("No objects with that TAG");
               }
}


static public function getuserdetailspermitted($user_id){
/// not mimplemented yet
}

private static function execute($blob_id,$minimum_user_level){
    $thisuser_id=  utilityclass::getcookie_id();
    $permissionsarray = objectblob::useraccesslevel($thisuser_id,$blob_id);
    if ($permissionsarray['service_level'] < $minimum_user_level){
        throw ajaxfacadeException::Exception("NO permissions on that object");
    }
    // doesnt have to return a value - it quits if things are wrong.
   }
   /**
   *@desc check if a user is allowed to perform a move on a particular object
   * @param, 2 blob ids
   * @returns boolean - allowed or not
   */
   static public function admin_move_object_permission($object_id, $target_id ) {
       fb('admin_move_object_permission started');
    // first check they are in the same space..
     $object_space_id = Doctrine_Query::create()
               ->select('root_id')
               ->from('objectblob b')
               ->where('b.object_id = ?', $object_id)
               ->fetchArray();
     $target_space_id = Doctrine_Query::create()
               ->select('root_id')
               ->from('objectblob b')
               ->where('b.object_id = ?', $target_id)
               ->fetchArray();

               fb($object_space_id);
               fb($target_space_id);
     if($object_space_id[0]['root_id'] != $target_space_id[0]['root_id']){
        return(FALSE);
     }
    // then.. check user is admin for this particular space
    $user_id = utilityclass::getcookie_id();
     $permissions = objectblob::useradminlevel($user_id,$object_id );

    // ok return
    fb($permissions);
    return($permissions);
    }

   /**
   *@desc get the permission array for a team attempting to access a particular blob
   *@param team id , and blob id
   *@return an array of permissions
   */
 static public function teamaccesslevel( objectblob $thisblob , $team_id ) {
        fb('teamaccesslevel started');
        //Fetch the team if it is connected to the object provided
        $permission_array = Doctrine_Query::create()
            ->select('t.service_level, t.account_admin' )
            ->from('team t')
            ->leftJoin('t.objectblob b')
            ->where('b.lft <= ?', $thisblob->lft)
            ->addWhere('b.rgt >= ?', $thisblob->rgt)
            ->addWhere('b.root_id = ?', $thisblob->root_id)
            ->addWhere('t.id = ?', $team_id)
            ->fetchArray();
            
        fb($permission_array);
        
        if(count($permission_array)){
            return($permission_array[0]);
        }
        return(array('service_level'=>NO_ACCESS_USER,'account_admin'=>NOT_ADMIN));
 }
 
    public static function checkblobowners($owner_id, $team_id, $object_id) {
        fb('checkblobowners started');
        $result_arr = array();
        $curr_obj = Doctrine::getTable('objectblob')->find($object_id);
        $result_arr['manager_id'] = self::checkObjectManager($curr_obj, $team_id);
        $result_arr['owner_id'] = self::checkObjectOwner($object_id, $owner_id, $curr_obj->owner_id);
        return ($result_arr);
    }
    public static function checkObjectOwner($object_id, $owner_id, $curr_owner_id){
        $permission_arr = objectblob::useraccesslevel($owner_id,$object_id);
        $result = NULL;
        if ($permission_arr['service_level'] > READ_WRITE){
            $result = $owner_id;
        } else if($curr_owner_id >0){
            $result = $curr_owner_id;
        }
        return ($result);
    }
    public static function checkObjectManager(objectblob $curr_obj, $team_id){
        $permission_arr = self::teamaccesslevel($curr_obj , $team_id);
        $result = null;
        if ($permission_arr['service_level'] > READ_WRITE){
            $result =  $team_id;
        } else {
            if($curr_obj->manager_id && $curr_obj->manager_id !== ''){
                $result = $curr_obj->manager_id;
            } else {
                $this_parent_blob = $curr_obj->getNode()->getParent();
                $result = $this_parent_blob->manager_id;
            }
        }
        return ($result);
    }
   static public function useradmininspace($user_id,$this_space){
        // Admins can create blobs always
        $account_admin_permission = objectblob::useradminlevel($user_id , $this_space);
        return($account_admin_permission);
   }
   static public function useradminforobject_id($user_id,$thisblob){
         //Fetch the team if it is connected to the object provided
        $account_admin_permission = objectblob::useradminlevel($user_id , $thisblob);
        return($account_admin_permission);
   }
   static public function useradminforteam($user_id,$thisteam_id){
       $thisteamArray = team::getinfo($thisteam_id);
       $this_space_id = $thisteamArray['space_id'];
       $space_admin_permission = objectblob::useradminlevel($user_id , $this_space_id);
       return($space_admin_permission);
   }

   static public function userssharespace($user1_id, $user2_id){
       $user1spaces =   team::getSpaceIdListByUserId($user1_id);
       $user2spaces =   team::getSpaceIdListByUserId($user2_id);
       $commonspaces = array_intersect($user1spaces,$user2spaces);
       $r = count($commonspaces);
       return($r);
   }
  }
?>