<?php
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of login
 *
 */
class login {
     function __construct(){}

/**
 *This verifies that the data sent meets the requirements.
 * @param <string> $email
 * @param <string> $password
 * @param <string> $first_name
 * @param <string> $last_name
 * @return <boolean>
 */
    public static function checkRegistrationOK($email, $password, $first_name, $last_name){
        //is email in email format?
        if(!ValidatorHelper::validate_email($email)){
            throw new ajaxfacadeException(AJAX_RETURN_BADREQUEST,"ERROR CAUGHT- Email format incorrect");
        }
        if(!ValidatorHelper::validate_length($password, 6)){
            throw new ajaxfacadeException(AJAX_RETURN_BADREQUEST,"ERROR CAUGHT- password less than 6 characters");
        }

        $allowed = TRUE;
        if($first_name == ""){$allowed = FALSE;}
        if($last_name == ""){$allowed = FALSE;}
        if($email == ""){$allowed = FALSE;}
        if($password == ""){$allowed = FALSE;}
        if(userattributes::userAlreadyRegistered($email)){
            $allowed = FALSE;
        }
        return($allowed);
    }


    /**
     *This is intended for use only during the beta period. It checks that the new user is either a beta invite or internal invite.
     * @param <string> $reg_code Prefinery invite code sent with beta confirmation.
     * @param <string> $email invite email
     * @param <string> $token
     * @return <boolean> Result of check.
     */
    public static function checkBetaInviteToken($reg_code, $email, $token){
        //fb('starting checkBetaInviteToken( '.$reg_code.', ' .$email. ', ' .$token. ' )');
        $status = FALSE;
        if(isset($reg_code) && ''!=$reg_code){
           // fb('is beta');
            $status = self::checkBetaCode($reg_code, $email);
           // fb($status);
        } else if(isset($token) && ''!=$token){
           // fb('is invite');
            $status = utilityclass::checkToken($token, $email);
           // fb($status);
        }
        if(!$status){
            //send back
             throw new ajaxfacadeException(AJAX_RETURN_BADREQUEST,"ERROR CAUGHT- Cant register that user");
        }
        return ($status);
    }
    /**
     *This is checking only the invite to space token info, it will be used after the beta period.
     * @param <string> $email invite email
     * @param <string> $token
     * @return <boolean> Result of check.
     */
    public static function checkInviteToken($email, $token){
        $status = FALSE;
        if(isset($token)){
            $status = utilityclass::checkToken($token, $email);
        }      
        return ($status);
    }

    /**
     *This accepts the beta acceptance info and checks it for validity.
     * @param <string> $reg_code
     * @param <string> $email
     * @return <boolean> $status
     */
    public static function checkBetaCode($reg_code, $email){
        $status = FALSE;
        if(strpos($reg_code,'letmein')!==FALSE){
            $status = TRUE;
        } else {
            $status = utilityclass::checkToken($reg_code, $email);
        }
        return ($status);
    }
    
    /**
     *This preforms the checking for the password.
     * @param <string> $email
     * @param <string> $password
     * @return <array> $user
     */
    public static function checkPassword($email, $password){
        //fb('starting checkPassword');
        $pass_hash = utilityclass::generatepasswordhash($password);
        //fb($pass_hash);
        //fb($email);
        $user_arr = userattributes::getUserByAttribute('email',$email);
        //fb($user_arr);
        $user_email_verified = userattributes::userAttributeVerified($user_arr['id'], 'email', $email, ACTIVE, VERIFIED);
        //fb($user_email_verified);
        if(isset($user_arr['password']) && ($user_arr['password']==$pass_hash) && $user_email_verified){
            //fb('password matches,& email verified too- -  yippie!');
            return($user_arr);
        } else {
            return(NULL);
        }
    }

    public static function processLogin($email, $password){
        //fb('starting processLogin for email'.$email);
        $user_arr = self::checkPassword($email, $password);
        //fb($user_arr);
        if(is_null($user_arr)){
            return(NULL);
        }
        $token = userlogintoken::createUserLoginToken($user_arr['id']);
        //fb($token);
        $cookie_set = utilityclass::setCookie($token, NULL);
        return ($user_arr);
    }
    public static function processLoggedInUser($user_id, $iso_code){
        $result = user::user_initial_data($user_id, 0, $iso_code);
        return ($result);
    }
    public static function getInitDic($iso_code){
        //fb('starting getInitDic');
        $dic = translation::getLanguageArrayByIso_code(DEFAULT_LANGUAGE_CODE,0);
        if(DEFAULT_LANGUAGE_CODE!=$iso_code){
            $user_lang = translation::getLanguageArrayByIso_code($iso_code,0);
            $dic = array_merge($dic, $user_lang);
        }
        $languages = languages::getActiveLanguageArray(0);
        $result = utilityclass::createMapDataArray(array('dic'=>$dic, 'languages'=>$languages));
        return ($result);
    }
    public static function processToken($token, $invite_email, $space_id, $user_id){
        //fb('starting processToken( '.$token.', '.$invite_email.', '.$space_id.', '.$user_id.')');
        $result = FALSE;
        if($token){
            if(utilityclass::missingvalues(array($invite_email , $space_id , $user_id ))){
                throw new ajaxfacadeException(AJAX_RETURN_BADREQUEST,"Missing Input");
            }
            //fb('info complete');
            $tokenok = login::checkInviteToken($invite_email, $token);
            //fb($tokenok);
            // ie token expired, so throw an error.
            if($tokenok){
                $tokenok = userinvitetoken::processToken($token, $space_id, $user_id);
            }
            //fb($tokenok);
            if(!$tokenok){
                throw new ajaxfacadeException(AJAX_RETURN_BADREQUEST,"ERROR CAUGHT- Token expired?");
            }            
            $result = TRUE;
        }
        return ($result);
    }
    /**
     *This processes the reset password request, updating the user after validating the token.
     * @param <string> $token
     * @param <string> $new_password
     * @param <string> $email
     * @return <array> user array if successful, NULL otherwise
     */
    public static function processResetPassword($token, $new_password, $email){
        $result = NULL;
        $user_arr = userattributes::getUserByAttribute('email',$email);
        //fb($user_arr);
        if($user_arr){
            if(forgotpasswordtoken::processResetToken($token, $new_password, $email)){
                $result = $user_arr;
            }
        }
        return ($result);
    }
}
?>
