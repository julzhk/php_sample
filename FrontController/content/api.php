<?php

define('RELATIVEPATH', '../');
include (RELATIVEPATH . 'config_doctrine.php');
include (RELATIVEPATH . 'file_includes.php');
include (RELATIVEPATH . "config.php");
$firephp = FirePHP::getInstance(true);
$firephp->group('api stuff');
$request = request::getInstance();
$request->init(); // seed with the arguments data from the GET/POST
if (!$request->is_empty()) {
    $task = $request->getProperty("task");
    $option1 = $request->getProperty("option1");
    if (!is_null($task) && (!is_null($option1) || 'avatar' == $task)) {
        $i = api::getInstance();
        $i->execute($request);
    }
}
//if no arguments are given or if task or option1 is empty, drop the connection
die();

class api
{

    private static $instance;

    function __construct()
    {
        //it's a singleton, so it doesn construct normally.
    }

    public static function getInstance()
    {
        if (empty(self::$instance)) {
            self::$instance = new api();
        }
        return self::$instance;
    }

    function handlecookie($task, $request)
    {
        $allowed = utilityclass::handlecookie($task, $request);
        if (!$allowed) {
            api::default_case();
        }
    }

    function handleincludetask($task)
    {
        $thiscommandclass = COMMANDS_FOLDER . $task . '.php';
        if (file_exists($thiscommandclass)) {
            include_once ( $thiscommandclass);
        }
        if (!class_exists($task)) {
            //  fb ("task was $task - but not found!");
            self::default_case();
            die();
        }
    }

    function execute($request)
    {
        $task = $request->getProperty("task");
        $this->handlecookie($task, $request);
        $this->handleincludetask($task);
        $option1 = $request->getProperty("option1");
        $firephp = FirePHP::getInstance(true);
        $firephp->groupEnd();
        $firephp->group($task . '::' . $option1 . ' started');
        $execute = new $task($request);
        $execute->execute();
        $firephp->groupEnd();
    }

    public static function default_case()
    {
        if (utilityclass::cookie_exists()) {
            utilityclass::logout_cookie();
        }
    }

}

?>