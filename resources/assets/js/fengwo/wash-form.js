window.onload = function() {
    var v = new Vue({
        el: '#app'
    });

    $('#wash-form').on('submit', function() {
        var isClosed = $('#is-closed:checked');
        //hardcode一番，如果该店不在原地址上，且D1不知道该店搬到哪里去了，就勾选此项
        if (isClosed.length < 1) {
            if (!$('input[name=poiLat]').val()) {
                alert('没校正就想提交，没门！');
                return false;
            }
        }
        return true;
    });
}