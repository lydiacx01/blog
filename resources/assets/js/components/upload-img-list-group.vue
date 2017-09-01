<template>
	<div :id="groupId">
		<div class="mask"></div>
		<div class="upload-img-list-group">

			<ul class="file-preview margin-ub-10">
				<li v-for="item in uploader.success.concat(uploader.queue)" :id="item.name">
					<span class="delete-file" @click.stop="removeFile(item)">X</span>
					<div class="file-info">
						<img :src="item.url" style="width:200px;height:200px;" />
						<div class="progress margin-ub-10">
							<div class="progress-bar" style="width:0;" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
								<span>0%</span>
							</div>
						</div>
					</div>
				</li>
			</ul>

			<div class="file-hidden-inputs">
				<input v-for="one in uploader.success" type="hidden" :name="submitInputName" :value="one.fullName" />
			</div>
			<div class="file-error red"></div>

			<div class="file-upload-buttons">
				<a href="javascript:void(0);" class="btn btn-primary margin-lr-10 file-select">
					<span>选择图片</span>
					<input type="file" @change="selectFiles" @click="beforeSelect" multiple>
				</a>
				<a href="javascript:void(0);" class="btn btn-primary file-upload before-queue" disabled="true" @click.stop="upload">上传</a>
			</div>
		</div>
	</div>
</template>

<script>
    //使用示范： <upload-img-list-group submit-input-name="images[]"></upload-img-list-group>
    export default{
        props: {
            maxLimit: {
                type: Number,
                default: 5
            },
            minLimit: {
                type: Number,
                default: 1
            },
            submitInputName: {
                type: String,
                required: true
            },
            groupId: {
                type: String,
                default: ''
            }
        },
        data: function() {
            return {
                options: {
	                expire: 0,
	                host: '',
	                policy: '',
	                OSSAccessKeyId: '',
	                signature: '',
	                key: '',
	                success_action_status: '200'
                },
                STATUS_STOP: 10,
                STATUS_FAIL: 11,
                STATUS_START: 12,
                CODE_ENV: 'environment error',
                CODE_READ: 'img read error',
                CODE_ACCESS: 'oss access failed',
                status: null,
                uploader: {
                    queue: [],
                    success: []
                },
                uploadMethod: 'post'
            }
        },
        mounted: function() {
            var code = this.CODE_ENV,
                //init uploader
				container = this.groupId.length? $('.upload-img-list-group', '#' + this.groupId) : $('.upload-img-list-group'),
	            select = container.find('.file-select'),
	            start = container.find('.file-upload'),
				preview = container.find('.file-preview'),
				inputs = container.find('.file-hidden-inputs'),
				fileError = container.find('.file-error');
				this.uploader = {
					files: {},
					container: container,
					select: select,
					upload: start,
					preview: preview,
					inputs: inputs,
					error: fileError,
					queue: [],
					success: []
				};

            if (typeof(FileReader) == "undefined" || this.getRequester() == null) {
                this.error(code, "您的浏览器版本太低,请升级或更换浏览器", true);
            }
        },
        methods: {
            beforeUpload: function() {
                var tt = this,
                    q=tt.uploader.queue.length,
                    s = tt.uploader.success.length,
                    ln = q + s;

                if (!ln) {
                   tt.error(tt.CODE_ACCESS, '没有选择任何文件，上传失败');
                   return false;
                } else if (!q && s){
                    //有上传过的文件，但没有等待的文件
                    return false;
                }

				//会提示，但不会阻止其上传的行为
				if (ln < tt.minLimit) {
                    tt.error(tt.CODE_ACCESS, "上传数量太少,请一共上传至少"+ tt.minLimit +"张图片!", false);
                }
                //阻止其上传的行为
                else if (ln > tt.maxLimit) {
                    tt.error(tt.CODE_READ, "上传数量太多,请重新上传最多"+ tt.maxLimit +"张图片!", false);
                } else {
                    tt.status = tt.STATUS_START;
                }
				//由于出错，再次点击上传
                if (tt.checkError()) return false;
                return true;
            },
            upload: function(e) {
                e.stopPropagation();
                this.uploader.error.empty();
                var now = Date.parse(new Date()) /1000,
                    tt = this,
                    check = tt.beforeUpload();
				if (!check) return false;

                if (tt.options.expire >= now + 3) {
                    tt.uploading();
                    return false;
                }

				//获取权限
                var xmlHttp = tt.getRequester();
                xmlHttp.onload = function() {
					var res = JSON.parse(xmlHttp.responseText);
	                if (res['error'])  {
	                    tt.error(tt.CODE_ACCESS, res.error);
	                } else {
						tt.getSignature(res);
						tt.uploading();
	                }
                };
				xmlHttp.open('GET', '/getAuth?dir=img&expire=60');
                xmlHttp.send(null);
            },
            getSignature: function(res) {
                this.options.host =  'http://' + res['host'];
				this.options.policy = res['policy'];
				this.options.OSSAccessKeyId = res['accessId'];
				this.options.signature = res['signature'];
				this.options.expire = parseInt(res['expire']);
				this.options.key = res['dir'];
            },
            uploading: function() {
				var tt = this;
				$.each(tt.uploader.queue, function(index, item) {
					var data = new FormData(),
					xhr = tt.getRequester(),
					bar = $('#' + item.name).find('.progress .progress-bar');
					$.each(tt.options, function(name, value) {
						if (name == 'expire' || name == 'host') return;

						data.append(name, value);
					});
					data.append('file', tt.dataUrlToBlob(item.file), item.name);
					xhr.open('POST', tt.options.host);
					xhr.onerror = function(e) {
						tt.progressPercent(bar, 0).parent().addClass('red');
						tt.error(tt.CODE_ACCESS, '上传请求失败' + (location.protocol == 'https:'? '请访问: ' + location.href.replace('https', 'http') : ''),false);
					};
					xhr.upload.onloadstart = function() {
						tt.progressPercent(bar, 0).parent().removeClass('red');
					};
					xhr.upload.onprogress = function (e) {
						var p = e.total? Math.floor(e.loaded / e.total, 3) : 0;
						tt.progressPercent(bar, p);
					};
					xhr.onload = function () {
						var res = xhr.responseText;
						if (res.indexOf('Error') !== -1) {
							var st = res.indexOf('<Message>')+9, ln = res.indexOf('</Message>') - st;
							tt.progressPercent(bar, 0).parent().addClass('red');
							tt.error(tt.CODE_ACCESS,res.substr(st, ln),false);
						}else {
							var successItem = $.extend({},item);
								successItem.fullName = tt.getFullName(data.get('key'), item.name);
							tt.uploader.success.push(successItem);
							tt.removeFromQueue(item.name);
							$('#' + item.name).find('.delete-file').text('O');
						}

					};
					xhr.send(data);
				});
            },
            removeFromQueue: function(name) {
                var tt = this;
				for (var i in tt.uploader.queue) {
					if (tt.uploader.queue[i].name == name) {
						return tt.uploader.queue.splice(i, 1);
					}
				}
            },
            progressPercent: function(bar, p) {
				bar.css('width', p * bar.parent().width()).find('span').text(p * 100 + '%');
				return bar;
            },
			error: function (code, message, needAlert) {
				if (needAlert) {
					alert(message);
				} else {
					//显示在固定地方
					this.uploader.error.html('<p>错误代码:' + code + '# ' + message + '</p>');
				}

				this.status = this.STATUS_FAIL;
				//上传前发送的任何错误都会禁止上传enable
				switch(code) {
					case this.CODE_READ:
						this.enableButton(this.uploader.upload, false);
						break;
					case this.CODE_ENV:
						this.uploader.select.text('选择图片按键失效！');
						this.enableButton(this.uploader.select, false);
						this.$off(); //移除所有监听事件
						break;
					case this.CODE_ACCESS:
						this.status = this.STATUS_START;
						break;
					default:
						break;
				}
			},
			checkError: function() {
				return this.status == this.STATUS_FAIL;
			},
            getRequester: function () {
                var xmlHttp = null;
                if (window.XMLHttpRequest) {
                    xmlHttp = new XMLHttpRequest();
                } else if (window.ActiveXObject) {
                    //IE 7以下的版本
                    xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
                }

                return xmlHttp;
            },
            beforeSelect: function(e) {
                this.status = this.STATUS_STOP;
            },
            //如果是重复选择同样的文件，不会触发input[type=file]的change事件
            selectFiles: function(e) {
                //除了input的files之外，所有上传相关的变量都重置,即使files为空
                this.refresh(),
                this.uploader.select.addClass('repeat'),
                this.uploader.files = e.target.files;
                if (!this.filterFiles()) return false;
				this.handleAndQueuedFiles();
				return false;
            },
            enableButton: function(bt, enable) {
                if (bt.hasClass('file-select')) {
                    enable? bt.addClass('repeat') : bt.removeClass('repeat');
                    bt.find('input').attr('disabled', !enable);
                    this.enableButton(this.uploader.upload, enable);
                } else if (bt.hasClass('file-upload')) {
                    var old = enable? 'before-queue' : 'queued',
					n = enable? 'queued' : 'before-queue';
					bt.attr('disabled', !enable).removeClass(old).addClass(n);
                }
            },
            filterFiles: function() {
				var code = this.CODE_READ,
				files = this.uploader.files;

                for (var index=0; index<files.length; ++ index) {
                    var oneFile = files[index], fileType =oneFile.type;
                    if (fileType.indexOf("image") === -1) {
                        this.error(code, "文件" + oneFile.name  +"不是图片,请重新上传!", false);
                        return false;
                    }
                }
                return true;
            },
            //多次上传时，在预览前做的操作
            refresh: function() {
                var tt = this;
            	//修改status
                tt.status = tt.STATUS_STOP,

                //清除错误信息
                tt.uploader.error.empty();
            },
            handleAndQueuedFiles: function() {
                for(var index=0, files = this.uploader.files; index < files.length; ++ index) {
                    this.displayImage(files[index]);
                }
                //添加到queue之后的操作
				this.enableButton(this.uploader.upload, true);
            },
            //显示一张图片
            displayImage: function(currentFile) {
                var reader = new FileReader(),
                tt = this;
                reader.readAsArrayBuffer(currentFile);

                //成功读取后的操作
                reader.onload = function (event) {
                    window.URL = window.URL || window.webkitURL;
                    var blob = new Blob([event.target.result], {type: currentFile.type}),
                    url = window.URL.createObjectURL(blob),
                    image = new Image();
                    image.src = url;
                    image.onload = function () {
                        //rescale图片
                        var newUrl = tt.resizeImage(image, 0.45),
                            file = {file: newUrl, name: tt.calculateName(), url: newUrl};
                            tt.uploader.queue.push(file);
                    }
                };
                //读取失败后,显示提示信息
                reader.onerror = reader.onabort = function () {
                    tt.error(tt.CODE_READ, '图片读取失败,请重新上传', false);
                };
            },
            removeFile: function(item) {
				if (item.fullName == undefined) {
					this.removeFromQueue(item.name);
					this.uploader.error.empty();
					this.enableButton(this.uploader.upload, true);
				}
				return false;
            },
            calculateName: function() {
				var name = Date.parse(new Date()), len = 27, //40个字符
				chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678',
				maxPos = chars.length,
				pwd = '',
				i = 0;
				for (; i<len; ++i) { pwd += chars.charAt(Math.floor(Math.random() * maxPos));}
				name += pwd;
				return name;
            },
            getFullName: function(dir, name) {
                var s = dir;
                return s.replace(/\$\{filename\}/, name);
            },
            //resize 图片，已减小它的大小，但降低了图片质量. quality是0~1
            resizeImage: function(image, quality) {
                var newWidth = image.width * quality,
                newHeight = image.height *quality,
                canvas = document.createElement("canvas");
                canvas.width = newWidth;
                canvas.height = newHeight;
                canvas.style.marginRight = "10px";
                canvas.getContext("2d").drawImage(image, 0, 0, newWidth, newHeight); //传给oss服务器的图片

                return canvas.toDataURL("image/jpeg", quality);
            },
            dataUrlToBlob: function(url) {
                var g = url.split(','),
                    mime = g[0].match(/:(.*?);/)[1],
                    b = atob(g[1]),
                    l = b.length,
                    u8g = new Uint8Array(l);
                    while(l--) {
                        u8g[l] = b.charCodeAt(l);
                    }
                    return new Blob([u8g], {type: mime});
            }
        }
    }
</script>
