<!--
   调用示例：
    <table-or-warning title="报表配置表" init-url="/report/config/all" msg="还没有配置任何报表信息" warning-url="/report/config/create" atext="新建配置">

    </table-or-warning>
   后端先传一个不含任何参数的view对象，在window.onload时，会post到initUrl去获取表格内容，具体可参考 ReportConfigController中的showAllView 和 all方法
   -->
<template>
	<div class="table-or-warning" v-if="show">
		<submitProgress :value="progressValue"></submitProgress>
		<div class="table-title">
			<h3>{{title}}</h3>
			<span class="total margin-lr-10" v-if="needTotal">总共：<span class="red">{{total}}</span></span>
			<downloadFileLink text="下载表格" :argIds="argIds" :url="downloadFileUrl" v-if="needDownload"></downloadFileLink>
		</div>
		<customeTable :head="tableHead" :body="tableBody"></customeTable>
		<!--如需不显示分页信息,则在后端传值时，将pageIndex设置成"[]"-->
		<div class="page" v-if="needPage">
			<pageIndex :index="pageIndex" v-on:query="commitNewQuery"></pageIndex>
		</div>
	</div>
	<!--如需显示warning,则在后端传值时，将tableHead/tableBody/pageIndex都设置成"[]"-->
	<div class="table-or-warning" v-else>
		<downloadFileLink text="下载表格" :argIds="argIds" :url="downloadFileUrl" v-if="needDownload"></downloadFileLink>
		<warning :msg="msg" :url="warningUrl" :atext="atext"></warning>
	</div>
</template>

<script>
    import submitProgress from './submit-progress.vue';
    import customeTable from './custome-table.vue';
    import pageIndex from './page-index.vue';
    import warning from './warning.vue';
    import downloadFileLink from './download-file-link.vue';
    export default{
        props: {
            title: {
                type: String,
                default: ''
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
            msg: {
                type: String,
                default: '没有数据'
            },
            warningUrl: {
                type: String,
                default: ''
            },
            atext: {
                type: String,
                default: ''
            },
            /**
              * 分页一点击，会传post请求到后台，除去所需页数，可能还需要其他参数，这个prop提供这些参数对应元素(input/select/textarea等表单元素)的id
              * 多个元素，就用_分隔，比如： 某些元素的id是 x1, x2, x3,则给出的ids='x1_x2_x3'
              * 若需要在提交前check某些值必须存在，比如x1和x2的值必须存在，则给出的ids='x1:required=省份_x2:=required:城市_x3'
              * 其中，required表示该字段是必须有值的，省份、城市分别表示x1 x2在报错时对应的中文，即：若x1值不存在，则报错内容是：必须提供省份后再提交！
              * 不适用于上传文件\多选框
              */
            ids: {
                type: String,
                default: ''
            },
            /**
             * 初始化表格时，url走initUrl,其请求方式是initMethodType
             */
            initUrl: {
                type: String,
                default: '',
                required: true
            },
            /**
             * 监听发起请求的按键的id，可不提供
             */
            listenTrigger: {
				type: String,
				default: ''
            }
        },
        data(){
           return {
               progressValue: undefined,
               isInit: true,
               total: "0 条",
               tableHead: [],
               tableBody: [],
               pageIndex: [],
               defaultResult: {
                    tableHead: "[]",
                    tableBody: "[]",
                    pageIndex: "[]"
               }
           }
        },
        mounted() {
            if (this.listenTrigger){
                var self = this;
				document.getElementById(this.listenTrigger).onclick = function(e) {
				  	var targ = e.target;
					e.target.disabled = true;
					self.commitNewQuery(1);
					setTimeout(function() {
					   targ.disabled = false;
					}, 3000);
				}
            }
        },
        created: function() {
            this.commitNewQuery(1);
        },
        components:{
            submitProgress,
            customeTable,
            pageIndex,
            warning,
            downloadFileLink
        },
        computed: {
            argIds: function() {
                var tmp = this.ids.split('_'),
                item,
                res = [];
				for (var i=0; i< tmp.length; ++i) {
					item = tmp[i].split(':');
					res[i] = item[0];
				}
				res = res.join('_');
				return res;
            },
            show: function() {
                return this.tableHead.length && this.tableBody.length;
            },
            needPage: function() {
                return this.tableHead.length && this.tableBody.length && this.pageIndex.length;
            }
        },
        methods: {
            commitNewQuery: function(currentPage) {
                if (window.XMLHttpRequest==undefined || window.FormData == undefined) {
                    alert("不支持该浏览器，请更换其他常用浏览器，比如chrome、火狐等");
                    return false;
                }
               //请求参数
                var data = this.parseData(currentPage);
				if (data !== false) {
					//请求对象
	                var xhr = new XMLHttpRequest();
	                var self = this;
	                var response = {};
	                xhr.open('POST', this.initUrl, true);
	                //请求成功，得到响应
	                xhr.onload = function() {
	                    if (this.status == 200) {
	                        response = xhr.responseText;
	                        var pos = response.indexOf('tableBody', response);
	                        var data = pos != -1? JSON.parse(response) : self.defaultResult;
	                        self.loadData(data);
	                        self.$parent.$emit('afterQuery', response);
	                    } else {
	                        alert("页面请求出错啦，状态码：" + this.status +"！请刷新后重新操作！");
	                    }
	                };
	                //请求失败
	                xhr.onerror = function(e) {
	                    alert("页面请求出错了，原因：" + e + "！请刷新后重新操作！");
	                };
	                //请求过程中
	                xhr.upload.onprogress = this.submitOnProgress;
	                xhr.send(data);
				}
            },
            parseData: function(currentPage) {
				var data = new FormData(), ids, tmp, elem, check, v;
				data.append('_token', $("meta[name=csrf-token]").attr("content"));
	            data.append('currentPage', currentPage);
                if (this.ids) {
					ids = this.ids.split('_');
					for (var i=0; i < ids.length; ++i) {
						tmp = ids[i].split(':');
						elem = document.getElementById(tmp[0]);
						if (!elem) continue;
						//对请求参数做检查
						if (tmp[1] != undefined) {
							check = tmp[1].split('=');
							if (check[0] == 'required' && !elem.value.length) {
								alert('必须提供' + check[1] + '才能提交！');
								return false;
							}
						}
						v = elem.type == 'checkbox'? elem.checked : elem.value;
						data.append(elem.name, v);
					}
                }
                return data;
            },
            loadData: function(result) {
                this.tableHead = JSON.parse(result.tableHead);
                this.tableBody = JSON.parse(result.tableBody);
                if (result.pageIndex != undefined) {
                    this.pageIndex = JSON.parse(result.pageIndex);
                }
                if (result.total != undefined) {
                    this.total = Number(result.total) + "条";
                }

                if (this.isInit) {
                    this.isInit = false;
                }
            },
            submitOnProgress: function(event) {
                var max = event.total;
                var current = event.loaded;
                var percent = current / max * 100;
                this.progressValue = percent.toFixed(1);
            }
        }
    }



</script>
