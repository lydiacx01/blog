/**
 * Created by chenxi on 2017/4/1.
 */
import CookieObj from '../cookieObj.js';

var src = location.protocol +  '//map.qq.com/api/js?v=2.exp';
document.write('<script type="text/javascript" charset="utf-8" src="'+ src + '"></script>');

$(function() {
    var v, pv, cy, area, submit, cookieObj, geodecoder, cityLocation;
    v = new Vue({
        el: '#index'
    });
    pv = $('.multi-level-linkage .level-1 select');
    cy = $('.multi-level-linkage .level-2 select');
    area = $('.multi-level-linkage .level-3 select');

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
