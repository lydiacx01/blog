@extends('blog.blog_base')

@section('main-container')
    <div id="main-container">
        <div class="bar-wrap">
            <div class="bar-button">
                @yield('bar-wrap')
            </div>
        </div>

        @yield('main')
    </div>
@endsection