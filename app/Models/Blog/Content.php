<?php

namespace App\Blog;

use Illuminate\Database\Eloquent\Model;

class Content extends Model
{
    protected $table = 'contents';
    public $timestamps = false;

    public function setArticleIdAttribute($articleId) {
        $this->attributes['article_id'] = intval($articleId);
    }
    public function getArticleIdAttribute() {
        return $this->attributes['article_id'];
    }

    public function scopeArticleId($query, $articleId) {
        return $query->where('article_id', intval($articleId));
    }

    public function article() {
        return $this->belongsTo(Article::class, 'content_id');
    }
}
