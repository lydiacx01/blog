<template>
    <div class="loading-square-rotate" v-show="loading">
    </div>
</template>
<style lang="stylus" scoped>
    .loading-square-rotate {
        width: 40px;
        height: 40px;
        background-color: #00BCD4;

        margin: 10px auto;
        animation: load-square-rotate 0.2s infinite ease-in-out;
        -webkit-animation: load-square-rotate 0.7s infinite ease-in-out;
    }
    @keyframes load-square-rotate {
        0% {
            -o-transform: rotateX(0deg) rotateY(0deg);
            -moz-transform: rotateX(0deg) rotateY(0deg);
            -ms-transform: rotateX(0deg) rotateY(0deg);
            transform: rotateX(0deg) rotateY(0deg);
        }
        50% {
            -o-transform: rotateX(-180.1deg) rotateY(0deg);
            -moz-transform: rotateX(-180.1deg) rotateY(0deg);
            -ms-transform: rotateX(-180.1deg) rotateY(0deg);
            transform: rotateX(-180.1deg) rotateY(0deg);
        }
        100% {
            -o-transform: rotateX(-180.1deg) rotateY(-179.9deg);
            -moz-transform: rotateX(-180.1deg) rotateY(-179.9deg);
            -ms-transform: rotateX(-180.1deg) rotateY(-179.9deg);
            transform: rotateX(-180.1deg) rotateY(-179.9deg);
        }
    }
    @-webkit-keyframes load-square-rotate {
        0% {
            -webkit-transform: rotateX(0deg) rotateY(0deg);
        }
        50% {
            -webkit-transform: rotateX(-180.1deg) rotateY(0deg);
        }
        100% {
            -webkit-transform: rotateX(-180.1deg) rotateY(-179.9deg);
        }
    }
</style>

<script>
    export default{
        props: {
            loading: {
                type: Boolean,
                default: true
            }
        }
    }
</script>
