<template>
    <div id="promptModal" class="modal" role="dialog" aria-hidden="true" tabindex="-1" data-backdrop="static" aria-labelledby="headerLabel">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button class="close" data-dismiss="modal" aria-hidden="true">&times</button>
                    <h4 class="modal-title" id="headerLable" v-show="header"> {{header}} </h4>
                </div>
                <div class="modal-body" v-html="message">
                    {{message}}
                </div>
                <div class="modal-footer" v-if="buttons == true">
                    <button data-dismiss="modal" class="btn btn-default">取消</button>
                    <button class="confirm btn btn-primary" @click="confirm">确定</button>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
    .modal .modal-body {
         text-align: center;
     }
     .modal .modal-body .red{
        color: red;
     }
</style>
<script>
    export default {
         props: ['header']
         ,data: function () {
            return {
                   message : '默认文本'
                  ,buttons: true
                  ,method: 'get'
                  ,uri: ''
                  ,args: {}
            }
         }
        ,methods: {
            getModal: function() {
                return $("#promptModal");
            }
            ,show: function() {
                var modal = this.getModal();
                modal.modal('show');
            }
           ,hide: function() {
                var modal = this.getModal();
                modal.modal('hide');
           }
           ,get: function() {
                var modal = this;
                if (modal.uri) {
                    $.ajax({
                         url: this.uri
                        ,method: 'get'
                        ,success: function(result, status) {
                            if (result.error) {
                                modal.message = "<p class='red'>" + result.error + "</p>";
                                modal.buttons = false;
                            } else {
                                modal.hide();
                                window.location.reload();
                            }
                        }
                    });

                }

           }
           ,confirm: function() {
                if (this.method == 'get')
                    this.get();
           }

        }
    }
</script>
