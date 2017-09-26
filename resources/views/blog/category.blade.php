@extends('blog.main_container')

@section('bar-wrap')
    <a class="btn btn-danger" href="/blog/n">写文章</a>
    <a class="btn btn-default" href="/blog/">所有文章</a>
@endsection
@section('main')
    <h3>分类列表</h3>
    @if (isset($tableBody) && $tableBody)
        <div id="category-list">
            <custome-table :body="{{$tableBody}}" :head="{{$tableHead}}">
            </custome-table>
        </div>
    @else
        <warning msg="还没有任何分类!"></warning>
    @endif

    <div id="new-category">
        <form method="get" action="/blog/category/n">
            <add-input-group name="category">
                <button id="submit-new-category" class="btn btn-primary" type="submit">提交</button>
            </add-input-group>
        </form>
    </div>
@endsection
