<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

//blog
Route::group(['prefix' => '/blog', 'namespace' => 'Blog'], function() {
    //display
    Route::get('/', 'BlogController@all');
    Route::get('/s/{id}', 'BlogController@showArticle');
    //new or edit
    Route::get('/n', 'BlogController@newArticle');
    Route::post('/save', 'BlogController@saveArticle');
    Route::get('/e/{id}', 'BlogController@editArticle');
    //category
    Route::get('/category', 'BlogController@category');
    Route::get('/newCategory', 'BlogController@newCategory');
    Route::get('/saveCategory', 'BlogController@saveCategory');
});

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
