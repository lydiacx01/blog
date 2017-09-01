<?php

namespace App\Blog;


use App\ModelBase;

class Article extends ModelBase
{
    protected $table = 'articles';

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

}
