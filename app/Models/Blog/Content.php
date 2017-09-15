<?php

namespace App\Blog;

use App\ModelBase;

class Content extends ModelBase
{
    protected $table = 'contents';
    protected $guarded = ['article_id'];
    public $timestamps = false;

    protected $dir = '/www/blog/';

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

    public function readContentBody($path = null) {
        $path = $path?: $this->path;
        if (!is_readable($path))
            throw new \Exception('该文章内容加载失败');

        $reader = fopen($path, 'r');
        $content = '';
        while (!feof($reader)) {
            $content .= fread($reader, 8192);
        }
        fclose($reader);
        return $content;
    }

    public function saveContentBody(&$rows, $file = null) {
        if (!$file) {
            $now = date("Ymd", time());
            $dir = $this->dir . $now;
            if (!file_exists($dir))
                mkdir($dir, 0750, true);

            $file = $dir . '/' . random_mix(15);
        }
        $writer = fopen($file, 'w');
        if (!$writer)
            throw new \Exception('文件打开失败');

        fwrite($writer, $rows);
        fclose($writer);
        return $file;
    }
}
