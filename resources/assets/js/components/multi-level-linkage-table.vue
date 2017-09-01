<template>
    <div class="multi-level-linkage-table">
        <div class="query-wrap">
            <multiLevelLinkage :level="level"
                                 wrap-id="query-select-wrap"
                                 :select-names="selectNames"
                                 :default-texts="defaultTexts"
                                 :urls="urls"
                                 :init-values="initValues">
            </multiLevelLinkage>
            <div class="other-query">
                <slot></slot>
            </div>
        </div>

        <div class="list-wrap">
            <tableOrWarning :title="title"
                              :need-total="needTotal"
                              :need-download = "needDownload"
                              :download-file-url="downloadFileUrl"
                              :init-url="tableUrl"
                              :ids="tableQueryIds"
                              :listen-trigger="triggerId">
            </tableOrWarning>
        </div>
    </div>
</template>

<script>
    import multiLevelLinkage from './multi-level-linkage.vue'
    import tableOrWarning from './table-or-warning.vue'

    export default{
        props: {
            level: {
                type: Number
            },
            selectNames: {
                type: Array,
                require: true
            },
            defaultTexts: {
                type: Array,
                required: true
            },
            urls: {
                type: Array
            },
            initValues: {
                type: Object,
                required: true
            },
            title: {
                type: String,
            },
            //是否显示表格记录总数
            needTotal: {
                type: Boolean,
                default: false
            },
            //是否需要下载表格内容
            needDownload: {
                type: Boolean,
                default: false
            },
            downloadFileUrl: {
                type: String,
                default: ''
            },
            tableUrl: {
                type: String,
                required: true
            },
             /**
              * 分页一点击，会传post请求到后台，除去所需页数，可能还需要其他参数，这个prop提供这些参数对应元素(input/select/textarea等表单元素)的id
              * 多个元素，就用_分隔，比如： 某些元素的id是 x1, x2, x3,则给出的ids='x1_x2_x3'
              * 若需要在提交前check某些值必须存在，比如x1和x2的值必须存在，则给出的ids='x1:required=省份_x2:=required:城市_x3'
              * 其中，required表示该字段是必须有值的，省份、城市分别表示x1 x2在报错时对应的中文，即：若x1值不存在，则报错内容是：必须提供省份后再提交！
              * 不适用于上传文件\多选框
              */
            tableQueryIds: {
                type: String,
                default: ''
            },
            /**
             * 监听发起请求的按键的id，可不提供
             */
            triggerId: {
                type: String,
				default: ''
            }
        },
       components: {
            multiLevelLinkage,
            tableOrWarning
       }
    }
</script>
