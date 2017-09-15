<?php

namespace App\Http\Requests;

use App\Blog\Category;
use App\Models\report\ReportConfig;
use Illuminate\Validation\Rule;

class BlogSaveRequest extends FormRequestBase
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
	        'code' => 'required_if: update, true',
	        'title' => 'required|max:30',
	        'category' => ['required', Rule::in(Category::allName())],
	        'description' => 'required|max:255',
	        'content' => 'required',
        ];
    }

    public function messages()
    {
	    $message = parent::messages();
	    return $message;
    }
}
