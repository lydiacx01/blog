<template>
	<div class="page_index">
		<span class="prev" @click="prev" @mouseout="onmouseout" @mouseover="onmouseover">上一页</span>
		<span v-for="(item, index) in index" :class="pageClass[index]"
		      @mouseout="onmouseout" @mouseover="onmouseover" @click="onclick"> {{item}} </span>
		<span class="next" @click="next" @mouseout="onmouseout" @mouseover="onmouseover">下一页</span>
	</div>
</template>

<script>
     /*
     <page-index :index="{{$pageIndex}}" v-on:query="newQuery"></page-index>
     实例示范，必须要监听query事件，因为该组件会触发query事件
     var vue = new Vue({
            el: '#app',
            methods: {
                newQuery: function(page) {
                    alert("此时点击的页数=" + page);
                }
            }
        });*/
    export default{
        //父組件通過props傳值到子组件, 且命名遵循xx-xx格式比较好
        props: {
            index: {
                type: Array,
                required: true
            }
        },
        data: function(){
            return {
                currentPage: 1
            }
        },
        methods: {
            onmouseover: function(e) {
                var theTarget = $(e.target);
                if (!theTarget.hasClass('current') && !theTarget.hasClass('omitted')) {
                    theTarget.addClass('hoverred');
                }
            },
            onmouseout: function(e) {
                 var theTarget = $(e.target);
                if (!theTarget.hasClass('current') && !theTarget.hasClass('omitted')) {
                    theTarget.removeClass('hoverred');
                }
            },
            onclick: function(e) {
                var value = Number($(e.target).text());
                if (value == this.currentPage || isNaN(value))
                   return false;
                this.$emit('query', value);
                this.currentPage = value;
            },
            prev: function(e) {
                if (this.currentPage > 1) {
                    this.$emit('query',  this.currentPage - 1);
                    -- this.currentPage;
                }
            },
            next: function(e) {
                 var max = this.index[this.index.length - 1];
                 if (this.currentPage < max) {
                    this.$emit('query', this.currentPage + 1);
                    ++ this.currentPage;
                 }
            }
        },
        computed: {
             pageClass: function() {
                var self = this;
               return this.index.map(function(val) {
                    if (val == self.currentPage)
                        return 'current';
                    else if (val == '...')
                        return 'omitted';
                    else
                        return '';
               });
            }
        }
    }


</script>
