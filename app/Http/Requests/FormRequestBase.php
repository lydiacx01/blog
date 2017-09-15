<?php
/**
 * Created by chenxi
 * Date: 2017/3/7
 */

namespace App\Http\Requests;


use App\Validation\ValidateMessage;
use Illuminate\Foundation\Http\FormRequest;

class FormRequestBase extends FormRequest
{
	/**
	 * Determine if the user is authorized to make this request.
	 *
	 * @return bool
	 */
	public function authorize()
	{
		return true;
	}

	public function messages()
	{
		$message = parent::messages();
		$ch =  ValidateMessage::get();
		return array_merge($message, $ch);
	}
}