<?php
  class emailhandler {
 //   private $properties = array();
    private $mailhandler; // should be static?

   function __construct(){
   try{
$this->mailhandler = new PHPMailer();
$this->mailhandler->From     = EMAIL_SIGNUP_ADDRESS;
$this->mailhandler->FromName = EMAIL_SIGNUP_NAME; //default
//$this->mailhandler->Host     = "smtp1.site.com;smtp2.site.com";
$this->mailhandler->Mailer   = "mail";
 } catch (Exception $e) {
      throw new ajaxfacadeException(AJAX_INTERNAL_ERROR,'Sending Emails not supported');
 }
   }
   function setmessage($message){
     $this->mailhandler->Body    = $message;
     $this->mailhandler->AltBody = strip_tags($message);
  }

   function setsubject($subject = EMAIL_SUBJECT){
     $this->mailhandler->Subject    = $subject;
  }

  function changefromname($name){
    $this->mailhandler->FromName = $name;
  }
  function addaddress($email,$name){
  $this->mailhandler->AddAddress($email, $name);
  }
function send(){
    $sendok = $this->mailhandler->Send();
    // Clear all addresses and attachments for next loop
    $this->mailhandler->ClearAddresses();
    $this->mailhandler->ClearAttachments();
    return($sendok);
}

   function test(){
$this->mailhandler->From     = "julian@learningfuture.com";
$this->mailhandler->FromName = "sampiplan test! ";
//$this->mailhandler->Host     = "smtp1.site.com;smtp2.site.com";
$this->mailhandler->Mailer   = "mail";


//while ($row = mysql_fetch_array ($result)) {
    // HTML body
    $body  = "Hello <font size=\"4\">" ."full_name" . "</font>, <p>";
    $body .= "<i>Your</i> personal photograph to this message.<p>";
    $body .= "Sincerely, <br>";
    $body .= "PHPMailer List manager";

    // Plain text body (for mail clients that cannot read HTML)
    $text_body  = "Hello " . "full_name" . ", \n\n";
    $text_body .= "Your personal photograph to this message.\n\n";
    $text_body .= "Sincerely, \n";
    $text_body .= "PHPMailer List manager";

$this->mailhandler->Body    = $body;
    $this->mailhandler->AltBody = $text_body;
    $this->mailhandler->AddAddress('julian@webhead.hk', 'julian harley');
   // $mail->AddStringAttachment($row["photo"], "YourPhoto.jpg");

    if(!$this->mailhandler->Send())
        echo "There has been a mail error sending to<br>";

    // Clear all addresses and attachments for next loop
    $this->mailhandler->ClearAddresses();
    $this->mailhandler->ClearAttachments();
}

     }

 ?>