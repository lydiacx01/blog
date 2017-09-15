<?php

namespace App\Blog;

use App\ModelBase;

class Category extends ModelBase
{
    protected $table = 'categories';
    protected $guarded = [];
    public $timestamps = false;

    public function scopeName($query, $name) {
        return $query->where('name', $name);
    }

    public function articles() {
        return $this->hasMany(Article::class, 'category_name', 'name');
    }

    public static function allName() {
        $obj = new static();
        return $obj->all()->pluck('name')->all();
    }
}
