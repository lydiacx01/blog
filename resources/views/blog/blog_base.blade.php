@extends('layouts.base')

@section('title')
    茜仔's BLOG
@endsection

@section('content')
    <div class="header">
        <div class="marker">
            <h3>茜仔's BLOG</h3>
            <p>就是那么爱折腾 !</p>
        </div>
    </div>

    <div class="body-container">
        @yield('main-container')
    </div>
    <div class="footer">

    </div>
@endsection

@section('styles')
    <link rel="stylesheet" type="text/css" href="/stylus/blog-base.css">
@endsection

@section('js')
    <script type="application/javascript" src="/js/blog-base.js"></script>
@endsection