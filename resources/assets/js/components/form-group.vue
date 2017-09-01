<!--<form-group name="xxx" text="FORMGROUP元素" help="{{$errors->has('time')}}" help-text="显示的错误信息">-->
<!--<input type="text" class="form-control" id="xxx" name="name" placeholder="无锡国网, {{$errors->has('time')}}" value="{{old('name')}}"/>-->
<!--</form-group>-->
<template>
	<div class="form-group" :class="specialClass">
		<label :for="name" class="col-sm-2 control-label">{{text}}&nbsp;<strong v-if='must'
		                                                                        class="must red">*</strong></label>
		<div class="col-sm-6">
			<slot></slot>

			<span class="help-block red" v-if="showHelp">
				<strong>{{helpText}}</strong>
			</span>
		</div>
	</div>
</template>

<script>
    export default{
        props: {
            name: {
                type: String
            },
            text: {
                type: String,
                required: true
            },
            must: {
                type: Boolean,
                default: false
            },
            help: {
                default: ""
            },
            helpText: {
                type: String,
                default: ''
            },
            specialClass: {
                default: ''
            }
        },
        computed: {
            showHelp: function(){
                return this.help == 1;
            }
        }
    }

</script>
