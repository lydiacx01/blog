<template>
	<div class="multi-level-linkage" :id="wrapId">
		<select is="selectWrap" :attribute-store-value="true" :wrap-class="'level-1'"
		        :select-class="'select-level-1'" :select-id="(needId? 'select-level-1' : '')"
		        :select-name="selectNames[0]" :default-text="defaultTexts[0]"
		        :values="initValues" @triggerChange="changeRoot">
		</select>
		<select is="selectWrap" :attribute-store-value="false" :wrap-class="'level-2'"
		        :select-class="'select-level-2'" :select-id="(needId? 'select-level-2' : '')"
		        :select-name="selectNames[1]" :default-text="defaultTexts[1]" @triggerChange="changeOther">
		</select>
		<select v-if="level > 2" is="selectWrap" v-for="index in otherLevel" :attribute-store-value="false"
		        :wrap-class="'level-'+ (index + 2) + (index==otherLevel && otherLevel%2? ' last' : '')"
		        :select-class="'select-level-'+ (index + 2)" :select-id="(needId? 'select-level-'+ (index + 2): '')"
		        :select-name="selectNames[index+1]" :default-text="defaultTexts[index+1]" :http-url="urls[index-1]"
		        @triggerChange="changeOther">
		</select>
	</div>
</template>

<script>
    import selectWrap from './select-wrap.vue';

    export default{
        components:{
            selectWrap
        },
        props: {
            wrapId: {
                type: String,
                required: true
            },
            //是几级联动，至少是2级联动
            level: {
                type: Number,
                default: 2,
                validator: function(value) {
                    return value >= 2;
                }
            },
            //name属性
            selectNames: {
                type: Array,
                required: true
            },
            //默认值文本
            defaultTexts: {
                type: Array,
                required: true
            },
            //初始化
            initValues: {
                type: Object,
                required: true
            },
            //从第三级开始的请求url，会以HTTP GET的方式请求
            urls: {
                type: Array,
                default: function() {
                    return []
                }
            },
            //若同一页面多次调用该组件， 设置needId = false
            needId: {
                type: Boolean,
                default: true
            }
        },
        data: function (){
            return {
                //除了前2级，还剩下otherLevel级
                otherLevel: this.level - 2,
                //从2级联动开始，后面联动的赋值格式，text表示option的显示文本,value表示option的value
                optionText: 'text',
                optionValue: 'value'
            }
        },
        created: function() {
            var nameLen, defaultTextLen, urlLen;
            nameLen = this.selectNames.length;
            defaultTextLen = this.defaultTexts.length;
            urlLen = this.urls.length;
            if (this.level > 7 || nameLen != this.level || defaultTextLen > this.level || urlLen != this.otherLevel) {
                console.error("多级联动的参数设置错误");
                return false;
            }
        },
        methods: {
            //按照一定规则生成level-2个元素的数组,原本是想用于生成data的初始值的，不确定computed在什么时候执行
            iteratorOtherLevel: function(value, useIndex = false) {
                var all, i;
                all = [];
                for (i=3; i<= this.level; ++i) {
                    if (useIndex) {
                        all.push(value + i);
                    } else {
                        all.push(value);
                    }
                }
                return all;
            },
            changeRoot: function(elem, val, txt, attr) {
                if (val) {
                    attr = JSON.parse(attr);
                    this.relationshipChange(elem, attr);
                } else {
                    this.relationshipChange(elem, []);
                    return false;
                }
            },
            changeOther: function(elem, val, txt, attr) {
                var currentLevel, self, i, data, tmp, wrap;
                currentLevel = Number(elem.className.substr(-1));

                this.$parent.$emit('changeSelect', val, txt);
                //最后一个联动不做任何操作
                if (currentLevel == this.level) {
                    return false;
                }
                if (!elem.value) {
                    this.relationshipChange(elem, []);
                    return false;
                }

                data = {};
                self = this;
                wrap = document.getElementById(this.wrapId).children;
                //参数值是从1~当前级数的值

                for (var p=0; p < wrap.length; ++p) {
                    var tmp = wrap[p].firstElementChild;
                    if (tmp.className.substr(-1) > currentLevel) break;

                    data[tmp.name] = tmp.value;
                }

                //对于异常，直接抛错！
                $.ajax({
                    url: this.urls[currentLevel-2],
                    data: data,
                    method: "get",
                    error: function(xhr, textStatus, errorThrown) {
                        alert("出错啦！");
                    },
                    success: function(result) {
                        if (result.status == 'success') {
                            self.relationshipChange(elem, result.content);
                        } else {
                            window.location.href = result.content;
                        }
                    }
                });
                return false;
            },
            relationshipChange: function(elem, options) {
                var currentLevel, parent, i;

                currentLevel = Number(elem.className.substr(-1));
                 //邻近元素
                parent = elem.parentElement;
                //邻近元素清空，并生成对应options的option选项
                this.createNewOptions(parent.nextElementSibling.firstElementChild, options);
                ++ currentLevel;

                //邻近元素之后的所有元素,都是重置为空值
                if (currentLevel < this.level) {
                    i = parent.parentElement.children;
                    for (var p=0; p<i.length; ++p) {
                        var tmp = i[p].firstElementChild;
                        if (tmp.className.substr(-1) <= currentLevel) continue;
                        this.createNewOptions(tmp, []);
                    }
                }
            },
            createNewOptions: function(element, options) {
                var currentLevel, defaultText, newOptions, i, tmp;
                $(element).empty();
                currentLevel = Number(element.className.substr(-1));
                defaultText = this.defaultTexts[currentLevel - 1];
                newOptions = "<option value=''>" + defaultText + "</option>";
                //因为是第2级开始，至最后一级联动，都会经过这里
                for(i=0; i<options.length; ++i) {
                    tmp = options[i];
                    newOptions += '<option value="' + tmp[this.optionValue] + '">' + tmp[this.optionText] + '</option>';
                }

                $(element).append(newOptions);
            }
        }
    }

</script>
