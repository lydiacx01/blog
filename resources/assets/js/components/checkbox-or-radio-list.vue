<template>
    <ul class="checkbox-or-radio-list" :id="id">
        <li v-for="(item,index) in list">
            <checkboxOrRadio special-class="multi-item-parts" :type="type" :name="name" :value="index"
                             :checked="defaultValue" @changed="changed" v-if="typeof item == 'object'">
                <div class="checkbox-or-radio-list-item" v-if="itemShow.length">
                    <p v-for="v in itemShow" :class="'item-' + v">{{item[v]}}</p>
                </div>
                <div class="checkbox-or-radio-list-item" v-else>
                    <p v-for="(v,k) in item" :class="'item-'+k">{{v}}</p>
                </div>
            </checkboxOrRadio>
            <checkboxOrRadio :type="type" :name="name" :value="index" :checked="defaultValue" @changed="changed" v-else>
                <span>{{item}}</span>
            </checkboxOrRadio>

        </li>
    </ul>
</template>
<style>

</style>
<script>
    import checkboxOrRadio from './checkbox-or-radio.vue'

    export default{
       props: {
         id: {
            type: String,
            default: ''
         },
         list: {
            default: function() {
                return {};
            }
         },
         type: {
            type: String,
            default: 'checkbox'
         },
         name: {
            type: String,
            default: ''
         },
         defaultValue: {
            type: String,
            default: ''
         },
         //若item是一个对象,该值表示其能显示的属性
         itemShow: {
            type: Array,
            default: function() {
                return []
            }
         }
        },
        components:{
           checkboxOrRadio
        },
        methods: {
           changed: function(checkedValue) {
                 this.$emit('newvalue', checkedValue);
           }
       }
    }
</script>
