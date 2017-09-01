/**
 * Created by chenxi on 2017/4/1.
 */
import CookieObj from '../cookieObj.js';

var src = location.protocol +  '//map.qq.com/api/js?v=2.exp';
document.write('<script type="text/javascript" charset="utf-8" src="'+ src + '"></script>');

$(function() {
    var v, pv, cy, area, submit, cookieObj, geodecoder, cityLocation;
    v = new Vue({
        el: '#washer-home',
        data: {
            msg: '未选择地区',
            url: '/fengwo/wash/getTableBody'
        },
        created: function () {
            this.$on('afterQuery', this.afterHandler);
        },
        beforeDestroy: function() {
            this.$off('afterQuery', this.afterHandler);
        },
        methods: {
            check: function() {
                var pvv, cyv, areav, tb;
                pvv = pv.val();
                cyv = cy.val();
                areav = area.val();
                if (pvv == undefined || pvv.length < 1
                    || cyv == undefined || cyv.length < 1
                    // || areav == undefined || areav.length < 1
                ) {
                    // error('必须选择所在省份、城市和区域！');
                    error('必须选择所在省份和城市！');
                    return false;
                }
                this.msg = '没有数据';
                tb = this.$children[1];
                tb.commitNewQuery(1);
                submit.attr('disabled', true);
                setTimeout(function() {
                    submit.attr('disabled', false);
                }, 2000);
            },
            afterHandler: function(result) {
                var total, url, tableRelative;
                result = JSON.parse(result);
                total = Number(result.total);
                url = result.downloadLink;
                tableRelative = $('.list-wrap .table-relative');
                if (total) {
                    $('#total').text(total);
                    this.url = url;
                    tableRelative.removeClass('hide');
                } else {
                    tableRelative.addClass('hide');
                }
            }
        }
    });
    pv = $('#level-1');
    cy = $('#level-2');
    area = $('#level-3');
    submit = $(".area-wrap .submit");
    cookieObj = new CookieObj(document, 'wash-default-location');
    geodecoder = new qq.maps.Geocoder({
        error: function() {
            error('地址逆解析出错，请刷新页面重试！');
        },
        complete: coderComplete
    });
    cityLocation = new qq.maps.CityService({
        complete: locationComplete
    });
    //第三级联动触发的请求
    submit.on("click", function(e){
        v.check();
        e.stopPropagation();
    });
    ini();

    //错误处理
    function error(msg) {
        alert(msg);
    }

    //地址逆解析完成处理
    function coderComplete(result) {
        var comp = result.detail.addressComponents;

        //自动触发三级联动
        autoChange(comp.province, comp.city, comp.district);
        cookieObj.pv = comp.province;
        cookieObj.area = comp.district;
        cookieObj.store();
    }

    //IP定位完成处理
    function locationComplete(result) {
        var detail = result.detail;
        cookieObj.cy = detail.name;
        cookieObj.lat= detail.latLng.lat;
        cookieObj.lng = detail.latLng.lng;
        geodecoder.getAddress(detail.latLng);
    }

    //强制触发某个元素的change事件
    function triggerChangeEvent (elem, value) {
        var event, originVal;

        if (elem != undefined && elem.length > 0 ) {
            elem = elem[0];
            originVal = elem.value;
            elem.value = value;
            //如果这个值不存在，就改回原来的值
            if (!elem.value) {
                elem.value = originVal;
                return false;
            }
            event = document.createEvent('HTMLEvents');
            event.initEvent('change', false, true);
            elem.dispatchEvent(event);
        }
        return false;
    }

    //自动更新三级联动的值---有些dw的省市区和QQ不一致，所以最多就到
    function autoChange(province, city, ar) {
        triggerChangeEvent(pv, province);
        triggerChangeEvent(cy, city);
        triggerChangeEvent(area, ar);
        if (area.val()) {
            submit.trigger('click');
        }
    }

    function ini() {
        if (!cookieObj.load()) {
            cityLocation.searchLocalCity();
        } else {
            autoChange(cookieObj.pv, cookieObj.city, cookieObj.area);
        }
    }
});
