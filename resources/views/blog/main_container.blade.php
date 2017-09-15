@extends('blog.blog_base')

@section('main-container')
    <div id="main-container">
        <div class="bar-wrap">
            <div class="bar-button">
                @yield('bar-wrap')
            </div>
        </div>

        @if ($errors->any())
            <warning msg="{{'<p>' . implode('</p><p>', $errors->all()) . '</p>'}}"></warning>
        @endif

        @yield('main')
    </div>
@endsection