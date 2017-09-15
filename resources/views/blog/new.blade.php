@extends('blog.form_main_container')

@section('bar-wrap')
    <a class="btn btn-default" href="/blog/">所有文章</a>
@endsection

@section('main')
    <div class="submit-before-wrap">
        {{csrf_field()}}

        <form-group name="article-title" text="标题" :must="true" help="{{$errors->has('title')}}" help-text="{{$errors->first('title')}}">
            <input id="article-title" type="text" name="title" placeholder="最多30字"
                   value="{{isset($title)? $title : (old('title')? old('title') : '')}}"/>
        </form-group>

        <form-group name="article-category" text="类别" :must="true" help="{{$errors->has('category')}}" help-text="{{$errors->first('category')}}">
            <select id="article-category" name="category">
                <option value="">请选择</option>
                @foreach ($category as $item)
                    @if ($item == (isset($categoryName)? $categoryName : (old('category')? old('category') : '')))
                        <option value="{{$item}}" selected>{{$item}}</option>
                    @else
                        <option value="{{$item}}">{{$item}}</option>
                    @endif
                @endforeach
            </select>
        </form-group>

        <div class="article-content" data-code="{{isset($id)? $id : ''}}">
            <ul class="nav nav-tabs">
                <li class="active" role="presentation">
                    <a href="#md" data-toggle="tab">Markdown编辑器</a>
                </li>
                <li role="presentation">
                    <a href="#ht" data-toggle="tab">预览</a>
                </li>
            </ul>

            <div class="tab-content">
                <textarea id="md" name="content" class="tab-pane fade in active"  rows="13"
                          data-text="{{isset($content)? $content : (old('content')? old('content') : '')}}"></textarea>
                <div id="ht" class="tab-pane fade"></div>
            </div>
        </div>

        <div class="form-button-wrap">
            <span id="before-submit" class="btn btn-danger">保存文章</span>
        </div>
    </div>
@endsection

@section('popup')
    <div class="submit-after-wrap hide">
        <div class="article-description">
            <form-group name="article-description" text="概述" :must="true" help="{{$errors->has('description')}}" help-text="{{$errors->first('description')}}">
                <textarea id="article-description" type="text" name="description" rows="6" placeholder="最多255字"
                          data-text="{{isset($description)? $description : (old('description')? old('description') : '')}}">
                </textarea>
            </form-group>
        </div>
        <div class="form-button-wrap">
            <button id="submit" class="btn btn-danger">提交文章</button>
            <span id="cancel" class="btn btn-default">取消</span>
        </div>
    </div>
@endsection