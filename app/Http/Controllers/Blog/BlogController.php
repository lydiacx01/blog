<?php
/**
 * Created by PhpStorm.
 * User: lydia
 * Date: 17-9-4
 * Time: 下午1:23
 */

namespace App\Http\Controllers\Blog;


use App\Blog\Article;
use App\Blog\Category;
use App\Blog\Content;
use App\Exceptions\BadControllerReponseMethod;
use App\Http\Controllers\Controller;
use App\Http\Requests\BlogSaveRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BlogController extends Controller
{
    public function all(Request $request) {
        $pagi = Article::allList()->simplePaginate(5, ['id', 'title', 'category_name', 'description', 'updated_at']);
        $needPage = intval($request->input('page'));
        $params = [
            'items' => $pagi->items(),
            'next' => $pagi->nextPageUrl()
        ];
        if ($needPage <= 0) {
            return view('blog.all', $params);
        } else {
            return $params;
        }

    }

    public function showArticle($id) {
        try {
            $article = Article::find($id);
            if (!$article)
                throw new \Exception("不存在该文章!");

            $content = $article->content;
            if (!$content)
                throw new \Exception('不存在该文章的内容！');

            //读取文件
            $body = $content->readContentBody();
            $params = [
                'id' => $id,
                'title' => $article->title,
                'category' => $article->categoryName,
                'updatedTime' => $article->updated_at,
                'content' => $body
            ];

            return view('blog.show', $params);
        } catch (\Exception $e) {
            throw new BadControllerReponseMethod('文章加载失败，' . $e->getMessage(), '/blog');
        }
    }

    public function newArticle() {
        $params = [
            'category' => Category::allName(),
        ];
        return view('blog.new', $params);
    }

    public function editArticle($id) {
        try {
            $article = Article::find($id);
            if (!$article)
                throw new \Exception('不存在该文章！');
            $content = $article->content;
            if (!$content)
                throw new \Exception('不存在该文章的内容！');

            $params = [
                'id' => $id,
                'title' => $article->title,
                'categoryName' => $article->categoryName,
                'content' => $content->readContentBody(),
                'category' => Category::allName(),
                'description' => $article->description
            ];
            return view('blog.new', $params);
        } catch (\Exception $e) {
           throw new BadControllerReponseMethod('文章加载失败，' . $e->getMessage(), '/blog/s/' . $id);
        }
    }

    public function saveArticle(BlogSaveRequest $request) {
        $p = $request->all();
        $path = null;

        try {
            DB::transaction(function($p) use($p){
                if (isset($p['update']) && boolval($p['update']) === true) {var_dump('更新');
                    $article = Article::find($p['code']);
                    if (!$article)
                        throw new \Exception('更新失败，参数错误！');

                    $content = $article->content;
                    $content->saveContentBody($p['content'], $content->path);
                } else {
                    $content = new Content();
                    $path = $content->saveContentBody($p['content']);
                    $content->path = $path;
                    $content->save();
                    $article = new Article();var_dump($content);
                    $article->contentId = $content->id;
                }

                $article->title = $p['title'];
                $article->categoryName = $p['category'];
                $article->description = $p['description'];
                $article->save();

                $content->articleId = $article->id;
                $content->save();
            });
            return redirect('/blog');

        } catch (\Exception $e) {
            if ($path) {
                unlink($path);
            }
            return redirect()->back()
                ->withInput($p)
                ->withErrors(['title' => $e->getMessage()]);
        }
    }

    public function category() {
        return view('blog.category');
    }

    public function newCategory() {

    }

    public function saveCategory() {

    }
}