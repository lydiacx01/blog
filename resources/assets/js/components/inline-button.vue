<template>
	<div class="inline-button" v-if="show">
		<span @click="remove" class="close" :class="needClose">&times;</span>
		<span class="btn btn-default">
            {{msg}}
        </span>
	</div>
</template>
<script>
    export default{
        props: {
            //是否需要x来控制显示
            needClose: {
                type: String,
                default: ''
            },
            //显示的内容
            msg: {
                type: String,
                required: true
            },
            //x是否能删除当前的组件, 如为false,其父组件要监听remove事件
            canRemove: {
                type: Boolean,
                default: true
            }
        },
        data: function() {
            return {show: true}
        },
        methods: {
            remove: function() {
                if (this.canRemove) {
                    this.show=false;
                }
                else{
                    this.$emit('remove');
                }
            }
        }
    }


</script>
