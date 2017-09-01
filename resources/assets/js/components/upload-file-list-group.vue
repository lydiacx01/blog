<template>
	<div class="upload-file-list-group">
		<a href="#" class="btn btn-primary form-control">
			<input v-if="multifile==true" type="file" :accept="accept" :required="required" :name="name"
			       @change="uploadChanged" class="form-control" multiple/>
			<input v-else type="file" :accept="accept" :required="required" :name="name" @change="uploadChanged"
			       class="form-control"/>
			<span>上传</span>
		</a>

		<!--高级法&#45;&#45;多次上传，一次提交-->
		<ul class="list">
			<li v-for="(oneFile, index) in files" is="customeLi" :text="oneFile.name" :index="index" :removable="false"
			    @remove="removeFile">
			</li>
		</ul>
	</div>
</template>

<script>
    import customeLi from './custome-li.vue';

    export default{
        props: {
            name: '',
            accept: {
                default: '*/*'
            },
            multifile: {
                type: Boolean,
                default: true
            },
            required: {
                type: Boolean,
                default: true
            }
        },
        data: function(){
            return {
                files: []
            }
        },
        components: {
            customeLi
        },
        methods: {
            uploadChanged: function(e) {
                //添加新上传的文件去展示
                this.files = [];
                var newFiles = e.target.files;
                for (var i=0; i<newFiles.length; ++i) {
                    this.files.push(newFiles[i]);
                }
            },
            removeFile: function(index) {
                this.files.splice(index, 1);
            }
        }
    }

</script>
