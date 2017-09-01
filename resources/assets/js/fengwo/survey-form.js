
loadJs('map.qq.com/api/js?v=2.exp');
window.onload = function() {
    var map, marker, center, originC, code, current,
        v = new Vue({
            el: '#app',
            data: {
                isPosList: {'1': '是', '-1': '不是'},
                activeList: {'1': '已入驻', '-1': '未入驻'},
                competitionList: {'捷信':'捷信', '佰仟':'佰仟', '有用':'有用','达飞':'达飞', '普惠':'普惠','马上':'马上', '其他':'其他'},
                brandList: {'苹果':'苹果', '华为':'华为', '三星':'三星', 'OPPO':'OPPO',
                    'VIVO':'VIVO', '联想':'联想', '魅族':'魅族', '中兴':'中兴', '其他':'其他'},
                repeatList: {},
                repeatListItemShow: ['title', 'address']
            },
            methods: {
                isPosToggle: function (value) {
                    if (value == '1') {
                        initW.find('.button-wrap').addClass('hide');
                        locationG.removeClass('hide');
                        repeat.removeClass('hide');
                    } else {
                        initW.find('.button-wrap').removeClass('hide');
                        locationG.addClass('hide');
                        detail.addClass('hide');
                        repeat.addClass('hide');
                        activeG.addClass('hide');
                    }
                },
                activeToggle: function(value) {
                    var coop = $('.cooperation-group'),
                        boss = $('.boss-group'),
                        month = $('.monthly-group');
                    header.removeClass('hide');
                    current = dt;
                    detail.removeClass('hide');

                    if (value == '1') {
                        coop.addClass('hide');
                        boss.find('.must').removeClass('hide');
                        month.find('.must').removeClass('hide');
                    } else {
                        coop.removeClass('hide');
                        boss.find('.must').addClass('hide');
                        month.find('.must').addClass('hide');
                    }
                }
            }
        }),
        header = $('.head-wrap'),
        rp = 1,
        lc = 2,
        dt = 3,
        mapWrap = $('.map-wrap'),
        moveM = $('#marker'),
        locationG = $('.location-group'),
        locationW = $('.location-wrap'),
        detail = $('.detail-wrap'),
        repeat = $('.repeat-group'),
        repeatF = $('.repeat-form'),
        repeatL = $('#repeat-list'),
        activeG = $('.active-group'),
        initW = $('.init-wrap');

    initMap();
    $('#location-change-btn').on('click', showLocChange);
    locationW.find('.location-control .location-submit').bind('click', submitLocChange);
    locationW.find('.location-control .location-cancel').bind('click', cancelLocChange);
    $('#repeat-start').on('click', showRepeat);
    $('#repeat-submit').on('click', repeatSubmit);
    $('#home').on('click', returnHome);
    $('#title-change').bind('click', showTitleChange);
    $('form').on('submit', submitF);

    function initMap() {
        var g = mapWrap.data('geo').split(',');
        center = new qq.maps.LatLng(
            Number(g[0]),
            Number(g[1])
        );
        map = new qq.maps.Map(document.getElementById('map'), {
            center: center,
            zoom: 18,
            draggable: true
        });
        marker = new qq.maps.Marker({
            position: center,
            map: map,
            draggable: false,
            title: '当前门店位置'
        });
        code = $('input[name=code]').val();
    }

    function showLocChange(e) {
        initW.addClass('hide');
        locationG.addClass('hide');
        header.removeClass('hide');
        current =  lc;
        locationW.removeClass('hide');

        originC = map.getCenter();
        marker.setVisible(false);
        moveM.removeClass('hide');

        e.stopPropagation();
        return false;
    }

    function submitLocChange(e) {
        var p = map.getCenter();
        $('input[name=lat]').val(p.lat.toFixed(5));
        $('input[name=lng]').val(p.lng.toFixed(5));

        hideLocChange(p);
    }

    function cancelLocChange(e) {
        $('input[name=lat]').val("");
        $('input[name=lng]').val("");

        hideLocChange(center);
    }

    function hideLocChange(c) {
        map.setCenter(c);
        marker.setPosition(c);
        marker.setVisible(true);
        moveM.addClass('hide');
        header.addClass('hide');
        locationG.removeClass('hide');
        locationW.addClass('hide');
        $('#location-change-btn').removeClass('hide');
        initW.removeClass('hide');
    }

    function showRepeat(e) {
        var targ = e.target, origin = targ.innerHTML, near, list, tmp;
        targ.innerHTML = '正在加载周边门店...';
        targ.disabled = true;

        //ajax请求
        $.get('/fengwo/survey/nearby', {code: code}, function(result) {
            targ.innerHTML = origin;
            targ.disabled = false;
            if (result.error) {
                alert(result.error);
                return false;
            }

            near = result.nearby;
            v.repeatList = near;

            if (near.length < 1) {
                repeatF.find('.repeat-none').removeClass('hide');
                repeatF.find('.repeat-total').addClass('hide');
            } else {
                repeatF.find('.repeat-none').addClass('hide');
                repeatF.find('.repeat-total').removeClass('hide');
            }
            header.removeClass('hide');
            current = rp;
            repeatF.removeClass('hide');
            locationG.addClass('hide');
            initW.addClass('hide');
        });

        e.stopPropagation();
        return false;
    }

    function bindCheckboxClick(index, item) {
        $(item).bind('click', function(e) {
            var ck = $(item).find('input');
            ck.on('click', function(e) {
                e.stopPropagation();
            })
            e.stopPropagation();
            return false;
        });
    }

    function repeatSubmit(e) {
        var list = [], all, total;
        all = repeatF.find('input:checkbox:checked');
        total = all.length;
        if (total > 0) {
           all.each(function(ind, item) {
               list[ind] = item.value;
           });
        }

        repeatF.addClass('hide');
        header.addClass('hide');
        locationG.removeClass('hide');
        repeat.find('.repeat-hint').addClass('hide');
        repeat.find('.repeat-total .total').text(total);
        repeat.find('.repeat-total').removeClass('hide');
        repeat.find('input').val(list);
        activeG.removeClass('hide');
        initW.removeClass('hide');
        e.stopPropagation();
        return false;
    }

    function returnHome(e) {
        header.addClass('hide');
        if (current == rp) {
            initW.removeClass('hide');
            repeatF.addClass('hide');
            locationG.removeClass('hide');
            if (repeat.find('input').val() == 'false') {
                repeat.find('.repeat-hint').removeClass('hide');
            } else {
                repeat.find('.repeat-hint').addClass('hide');
                activeG.removeClass('hide');
            }
        } else if (current == lc){
            hideLocChange(originC);
        } else {
            detail.addClass('hide');
        }
        e.stopPropagation();
        return false;
    }

    function showTitleChange(e) {
        $('.title-group p').addClass('hide');
        $('.title-group input').removeClass('hide');
        e.stopPropagation();
    }

    // 表单check，不涉及到图片
    function submitF(e) {
        var targ = $(e.target);
        targ.attr('disabled', true);

        if($('input[name=writer]').val().length < 1) {
            return error(targ, "请填写完整后再提交！");
        }
        if ($('input:radio:checked').val() === '1') {
            $.each($('.detail-wrap .must'), function(i, item) {
                var p = $(item).parent(),
                    nxt = p.next(),
                    cn = true;
                if (p.parent().hasClass('hide')) return;

                $.each(nxt.find('input[type=text]'), function(i, it) {
                    if ($(it).val().length < 1) {
                        cn = false;
                        return false;
                    }
                });

                if (nxt.find('input:checkbox:checked').length < 1
                    && ((nxt.find('select').length > 0 && nxt.find('select').val().length < 1)
                    || !cn
                    )
                ) {
                    e.preventDefault();
                    return error(targ, "请填写完整后再提交！");
                }
            });
        }

       return true;
    }

    function error(elem, msg) {
        elem.attr('disabled', false);
        alert(msg);
        return false;
    }
}


