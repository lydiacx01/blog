<template>
	<div class="select-wrap" :class="wrapClass">
		<select :id="selectId" :class="selectClass" :name="selectName" :data-http="httpUrl" @change.stop="changeSelect">
			<option value="">{{defaultText}}</option>
			<option v-for="(item, index) in values" is="selectOption" :index="index" :item="item"
			        :attribute-store-value="attributeStoreValue"></option>
		</select>
	</div>
</template>
<script>
    import selectOption from './select-option.vue';
    export default{
        components: {
            selectOption
        },
        props: {
            wrapClass: {
                type: String,
                required: true
            },
            httpUrl: {
                type: String,
                default: ''
            },
            selectId: {
                type: String,
                required: false
            },
            selectClass: {
                type: String,
                required: false
            },
            selectName: {
                type: String,
                required: true
            },
            defaultText: {
                type: String,
                default: '-- 选择 --'
            },
            attributeStoreValue: {
                type: Boolean,
                default: false
            },
            values: {
                default: function() {
                    return {}
                }
            }
        },
        created: function() {
            if (this.attributeStoreValue && this.values.length < 1) {
                console.error('select-wrap使用错误！');
                return false;
            }
        },
        methods: {
            changeSelect: function(e) {
                var targ, attr, val, txt;
                 targ = e.target;
                 attr = null;
                if (this.attributeStoreValue) {
                    attr = targ.selectedOptions[0].getAttribute('data-title');
                }
                val = targ.value;
                txt = targ.selectedOptions[0].innerHTML;
                //触发当前组件的triggerChange事件
                this.$emit('triggerChange', targ, val, txt, attr);
            }
        }
    }

</script>
