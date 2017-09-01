import Cookies from '../../cookieObj';
window.onload = function() {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    var v = new Vue({
        el: '#app'
    });
    var cook = new Cookies(document, 'report-config-test');
    $('#test-config').on('click', function(e) {
        var target = $(e.target)
            , name = target.data('name'),
            now = (new Date()).getTime();
        cook.load();
        if (cook[name] > (now - 15 * 60000)) {
            alert("距离上次测试15分钟后，才能再次测试！");
            return false;
        }
        cook[name] = now;
        cook.store();
        target.attr('disabled', true)
            .css('backgroundColor', 'gray')
            .text('正在发送测试邮件 ...');

        $.ajax({
            type: 'POST',
            url: '/report/config/test',
            data: {name:name},
            timeout: 60000,
            success: function(result) {
                if (!result) {
                    target.attr('disabled', false)
                        .css('backgroundColor', '#2579a9')
                        .text('再次发送');
                } else {
                    target.attr('disabled', true)
                        .css('backgroundColor', 'gray')
                        .text(result);
                }
            },
            error: function() {
                //一般是超时错误
                target.text('生成报表需要较长时间，请耐心等待 ...');
                setTimeout(function() {
                    target.attr('disabled', false)
                        .css('backgroundColor', '#2579a9')
                        .text('没收到？再次发送');
                }, 90000);
            }
        });

        e.stopPropagation();
    });
}
