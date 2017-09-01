<template>
	<div v-if="start">
		<div class="submit-on-progress-mask" :style="maskStyle"></div>
		<div class="progress">
			<div class="progress-bar" role="progressbar" :aria-valuenow="value" aria-valuemin="0" aria-valuemax="100"
			     :style="progressBarStyle">
				{{percent}}
			</div>
		</div>
	</div>
</template>

<script>

    export default{
        props: ['value'],
        data(){
            return{
                percent: false,
                start: false,
                maskStyle: {},
                progressBarStyle: {}
            }
        },
        computed: {
            percent: function() {
                return this.value === undefined || this.value === false? false : this.value + '%';
            },
            start: function() {
                return  this.percent !== false && this.percent !== '100.0%';
            }
        },
        watch: {
            start: 'startProgress',
            percent: 'percentChange'
        },
        methods: {
            startProgress: function() {
                var body = $("body");

                if (this.start) {
                    body.css('overflow', 'hidden');
                    this.maskStyle.width = $(document).width() + 'px';
                    this.maskStyle.height = $(document).height() + 'px';
                }
                else {
                    body.css('overflow', 'auto');
                    this.maskStyle.width = 0;
                    this.maskStyle.height = 0;
                }
            },
            percentChange: function() {
                this.progressBarStyle.width = this.percent;
            }
        }
    }


</script>
