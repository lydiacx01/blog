<?php

namespace App\Blog;


use App\ModelBase;
use Illuminate\Support\Facades\DB;

class Article extends ModelBase
{
    protected $table = 'articles';
    protected $guarded = [];

    public function getCategoryNameAttribute() {
        return $this->attributes['category_name'];
    }
    public function setCategoryNameAttribute($name) {
        $this->attributes['category_name'] = $name;
    }

    public function getContentIdAttribute() {
        return $this->attributes['content_id'];
    }
    public function setContentIdAttribute($contentId) {
        $contentId = intval($contentId);
        if (!$contentId || $contentId <= 0) {
            throw new \Exception('invalid content id');
        }
        $this->attributes['content_id'] = $contentId;
    }

    public function content() {
        return $this->hasOne(Content::class, 'article_id');
    }

    public function category() {
        return $this->belongsTo(Category::class);
    }

    public function scopeAllList($query) {
        return $query;
    }
    public function scopeCategoryCount($query) {
        return $query->select(DB::raw('count(id) as count, category_name as name'))
            ->groupBy('name');
    }
}
