@extends('blog.main_container')

@section('bar-wrap')
    <a class="btn btn-danger" href="/blog/e/{{$id}}">编辑文章</a>
    <a class="btn btn-default" href="/blog/">所有文章</a>
@endsection
@section('main')
    <div class="show-header">
        <h3>{{$title}}</h3>
        <div class="show-info">
            分类： <span>{{$category}}</span>
            更新时间： <span>{{$updatedTime}}</span>
        </div>
    </div>

    <div id="ht" data-text="{{$content}}">
    </div>
@endsection
