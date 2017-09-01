<template>
	<!--一个超链接-->
	<td v-if="tdType == 'link'">
		<a v-for="(value,key) in tdValues" :href="key"> {{value}}</a>
	</td>
	<!--字符串-->
	<td v-else>
		{{tdValues}}
	</td>
</template>

<script>

    export default{
       props: {
            //如果是超链接，则为一个数组
           tdValues: {
                default: ''
           }
       },
       computed: {
            tdType: function() {
                return typeof(this.tdValues) == 'string'? '' : 'link';
            }
       }
    }


</script>
