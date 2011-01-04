<?php

// abstract the CRUD stuff where appropriate from the doctrine data types.
class base_data_class extends Doctrine_Record
{

//abstract public function setTableDefinition();
//abstract public function setUp();
    function construct()
    {

    }

    public function timeStampable()
    {
        $this->actAs('Timestampable', array('created' => array('name' => 'created_at',
                'type' => 'integer',
                'format' => 'U',
                'disabled' => false,
                'options' => array()),
            'updated' => array('name' => 'updated_at',
                'type' => 'integer',
                'format' => 'U',
                'disabled' => false,
                'options' => array())));
    }

    public function doctrineTimestampable()
    {
        $this->actAs('Timestampable', array('created' => array('name' => 'created_at',
                'type' => 'timestamp',
                'format' => 'Y-m-d H:i:s',
                'disabled' => false,
                'options' => array()),
            'updated' => array('name' => 'updated_at',
                'type' => 'timestamp',
                'format' => 'Y-m-d H:i:s',
                'disabled' => false,
                'options' => array())));
    }

    public function createdummy($dummydataArray)
    {
        fb('dummy data created in parent');
        $this->merge($dummydataArray);
        //   echo('<pre>');
        //  print_r($this->toArray());
        //   echo('</pre>');
        $this->save();
    }
}

?>