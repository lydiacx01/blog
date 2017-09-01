<template>
	<div class="warning-wrap">
		<span>{{msg}}</span>
		&nbsp;&nbsp;
		<a class="btn btn-primary" v-if="show" :href="url" target="_blank">{{atext}}</a>
	</div>
</template>

<script>
    export default{
       props: ['msg', 'url', 'atext'],
       computed: {
            show: function() {
                return this.url;
            }
       }
    }
</script>
