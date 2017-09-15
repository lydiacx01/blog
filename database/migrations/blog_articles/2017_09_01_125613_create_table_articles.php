<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableArticles extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->increments('id');
            $table->string('title', 30);
            $table->string('description', 255)->nullable();
            $table->string('category_name', 10);
            $table->integer('content_id')->unsigned()->nullable();
            $table->timestamps();

            //索引
            $table->foreign('content_id')->references('id')->on('contents');
            $table->index(['category_name', 'updated_at'], 'category_update');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('articles');
    }
}
