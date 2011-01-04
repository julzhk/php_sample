<?php
  //reports stickleback plugin set: plug in host
 class defaultreports implements stickleback_Plugin {
 //inherited common methods...
    function reportTypes() {
        $handlers = $this->getReportsHandlers();
        $ret = array();
        foreach ($handlers as $handler) {
            $ret[] = $handler->getreporttype();
        }
        return $ret;
    }
     function getReportsHandlers() {
        $reg = stickleback_PluginRegistry::getInstance();
        $desc = $reg->getPluginDescriptor($this);
        return  $desc->getExtendingPlugins("defaultreportsInterface_reportsHandler");
    }  
 }
  interface defaultreportsInterface_reportsHandler {
         function execute(); // ie all defaultreports must have a 'execute' method.
  function getreporttype();      
  } 
     
  class quiz implements stickleback_Plugin {

    function questionTypes() {
        $handlers = $this->getQuestionHandlers();
        $ret = array();
        foreach ($handlers as $handler) {
            $ret[] = $handler->getType();
        }
        return $ret;
    }

    function getQuestionHandlers() {
        $reg = stickleback_PluginRegistry::getInstance();
        $desc = $reg->getPluginDescriptor($this);
        return  $desc->getExtendingPlugins("quiz_QuestionHandler");
    }
}
    interface quiz_QuestionHandler {
         function gettype();
     }  
     
     
     class quiz_StdQuestionHandler implements quiz_QuestionHandler {
      function getType(){
          return 'std';
      }      }
  class quiz_ImageQuestionHandler implements quiz_QuestionHandler {
      function getType(){
          return 'Image';
      }
  }
  
  class defaultreports_velocity implements defaultreportsInterface_reportsHandler{
      function execute(){
          echo '<h1>velocity report</h1>';
          return 'velocity report';
      }
      function getreporttype (){
      return array('name'=>'velocity report','classname'=>'velocity');
      }
      }
  class defaultreports_slack implements defaultreportsInterface_reportsHandler{
      function execute(){
          echo 'defaultreports_slack';
          return 'defaultreports_slack';
      }
   function getreporttype(){
        return array('name'=>'Slack report','classname'=>'slack')     ;
       
      }
     
  }                                   
  
  class defaultreports_burndown implements defaultreportsInterface_reportsHandler{
      function execute(){
          echo 'defaultreports_burndown';
          return 'defaultreports_burndown';
      }
   function getreporttype(){
    return array('name'=>'Burndown report','classname'=>'burndown')   ;
      }
     
  }                                   
  
  
  
  
          ?>
