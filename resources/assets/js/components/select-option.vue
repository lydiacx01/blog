<!--如果attributeStoreValue=true，值和文本都是index，item意味着用data-title属性去存储给下级联动的option列表值&#45;&#45;一般作为多级联动的第一级联动使用;-->
<!--否则，值和文本都是item-->
<!--index和item是select-wrap中的values数组的索引和键值-->
<template>
	<option v-if="attributeStoreValue" :value="index" :data-title="item">{{index}}</option>
	<option v-else :value="item">{{item}}</option>
</template>

<script>
    export default{
        props: {
            attributeStoreValue: {
                type: Boolean,
                default: false
            },
            index: {
                required: true
            },
            item: {
                required: true
            }
        }
    }

</script>
