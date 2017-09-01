<template>
	<div class="download-file-link margin-ub-10">
		<a class="btn btn-primary" @click="getFiles">{{text}}</a>
		<a download></a>
	</div>
</template>

<script>
    export default {
        props: {
            text: {
                type: String,
                default: '下载文件'
            },
            url: {
                type: String,
                required: true
            },
            argIds: { //用_分隔, 表示http中get参数的元素id
                type: String,
                default: ''
            },
            requiredArgIds: { //用_分隔, 表示http中get参数中，一定需要值的元素id，必须在argIds中出现,这个只做check用
                type: String,
                default: ''
            }
        },
        methods: {
            getFiles: function(event) {
                 var e = $(event.target), url = this.url, args = [];
                 e.attr('disabled', true);
                 setTimeout(function() {
                    e.attr('disabled', false);
                 }, 15000);

                 if (this.argIds) {
                    args = this.argIds.split('_');
                    for (var index in args) {
                        var id = args[index];
                        var elem = $('#' + id);
                        if (elem.length < 1) {
                            console.error('id=' + id + '的元素不存在！');
                            return false;
                        }

                        var eName = elem.attr('name');
                        var eVal = elem.attr('type') == 'checkbox'? elem[0].checked : elem.val();
                        if (eVal.length < 1 && this.requiredArgIds.search(id) != -1) {
                            alert( eName + "参数缺失！");
                            return false;
                        }

                       args[index] = eName + '=' + eVal;
                    }
                    url +=  '?' + args.join('&');
                 }

                 $.ajaxSetup({
                    error: function(xhr, e) {
                        alert("下载失败，错误码：" + xhr.status);
                    }
                 });

                 $.get(url, function (result) {
                    if (result.error) {
                        alert(result.error);
                    }
                    else {
                        var link = $(event.target).next("a")[0];
                        link.href = result;
                        $(link)[0].click();
                    }
                });

                this.$emit('download');
            }
        }
    }

</script>
