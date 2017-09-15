@extends('blog.blog_base')

@section('main-container')
    <div id="main-container">
        <form class="container-form" method="post" action="/blog/save">
            <div id="main">
                <div class="bar-wrap">
                    <div class="bar-button">
                        @yield('bar-wrap')
                    </div>
                </div>

                @yield('main')
            </div>

            <div class="popup">
                @yield('popup')
            </div>
        </form>
    </div>

    <div id="mask">
    </div>
@endsection