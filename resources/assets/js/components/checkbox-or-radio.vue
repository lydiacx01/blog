<template>
    <div class="checkbox-or-radio" :class="specialClass" @click.stop="inputChange">
        <span>
            <input class="margin-r-10" :type="type" :name="name" :value="value" :checked="match"/>
            <slot></slot>
        </span>
    </div>
</template>

<script>
    export default{
       props: {
            //选中的值，借此来决定当前input的默认值，允许字符串或数组类型
            checked: {
                default: ''
            },
            specialClass: {
                type: String,
                default: ''
            },
            type: {
                type: String,
                default: 'checkbox',
                validator: function(v) {
                    return v == 'checkbox' || v == 'radio';
                }
            },
            name: {
                type: String,
                default: ''
            },
            value: {
                type: String,
                required: true
            }
        },
        computed: {
            match:  function(){
                    var v = this.checked,
                    o = this.value,
                    t = typeof v,
                    l = v.length,
                    r = false;
                    if (l) {
                        if (t == 'object') {
                            for (var p in v) {
                                if (v[p] == o) {
                                    r = true;
                                    break;
                                }
                            }
                        } else {
                            r = o == v;
                        }
                    }
                    return r;
                }
        },
        methods: {
            inputChange: function(e) {
                var t = e.target, n, s;
                if (e.target.tagName !== 'INPUT') {
                    n = $(t).find('input');
                    n = n.length? n.get(0) : $(t).parents('.checkbox-or-radio').find('input').get(0);
                    s = n.checked;
                    if (n.type == 'checkbox' || (n.type=='radio' && !s)) { //radio只能选一个，checkbox可多选
                        s = !s;
                        n.checked = s;
                        this.$emit('changed', n.value);
                    }
                } else {
                    n = t;
                    this.$emit('changed', n.value);
                }
            }
        }
    }
</script>
