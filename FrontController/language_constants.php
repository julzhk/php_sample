<?php

define("DEVELOPMENT_ERROR_MESSAGES", true);

//Language constants
define("NO_BLOB_ID_SET", "No id set,so no data available");
// Data related settings
define("NUMBER_OF_TARGET_TASKS", 10); // how many results to return in target tasks method in ajax facade, line 75
define("DEFAULT_WORKSPACE_NAME", "%s"); // ie replace %s with their given name
define("DEFAULT_OWNER_TEAMNAME_FOR_WORKSPACE", "Owner Team"); // can put in %s
define("DEFAULT_TEAMNAME_FOR_WORKSPACE", "Default"); // has no access rights, just participant (after invited to space)

define('RECEIVEDANDPROCESSED', 1); // THESE ARE THE RETURN CODES TO THE JS FRONT END.
define('FAILPROCESSING', false); // THESE ARE THE RETURN CODES TO THE JS FRONT END.
define('COMMENTFORMID', 2); // THESE ARE THE RETURN CODES TO THE JS FRONT END.

define('AJAX_RETURN_EVERYTHINGFINE', 0); // THESE ARE THE status RETURN CODES TO THE JS FRONT END in abstractfacade
define('AJAX_RETURN_NOCHANGE', 1); // THESE ARE THE status RETURN CODES TO THE JS FRONT END in abstractfacade
define('AJAX_RETURN_NODATA', 2); // THESE ARE THE status RETURN CODES TO THE JS FRONT END in abstractfacade
define('AJAX_USER_RELOGIN_ERROR', 3); // THESE ARE THE status RETURN CODES TO THE JS FRONT END in abstractfacade
define('AJAX_BAD_LOGIN_CREDENTIALS', 4); // THESE ARE THE status RETURN CODES TO THE JS FRONT END in abstractfacade
define('AJAX_ARGUMENT_MISSING', 5); // used it the facade to trigger an error.
define('AJAX_INTERNAL_ERROR', 6); // used it the facade to trigger an error.
define('AJAX_SECURITY_BREACH', 7); // used it the facade to trigger an error.
define('AJAX_RETURN_BADREQUEST', 8); // THESE ARE THE status RETURN CODES TO THE JS FRONT END in abstractfacade
define('AJAX_METHOD_DOESNT_EXIST', 9); // used it the facade to trigger an error.
define('AJAX_DUPLICATE_ENTRY', 10); // used in adding member to space.

define('SUCCESSFUL', true); // used in the models to return when complete ok.
define('NOT_SUCCESSFUL', false); // used in the models to return when complete NOK.

define('PASSWORD_SALT', 'REAL_PASSWORD_SALT_is_not_this');
define('SITE_CHAR_SET', 'UTF-8');
define('STATIC_PAGES', '../staticpages/');
define('COMMANDS_FOLDER', '../commands/');
define('FILE_UPLOAD_FOLDER', '/uploads/');
define('THUMBNAIL_UPLOAD_FOLDER', '../uploads/');
define('PHP_IDS_THRESHOLD', 15);
define('AUTO_LOGOUT_THRESHOLD', 10 * 60); //TTL in seconds til auto log out
define('USER_COOKIE', 'toyboxuserid'); //TTL in seconds til auto log out

define('FILE_UPLOAD_FAIL', 0);
define('FILE_UPLOAD_SUCCESS', 1);
define('FILE_UPLOAD_FAIL_NO_FILE_SPECIFIED', 2);

// these are in the database user table, so dont change these without updating the table to match!!!.
define('LIVE_REGISTERED_USER', 1);
define('USER_STATUS_SOFT_DELETE', 2);
define('UNVERIFIED_REGISTERED_USER', 3);
//user subscription levels, again, not to changed.
define('NO_ACCESS_USER', 0);
define('READ_ONLY_USER', 1);
define('READ_WRITE', 2);
define('TASK_USER', 3);
define('FILE_USER', 4);
define('PROJECT_USER', 5);
define('PRO_USER', 6);

//admin permission levels
define('NOT_ADMIN', 0);
define('IS_ADMIN', 1);

define('GHOST_USER', 'ghost user'); // user status for users with abunconfirmed invation status
define('INVITE_TOKEN_SALT', 'f91681a2ccef708d48062206937c8a4a5fde343f');
$expires_time = 60 * 60 * 24 * 31; //expire in 31 days (in seconds)
define('COOKIE_EXPIRES_TIME', $expires_time);

$daysworkperweek = 5;
$nodaysinweek = 7;
$workinghours = 8;
$nonworkinghours = 24;
$timewastage = 1.2; // time not used on system work
$userefficiencyrating = 1; // currently all users are equally efficient.
// this is used in the schedule links. creates a weighted remaining time
$work_Remain_multiplier = ($nodaysinweek / $daysworkperweek ) * ($nonworkinghours / $workinghours ) * $timewastage * $userefficiencyrating;
define('FULL_TIME_WORKER_MULTIPLIER', $work_Remain_multiplier);
define('MAXIMUM_URGENCY_INDEX', 500);
define('PERSONAL_SPACE', 'Personal Space');
define('PAID_SPACE', 'Paid Space');
define('MAX_LOG_ITEMS', 10); // set this to the maximum no of log items.
define('EMAIL_SIGNUP_ADDRESS', 'sam@sampiplan.com'); // default 'send from email name' in classes/emailhandler.php
define('EMAIL_SIGNUP_NAME', "Sampi Plan - Simple Shared Planning"); // default 'send from email name' in classes/emailhandler.php
define('EMAIL_SUBJECT', 'Email from Sampi Plan.'); // Default subject line for emails..
define('EMAIL_UPDATE_SUBJECT', 'Update in your Sampi Plan Project'); // Default subject line for emails..
define('EMAIL_INVITE_SUBJECT', 'Invitation to Sampi Plan'); // Default subject line for emails..
define('EMAIL_RESET_PASSWORD_SUBJECT', 'Reset Password Confirmation for Your Sampi Plan Account'); // Default subject line for emails..
define('ACTIVE_TEAM_NAME', '__active'); // Default team
define('INACTIVE_TEAM_NAME', '__inactive'); // Default team
define('DEFAULT_FILE_NAME', 'default_file'); // Default file name if thumbnail doesn't get a name.
// user attributes constants
define('VERIFIED', 'verified');
define('UNVERIFIED', 'unverified');
define('INACTIVE', 'inactive');
define('ACTIVE', 'active');

define('TERM_NOT_DEFINED', 'TERM_NOT_DEFINED');
define('UNKNOWN_LANGUAGE', 'Dont know that language code');

define('TRANSLATOR', 'TRANS');
define('APPROVER', 'APPR');

define('DEFAULT_LANGUAGE_CODE', 'en');
?>