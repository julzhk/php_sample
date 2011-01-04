<?php

class errorlogger extends base_data_class
{

    public function setTableDefinition()
    {
        $this->hasColumn('user_id', 'integer');
        $this->hasColumn('message', 'string');
        $this->hasColumn('filename', 'string');
        $this->hasColumn('errorcode', 'string');
        $this->hasColumn('line', 'string');
        $this->hasColumn('backtrace', 'string');
    }

    public function setUp()
    {
        parent::doctrineTimestampable();
    }

    static public function logErrorindb($errno = 'not set', $errstr= 'not set', $file= 'not set', $line= 'not set')
    {
        $thiserror = new errorlogger();
        $thiserror->errorcode = $errno;
        $thiserror->user_id = utilityclass::getcookie_id();
        $thiserror->message = $errstr;
        $thiserror->filename = $file;
        $thiserror->line = $line;
        //  fb('debug_backtrace is:');
        //  var_dump(debug_backtrace());
        // fb(debug_backtrace());
        //  $thiserror->backtrace= json_encode(@debug_backtrace());
        // fb('is what?');
        $thiserror->save();
        fb('ERROR LOGGED', FirePHP::ERROR);
        ;
        fb($thiserror->toArray(), FirePHP::ERROR);
        ;
    }

}

?>
