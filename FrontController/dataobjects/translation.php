<?php

class translation extends base_data_class
{

    public function setTableDefinition()
    {
        $this->hasColumn('term_id', 'integer');
        $this->hasColumn('language_id', 'integer');
        $this->hasColumn('value', 'string');
    }

    public function setUp()
    {
        $this->hasOne('term', array(
            'local' => 'term_id',
            'foreign' => 'id'
                )
        );
        $this->hasMany('translationuser', array(
            'local' => 'id',
            'foreign' => 'translation_id'
                )
        );

        $this->hasOne('languages', array(
            'local' => 'language_id',
            'foreign' => 'id'
                )
        );

        parent::timeStampable(); // The updated at and created at fields..
    }

    public static function saveTranslationArray($user_id, $status, $trans_arr)
    {
        fb('starting saveTranslationArray');
        if ($trans_arr && isset($trans_arr[0]['iso_code'])) {
            $lang_id = languages::getLanguageIdByCode($trans_arr[0]['iso_code']);
            if ($lang_id > 0) {
                fb('valid language, starting to save submitted translations');
                $trans_coll = new Doctrine_Collection('translation');
                $i = 0;
                foreach ($trans_arr as $this_trans) {
                    if (isset($this_trans['term_name']) && $this_trans['value'] != '') {
                        $term_id = term::getTermId($this_trans['term_name']);
                        if ($term_id > 0) {
                            $trans_coll[$i]->language_id = $lang_id;
                            $trans_coll[$i]->term_id = $term_id;
                            $trans_coll[$i]->value = $this_trans['value'];
                            $i += 1;
                        }
                    }
                }
                $trans_coll->save();
                fb('translations saved');
                translationuser::saveTranslationArray($user_id, $status, $trans_coll->toArray());
                return ($trans_coll->count());
            }
        }
        return (0);
    }

    public static function getTranslation($iso_code, $term_name)
    {
        $term_arr = Doctrine_Query::create()
                        ->select('t.*, l.iso_code AS iso_code, m.term_name AS term_name')
                        ->from('translation t')
                        ->leftJoin('t.term m')
                        ->leftJoin('t.languages l')
                        ->where('m.term_name = ?', $term_name)
                        ->addWhere('l.iso_code = ?', $iso_code)
                        ->orderBy('updated_at DESC')
                        ->limit(1)
                        ->fetchArray();
        if (count($term_arr)) {
            $term = $term_arr[0]['value'];
        } else {
            if ($iso_code == DEFAULT_LANGUAGE_CODE) {
                // default didnt come up with anything.
                return($term_name);
            }
            $term = self::getTranslation(DEFAULT_LANGUAGE_CODE, $term_name);
        }
        return($term);
    }

    public static function getAllTranslationsByLanguage($iso_code)
    {
        $trans_arr = Doctrine_Query::create()
                        ->select('t.*, l.iso_code AS iso_code, m.term_name AS term_name')
                        ->from('translation t')
                        ->leftJoin('t.term m')
                        ->leftJoin('t.languages l')
                        ->where('l.iso_code = ?', $iso_code)
                        ->groupBy('t.term_id')
                        ->orderBy('updated_at DESC')
                        ->fetchArray();
        fb($trans_arr);
        foreach ($trans_arr as &$thistrans) {
            unset($thistrans['term'], $thistrans['languages']);
        }
        return($trans_arr);
    }

    public static function getLanguageSetByLanguageId($lang_id, $timecode)
    {
        fb('starting getLanguageSetByLanguageId');
        $term_id_arr = term::getTermIdArray();

        $trans_arr = Doctrine_Query::create()
                        ->select('t.*, l.iso_code AS iso_code, m.term_name AS term_name')
                        ->from('translation t')
                        ->leftJoin('t.languages l')
                        ->leftJoin('t.term m')
                        ->leftJoin('t.translationuser tu')
                        ->where('t.language_id = ?', $lang_id)
                        ->andWhere('tu.status = ?', VERIFIED)
                        ->andWhere('t.updated_at > ?', $timecode)
                        ->whereIn('t.term_id', $term_id_arr)
                        ->groupBy('t.term_id')
                        ->orderBy('t.updated_at DESC')
                        ->fetchArray();
        foreach ($trans_arr as &$thistrans) {
            unset($thistrans['term'], $thistrans['languages'], $thistrans['translationuser']);
        }
        return ($trans_arr);
    }

    public static function getLanguageArrayByIso_code($iso_code, $timecode)
    {
        fb('starting getLanguageArrayByIso_code');
        $lang_id = languages::getLanguageIdByCode($iso_code);
        $lang_arr = self::getLanguageSetByLanguageId($lang_id, $timecode);
        return ($lang_arr);
    }

}

?>