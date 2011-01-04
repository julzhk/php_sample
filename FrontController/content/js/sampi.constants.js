//NAMESPACES
(function($) {
//Creates a namespace for the static reference materials
    $.sysConst = {
        min_edit_service_level : {
            comments : 1,
            tags : 2,
            files : 3,
            schedule : 4,
            status : 2,
            subs : 2,
            users : 0
        },
        edit_ref : {
            comments : 'blob_comment',
            tags : 'blob_tag',
            files : 'blob_file',
            schedule : 'blob_schedule',
            status : 'blob_status_task',
            subs : 'blob_sub',
            users : 'blob_users'
        },
        readonly_ref : {
            comments : 'blob_comment_readonly',
            tags : 'blob_tag_readonly',
            files : 'blob_file_readonly',
            schedule : 'blob_schedule_readonly',
            status : 'blob_status',
            subs : 'blob_sub_readonly',
            users : 'blob_users'
        },
        object_detail_facade_method : {
            comments : 'commentsummary',
            tags : 'gettagsbyobjectid',
            files : 'getfilelistbyobjectid',
            schedule : 'getlinks',
            status : 'getstatusreportsbyobjectid',
            subs : '',
            users : 'getusersbyobjectid'
        },
        object_detail_format_method : {
            comments : 'commentsummarylist',
            tags : 'taglist',
            files : 'filelist',
            schedule : 'linklist',
            status : 'statuslist',
            subs : '',
            users : 'userlist'
        },
        new_object :{
            object_name : '',
            content : '',
            owner_id : '',
            manager_id : '',
            set_start : null,
            set_finish : null,
            object_id : -1,
            parent_id : -1
        },
        'NO_ACCESS_USER' : 0,
        'READ_ONLY_USER' : 1,
        'READ_WRITE' : 2,
        'FILE_USER' : 4,
        'TASK_USER' : 3,
        'PROJECT_USER' : 5,
        'PRO_USER' : 6,
        'ADMIN_USER' : 1,
    //The fixed path portion of the ajaxfacade target URL. This can be changed for testing.
        base_target_clean : "api.php",
        admin_target : "api.php?task=adminfacade",
        base_target : "api.php?task=ajaxfacade",
        login_target : "api.php?task=loginfacade"
    }
})(jQuery);