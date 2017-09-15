<?php
/**
 * Created by PhpStorm.
 * User: lydia
 * Date: 17-9-13
 * Time: 下午6:08
 */

if (! function_exists('random_mix')) {
    function random_mix($len = 40) {
        $allow = 'abcdefghijklnmopqrstuvwxyzABCDEFGHIJKLNMOPQRSTUVWXYZ';
        $res = date('His', time());
        $len -= 6;
        for ($i=0; $i < $len; ++$i) {
            $res .= substr($allow, rand(0, 51), 1);
        }
        return $res;
    }
}