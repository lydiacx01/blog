<template>
    <table class="table table-striped table-bordered table-hover">
        <thead>
        <tr>
            <th v-for="oneHead in head">{{oneHead}}</th>
        </tr>
        </thead>

        <tbody>

        <tr v-for="row in body">
            <td v-for="column in row" is="customeTableTd" :td-values="column">
            </td>
        </tr>
        </tbody>
    </table>
</template>

<script>
    import customeTableTd from './custome-table-td.vue'

    export default{
        props: {
            head: {
                type: Array,
                required: true
            },
            body: {
                type: Array,
                required: true
            }
        },
        components:{
           customeTableTd
        }
    }

</script>
