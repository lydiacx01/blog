<?php

namespace App\Blog;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $table = 'categories';
    public $timestamps = false;

    public function scopeName($query, $name) {
        return $query->where('name', $name);
    }

    public function articles() {
        return $this->hasMany(Article::class, 'category_name', 'name');
    }
}
