<?php

class languages extends base_data_class
{

    public function setTableDefinition()
    {
        $this->hasColumn('iso_code', 'string');
        $this->hasColumn('english_name', 'string');
        $this->hasColumn('native_name', 'string');
    }

    public function setUp()
    {
        $this->hasMany('translation', array(
            'local' => 'id',
            'foreign' => 'language_id'
                )
        );
        $this->hasMany('user', array(
            'local' => 'id',
            'foreign' => 'language_id'
                )
        );
        parent::timeStampable(); // The updated at and created at fields..
    }

    public static function saveLanguageArray($lang_arr)
    {
        fb('starting saveLanguageArray');
        //fb($lang_arr);
        $lang_coll = new Doctrine_Collection('languages');
        $curr_lang_arr = self::getLanguageCodeArray();
        $i = 0;
        fb($curr_lang_arr);
        foreach ($lang_arr as $this_lang_arr) {
            $result = 0;
            if ($curr_lang_arr && isset($curr_lang_arr[$this_lang_arr['iso_code']])) {
                $result = self::updateLanguage($this_lang_arr['iso_code'], $this_lang_arr['english_name'], $this_lang_arr['native_name']);
            }
            if ($result === 0) {
                $lang_coll[$i]->iso_code = $this_lang_arr['iso_code'];
                $lang_coll[$i]->english_name = $this_lang_arr['english_name'];
                $lang_coll[$i]->native_name = $this_lang_arr['native_name'];
                $i += 1;
            }
        }
        $lang_coll->save();
        return ($lang_coll->count());
    }

    public static function updateLanguage($lang_code, $english_name, $native_name)
    {
        $q = Doctrine_Query::create()
                        ->update('languages')
                        ->set('english_name', '?', $english_name)
                        ->set('native_name', '?', $native_name)
                        ->set('updated_at', '?', time())
                        ->where('iso_code = ?', $lang_code);
        $result = $q->execute();
        return ($result);
    }

    public static function createLanguage($lang_code, $english_name, $native_name)
    {
        $result = self::updateLanguage($lang_code, $english_name, $native_name);
        if ($result > 0) {
            $lang = new languages();
            $lang_coll[i]->iso_code = $this_lang_arr['iso_code'];
            $lang_coll[i]->english_name = $this_lang_arr['english_name'];
            $lang_coll[i]->native_name = $this_lang_arr['native_name'];
            $lang->save();
            $result = $lang->count();
        }
        return($result);
    }

    public static function getLanguageCodeArray()
    {
        fb('starting getLanguageCodeArray');
        $lang_arr = Doctrine_Query::create()
                        ->select('')
                        ->from('languages')
                        ->fetchArray();
        if ($lang_arr) {
            $lang_arr = utilityclass::reduceArrayToListByKey($lang_arr, 'iso_code');
        }
        return ($lang_arr);
    }

    public static function getLanguageIdByCode($iso_code)
    {
        fb('starting getLanguageIdByCode');
        $result = 0;
        $lang_arr = Doctrine_Query::create()
                        ->select('')
                        ->from('languages l')
                        ->where('l.iso_code= ?', $iso_code)
                        ->limit(1)
                        ->fetchArray();
        if ($lang_arr) {
            $result = $lang_arr[0]['id'];
        }
        return ($result);
    }

    public static function getLanguage($lang_code)
    {
        $thislang = Doctrine_Query::create()
                        ->select('')
                        ->from('languages l')
                        ->where('l.iso_code= ?', $lang_code)
                        ->limit(1)
                        ->fetchArray();
        return ($thislang);
    }

    public static function getDefaultLanguageId()
    {
        $r = self::getLanguageIdByCode(DEFAULT_LANGUAGE_CODE);
        return($r);
    }

    public static function getActiveLanguageArray($timecode)
    {
        fb('starting getActiveLanguageArray');
        $result = Doctrine_Query::create()
                        ->select('')
                        ->from('languages l')
                        ->leftJoin('l.translation t')
                        ->where('t.language_id > ?', 0)
                        ->orderBy('iso_code ASC')
                        ->fetchArray();
        foreach ($result as &$this_lang) {
            unset($this_lang['translation']);
        }
        return ($result);
    }

}

?>
