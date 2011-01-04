<?php
 class ValidatorHelper {
    // constructor not implemented
    // validate integer
    public static function validate_int($value, $min, $max){
        return filter_var($value, FILTER_VALIDATE_INT, array('options' => array('min_range' => $min, 'max_range' => $max)));
    }
    // validate float number
    public static function validate_float($value){
        return filter_var($value, FILTER_VALIDATE_FLOAT);
    }
    // validate alphabetic value
    public static function validate_alpha($value){
        return filter_var($value, FILTER_VALIDATE_REGEXP, array('options' => array('regexp' => "/^[a-zA-Z]+$/")));
     }
    // validate alphanumeric value
    public static function validate_alphanum($value){
        return filter_var($value, FILTER_VALIDATE_REGEXP, array('options' => array('regexp' => "/^[a-zA-Z0-9]+$/")));
    }
    // validate URL
    public static function validate_url($url){
        return filter_var($url, FILTER_VALIDATE_URL, FILTER_FLAG_HOST_REQUIRED);
    }
    // validate IP address
    public static function validate_ip($ip){
        return filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4);
    }
    // validate email address
    public static function validate_email($email){
        return filter_var($email, FILTER_VALIDATE_EMAIL);
    }
     public static function validate_length($pw,$length = 6){
        return (strlen($pw)>=$length);
    }
}


?>
