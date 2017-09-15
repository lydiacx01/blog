<?php
/**
 * Created by chenxi
 * Date: 2017/3/7
 */

namespace App\Validation;


class ValidateMessage
{
	public static function get() {
	   return	[
			'required' => '必填项',
		    'required_without' => '必填项',
			'unique' => '已被其他人注册过',
			'max' => '最大不能超过 :max',
			'min' => '最小不能小于 :min',
			'in' => '目前不支持该值',
			'between' => '必须在 :min - :max 之间',
			'regex' => '格式错误',
			'required_if' => '必填项',
		   'confirmed' => '确认值不一致',
		   'email' => '邮件地址格式错误'
		];
	}
}