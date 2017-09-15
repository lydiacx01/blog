@extends('blog.main_container')

@section('bar-wrap')
    <a class="btn btn-danger" href="/blog/n">写文章</a>
    <a class="btn btn-default" href="/blog/category">文章类别</a>
@endsection

@section('main')
    <div id="article-list" data-url="{{$next}}">
        <ul>
            @foreach($items as $article)
                <li class="article-item">
                    <div class="article-info">
                        <a class="article-title" href="/blog/s/{{$article->id}}">{{$article->title}}</a>
                        <span class="info">{{$article->categoryName}}</span>
                        <span class="info">{{$article->updated_at}}</span>
                    </div>

                    <div class="article-description">
                        {{$article->description}}
                    </div>
                </li>
            @endforeach
        </ul>
        <div class="end {{$next? 'hide': ''}}">
            没有更多了
        </div>
    </div>
@endsection

