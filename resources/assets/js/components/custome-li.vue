<template>
	<div v-if="show" :index="index">
		<li>
			<span class="close" :removable="removable" @click="remove">&times;</span>
			{{text}}
		</li>
	</div>
</template>

<script>
    export default{
       props: ['text', 'index', 'removable'],
       data: function(){
            return {
                show: true

            }
       },
       methods: {
            remove: function() {
                if (this.removable)
                    this.show = false;
                else
                    this.$emit('remove', this.index);
            }
       }
    }


</script>
