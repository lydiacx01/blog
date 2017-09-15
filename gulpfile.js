const elixir = require('laravel-elixir');

require('laravel-elixir-vue-2');
require('laravel-elixir-webpack-official');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(mix => {
    mix.webpack('bootstrap.js');
    mix.sass('app.scss')
        .webpack('app.js');
    mix.webpack('common-func.js');
    mix.webpack('geo-distance.js');
    mix.webpack('cookieObj.js');
    mix.webpack('blog/base.js', 'public/js/blog-base.js');

    //stylus
    mix.stylus('functions.styl', 'public/stylus/functions.css');
    mix.stylus('common.styl', 'public/stylus/common.css');
    mix.stylus('blog/base.styl', 'public/stylus/blog-base.css');
});

