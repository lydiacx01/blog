<template>
	<div class="add-input-group">
		<input type="hidden" :name="name" :value="itemsValue"/>
		<div v-for="(item, index) in items" is="inlineButton" :msg="item" :canRemove="false"
		     @remove="items.splice(index, 1);">
		</div>
		<button class="btn btn-danger" :disabled="disableBtn" @click="showInput">
			<span class="glyphicon glyphicon-plus"></span>
			添加
		</button>
		<div class="input-container" v-show="show">
			<span @click="show=false;">&times;</span>
			<input type="text" v-model="inputValue"/>
			<button class="btn btn-danger" @click="addNewItem" :disabled="isEmpty">确认添加</button>
		</div>
	</div>
</template>

<script>
    //不能用inline-button命名
    import inlineButton from "./inline-button.vue"

     export default{
        //input的name
        props: {
            name: { default: ''},
            oldValue: {
                type: String,
                default: ''
            }
        },
        data: function() {
            return {
                show: false,
                items: [],
                inputValue: ''
            }
        },
        created: function() {
            if (this.oldValue) {
                this.items = this.oldValue.split(',');
             }
        },
        computed: {
            disableBtn: function() {
                return this.show;
            },
            itemsValue: function() {
                return this.items.toString();
            },
            isEmpty: function() {
                //是否为空字符串
                return (new RegExp('^[ ]*$')).test(this.inputValue.trim());
            }
        },
        methods: {
            showInput: function(e) {
                this.show = !this.show;
                return false;
            },
            addNewItem: function() {
                this.items.push(this.inputValue);
                this.inputValue = '';
                this.show = false;
                return false;
            }
        },
        components: {
            inlineButton
        }
     }


</script>