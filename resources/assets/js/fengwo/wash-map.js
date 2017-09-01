/**
 * 洗数据地图页面的js
 *   目的：将dw中的pos门店和腾讯爬虫的数据map起来，需要人为地获取dw数据在腾讯DB中的对应位置
 * Created by chenxi on 2017/3/29.
 */
import CookieObj from '../cookieObj';
const SEARCH_NEAR = 'nearby',
    SEARCH_KEYWORD = 'keyword';

var pickable = false,
    toFormable = false,
    searchWord = $('#search-word'),
    loadAnimation =  $('.loading-square-rotate'),
    searchWrap = $('.search-wrap'),
    nearbyList = $('.list-wrap'),
    keywordList = $('.suggestion-wrap'),
    fm = $('#to-form'),
    swIntevalId,
    swKUCounter = 0,
    swKUOldCounter = 0,
    cookieObj,
    pageIndex = 1,
    pageSize = 20,
    //所在城市
    city,
    province,
    initCity,
    center,
    map = new qq.maps.Map(
        document.getElementById('map'),
        {
            zoom: 18,
            draggeable: true
        }),
    selectMarker = new qq.maps.Marker({
        icon: new qq.maps.MarkerImage('/img/red-marker.png',
            new qq.maps.Size(10, 15),
            new qq.maps.Point(0,0),
            new qq.maps.Point(5, 15),
            new qq.maps.Size(10, 15))}),
    //地址逆解析
    geodecoder = new qq.maps.Geocoder({
        complete: function(result) {
            var poi, address, poiComp, activePoiAddress, nearPois, minDist, index, addressInput;
            address = result.detail.address;
            activePoiAddress =  $('#active-poi').find('.poi-address');
            poiComp = result.detail.addressComponents;

            //初始化门店旧址
            if (activePoiAddress.text().length < 1) {
                initCity = poiComp.city;
                activePoiAddress.text(address);
                initCenter();
                return false;
            }

            city = poiComp.city;
            province = poiComp.province;
            nearPois = result.detail.nearPois;
            //找出距离最近的数码家电类
            minDist = 1000;
            for (var p in nearPois) {
                if (minDist >= nearPois[p].dist) {
                    if (minDist == nearPois[p].dist && nearPois[p].category.search('购物:数码家电') == -1)
                        continue;
                    index = p;
                    minDist = nearPois[p].dist;
                }
            }
            poi = nearPois[index];

            //不跳转
            if (!toFormable && !pickable) {
                //显示geodecoder结果中最近点为poi
                searchService.setType(SEARCH_NEAR, nearbyList);
                searchService.clear();
                searchService.showPois([poi]);
                searchService.showNode.find('.poi-list ul').children().first().addClass('map-marker');
                pageIndex = 1;
                //开始周边搜索
                searchService.searching(poi.latLng, null);
                return false;
            }

            //需要跳转到wash-form中, 2种方式：手动定位(pickable)和周边搜索(toFormable)
            fm.find('input[name=street]').val(poiComp.street);
            fm.find('input[name=streetNum]').val(poiComp.streetNumber);
            fm.find('input[name=latitude]').val(result.detail.location.lat.toFixed(5));
            fm.find('input[name=longitude]').val(result.detail.location.lng.toFixed(5));
            fm.find('input[name=province]').val(province);
            fm.find('input[name=city]').val(city);


            addressInput = fm.find('input[name=address]');

            //手动定位确认后,根据当前解析结果而非最近点poi作为
            if (pickable) {
                //如果解析出的地址不包含街道，则强制性加上
                if (address.search(poiComp.district) + poiComp.district.length >= address.length) {
                    address += poiComp.street + poiComp.streetNumber;
                }
                fm.find('input[name=title]').val('');
                addressInput.val(address);
            } else {
                address = addressInput.val();
                //如果解析出的地址不包含街道，则强制性加上
                if (address.search(poiComp.district) + poiComp.district.length >= address.length) {
                    address += poiComp.street + poiComp.streetNumber;
                }
                addressInput.val(address);
            }

            fm.submit();
            return false;
        },
        error: function() {
            alert("地址逆解析出错，请刷新页面重试！");
        }
    }),
    //地点检索--周边检索+ 关键字检索
    searchService = new qq.maps.SearchService({
        pageCapacity: pageSize,
        autoExtend: true, //部分初始化的定位不是在目标城市，需要通过扩展区改变所在城市
        setShowNode: function(showNode) {
            showNode.on('scroll', function(e) {
                var target = $(e.target), total;
                if (target[0].scrollHeight * 0.95 <= target.scrollTop() + target.height()) {
                    //加载新数据
                    total = target.find('.poi-list ul').data('total');
                    //第一次加载数据或者没超过总条数
                    if (total == undefined || Number(total) >= (pageIndex + 1)* pageSize) {
                        ++ pageIndex;
                        searchService.searching(center, searchWord.val().replace(/\s+/g, ''));
                    } else {
                        target.find('.to-end').removeClass('hide');
                    }
                }
            });
            searchService.showNode = showNode;
        },
        setType: function(type, showNode) {
            searchService.type = type;
            searchService.setShowNode(showNode);
        },
        clear: function() {
            //初始化search请求
            var showNode = searchService.showNode;
            showNode.find('.not-found').addClass('hide');
            showNode.find('.to-end').addClass('hide');
            showNode.find('.poi-list ul').empty();
        },
        searching: function(searchCenter, keyword) {
            loadAnimation.removeClass('hide');
            searchService.setPageIndex(pageIndex);
            if (searchService.type == SEARCH_NEAR) {
                searchService.searchNearBy('手机', searchCenter, 1000);
            } else {
                searchService.search(keyword);
            }
        },
        error: function() {
            searchService.showNode.find('.not-found').removeClass('hide');
            loadAnimation.addClass('hide');
        },
        showPois: function(pois, fromSuggest = false) {
            var newE = "", clickEvents, list, firstCh, locationName, titleName, pro, cy;
            list = searchService.showNode.find('.poi-list ul');

            if (fromSuggest) {
                locationName = 'location';
                titleName = 'title';
            } else {
                locationName = 'latLng';
                titleName = 'name';
                firstCh = list.children().first();
                if (firstCh.length > 0) {
                    pro = firstCh.find('.poi-province').text();
                    cy = firstCh.find('.poi-city').text();
                } else {
                    //关键字检索结果不提供城市信息，通过跳转到map（也没获取城市），跳转到form之前会解析经纬度获取城市信息
                    pro = '';
                    cy = '';
                }
            }

            for (var index in pois) {
                if (fromSuggest) {
                    pro = pois[index].province;
                    cy = pois[index].city;
                }

                newE += "<li>"
                    + "<div>"
                    + "<div class='icon'></div>"
                    + "<div class='poi-content'>"
                    + "<p class='poi-title'><span class='title'>"+ pois[index][titleName] + "</span>";
                if (pois[index].dist != undefined) {
                    newE += "<span class='dist'>" +  pois[index].dist+ "米</span>";
                }
                newE += "</p>"
                    + "<p class='poi-address'>" + pois[index].address  +  "</p>"
                    + "<p class='poi-latitude'>" + pois[index][locationName].lat +"</p>"
                    + "<p class='poi-longitude'>" +pois[index][locationName].lng +"</p>"
                    + "<p class='poi-province'>" + pro +"</p>"
                    + "<p class='poi-city'>" +  cy +"</p>"
                    + "</div>"
                    +"</div>";
                    + "</li>";
            }

            list.append(newE);
            clickEvents = searchService.type == SEARCH_KEYWORD && !searchService.showNode.hasClass('list-wrap')? toMap : toForm;
            $.each(list.children(), clickEvents);
        },
        //检索成功的回调函数
        complete: function(results) {
            var total;
            loadAnimation.addClass('hide');
            total = results.detail.totalNum;
            //没有值，显示到底了
            if (total < 1) {
                searchService.showNode.find('.to-end').removeClass('hide');
                return;
            }

            //若是无poi的marker通过关键字检索所得，只需要显示第一个,同时触发该位置第一轮的周边检索
            if (searchService.showNode.hasClass('list-wrap') && searchService.type == SEARCH_KEYWORD) {
                searchService.showPois([results.detail.pois[0]]);
                searchService.showNode.find('.poi-list ul').children().first().addClass('map-marker');
                pageIndex = 1;
                searchService.setType(SEARCH_NEAR, nearbyList);
                searchService.searching(center);
            } else {
                searchService.showPois(results.detail.pois);
                searchService.showNode.find('.poi-list ul').data('total', total);
            }
        }
    }),
    suggest = {
        showNode: keywordList,
        clear: function() {
            var showNode = this.showNode;
            showNode.find('.poi-list ul').empty();
            showNode.find('.not-found').addClass('hide');
            showNode.find('.to-end').addClass('hide');
        },
        getSuggestion: function() {
            var word, url;
            word  = searchWord.val().replace(/\s+/g, '');
            if (word.length < 1) {
                searchWrap.find('.search-bar .cancel').removeClass('hide');
                searchWrap.find('.search-bar .submit').addClass('hide');
                return false;
            }

            searchWrap.find('.search-bar .cancel').addClass('hide');
            searchWrap.find('.search-bar .submit').removeClass('hide');
            suggest.clear();
            loadAnimation.removeClass('hide');

            //todo----如果需要提供关键字提示信息，需要注意city必须根据当前的marker位置而定！
            url = 'https://apis.map.qq.com/ws/place/v1/suggestion?region= ' + city
                + '&keyword=' + word + '&policy=0&output=jsonp&key=P3WBZ-7XWLF-X2MJU-J5F7F-HP42O-LUB4N';
            $.ajax({
                type: 'get',
                url: url,
                dataType: 'jsonp',
                callback: 'handleJsonp',
                success: function(result) {
                    loadAnimation.addClass('hide');

                    //api结果出错
                    if (result['status']) {
                        alert("提示出错啦！" + result['message']);
                        return false;
                    }

                    //没有结果
                    if (result['count'] < 1) {
                        suggest.showNode.find('.not-found').removeClass('hide');
                        return false;
                    }

                    searchService.showPois(result['data'], true);
                    suggest.showNode.find('.to-end').removeClass('hide');
                    //不能scroll--一般提示最多提供10个--qq api
                    searchService.showNode.find('.poi-list ul').data('total', result['count']);
                }
            });
            return false;
        }
    };

qq.maps.event.addListener(map, 'dragend', function(e) {
    var centerMarker = $('.map-wrap').find('.center-marker img');
    centerMarker.addClass('bounceInDown');
    setTimeout(function() {
        centerMarker.removeClass('bounceInDown');
    }, 500);
    center = map.getCenter();
    centerChanged();
});
qq.maps.event.addListener(map, 'click', pickInMap);

//初始化被校正对象的腾讯地址
function initActive() {
    var activePoi = $('#active-poi'), lat, lng;
    lat = Number(activePoi.find('.poi-latitude').text());
    lng = Number(activePoi.find('.poi-longitude').text());

    if (!lat || !lng) {
        activePoi.find('.poi-address').text('没提供地理信息');
        initCenter();
    } else {
        geodecoder.getAddress(new qq.maps.LatLng(lat, lng));
    }
}

//初始化地图中心点
function initCenter() {
    var args, tmp, lat, lng, time, id;
    args = location.search.substring(1).split('&');
    lat = 0;
    lng = 0;
    for (var p in args) {
        tmp = args[p].split('=');
        if ((tmp[0] != 'lat' && tmp[0] != 'lng') || tmp[1] == undefined || tmp[1].length <= 0)
            continue;

        if (tmp[0] == 'lat') {
            lat = Number(tmp[1]);
        } else {
            lng = Number(tmp[1]);
        }
    }

    //url没值，就从cookie中找经纬度
    if (lat == 0 || lng == 0) {
        cookieObj = new CookieObj(document, 'wash-default-location');
        if (cookieObj.load() == false || !cookieObj.lat || !cookieObj.lng) {
            $('#init-failed').removeClass('hide');
            $('.main').addClass('hide');
            time = 10;
            id = setInterval(function() {

                if (time <= 0) {
                    clearInterval(id);
                    window.location.href = '/fengwo/wash';
                    return false;
                }
                $('#init-failed').find('.time-tick').text(time);
                -- time;
            }, 1000);
            return false;
        } else {
            lat = Number(cookieObj.lat);
            lng = Number(cookieObj.lng);
        }
    }
    center = new qq.maps.LatLng(lat, lng);
    map.setCenter(center);
    centerChanged();
}

//跳到form页面
function toForm(index, item) {
    $(item).on('click', function(e) {
        var poiContent, lat, lng;
        poiContent = $(item).find('.poi-content');
        lat = Number(poiContent.find('.poi-latitude').text());
        lng = Number(poiContent.find('.poi-longitude').text());
        fm.find('input[name=address]').val(poiContent.find('.poi-address').text());
        fm.find('input[name=title]').val(poiContent.find('.poi-title .title').text());
        toFormable = true;
        geodecoder.getAddress(new qq.maps.LatLng(lat, lng));
        e.stopPropagation();
    });
}

//跳到map部分
function toMap(index, item) {
    $(item).on('click', function(e) {
        var poi = {};
        poi.title =  $(item).find('.poi-title').text();
        poi.dist = 0;
        poi.address =  $(item).find('.poi-address').text();
        poi.location = {};
        poi.location.lat = Number($(item).find('.poi-latitude').text());
        poi.location.lng = Number($(item).find('.poi-longitude').text());
        poi.province = $(item).find('.poi-province').text();
        poi.city = $(item).find('.poi-city').text();

        //退出提示列表
        keywordList.addClass('hide');
        searchWord.val('');

        //地图中心移动
        center = new qq.maps.LatLng(poi.location.lat, poi.location.lng);
        map.setCenter(center);

        //切换搜索服务为周报检索, 显示marker信息
        searchService.clear();
        searchService.setType(SEARCH_NEAR, nearbyList);
        searchService.clear();
        searchService.showPois([poi], true);
        searchService.showNode.find('.poi-list ul').children().first().addClass('map-marker');

        //周边检索
        pageIndex = 1;
        searchService.searching(center);
        e.stopPropagation();
    });
}


//手动定位模式
function pick(e) {
    var confirm = $('.picker-wrap');
    pickable = !pickable;
    if (pickable) {
        $(e.target).text('关闭手动定位');
        confirm.removeClass('hide');
        confirm.find('span').on('click', function(e) {
            //跳到form页面
            var latLngPoint = selectMarker.getPosition();
            geodecoder.getAddress(latLngPoint);
            e.stopPropagation();
        });

        map.setOptions({
            draggableCursor: 'crosshair',
            draggable: false
        });
    } else {
        $(e.target).text('开启手动定位');
        confirm.addClass('hide');
        map.setOptions({
            draggableCursor: 'grab',
            draggable: true
        });
        selectMarker.setMap(null);
    }
    e.stopPropagation();
}

function pickInMap(event) {
    if (!pickable)  return false;
    if (map.getZoom() <  map.maxZoom) {
        alert("地图需要放大到最大比例！");
        return false;
    }

    //出现红色marker
    selectMarker.setMap(map);
    selectMarker.setPosition(event.latLng);
    return false;
}

//当前门店的poi信息 + 周边检索
function centerChanged() {
    nearbyList.find('.poi-list ul').empty();
    geodecoder.getAddress(center);
}

function suggestionShow(e) {
    // swIntevalId = setInterval(function() {
    //     if (swKUCounter > 0 && swKUCounter == swKUOldCounter) {
    //         //去掉提示
    //         // suggest.getSuggestion();
    //         swKUCounter = 0;
    //         swKUOldCounter = 0;
    //     }
    //     swKUOldCounter = swKUCounter;
    // }, 1500);

    // if ($(e.target).val()) return false;
    // searchService.setType(SEARCH_KEYWORD, keywordList);
    // keywordList.removeClass('hide');
    // searchWrap.removeClass('init');
    // searchWrap.find('.submit').addClass('hide');
    // searchWrap.find('.cancel').removeClass('hide');
    // e.stopPropagation();
    if (searchWord.val().length < 1) {
        searchWrap.find('.submit').addClass('hide');
        searchWrap.find('.cancel').removeClass('hide');
    } else {
        searchWrap.find('.cancel').addClass('hide');
        searchWrap.find('.submit').removeClass('hide');
    }
}

function suggestionCancel(e) {
    searchService.setType(SEARCH_NEAR, nearbyList);
    keywordList.addClass('hide');
    searchWrap.addClass('init');
    searchWrap.find('.cancel').addClass('hide');
    e.stopPropagation();
}


//window ready
$(function() {
    initActive();

    //已禁止scroll了，防止平移地图时，触发scroll默认行为
    $('#map').on('touchstart', function(e) {
        e.preventDefault();
    });
    //关键字提示
    // searchWord.on('focus', suggestionShow);
    searchWrap.find('.search-bar .cancel').on('click', suggestionCancel);

    //不用change事件，因为change只能在input失去焦点后才被触发
    searchWord.on('input', function(e) {
        // ++ swKUCounter;
        suggestionShow(e);
    });
    // searchWord.on('blur', function() {
    //     // clearInterval(swIntevalId);
    // });
    searchWord.on('click', function (e) {
        if ($(e.target).val()) return false;
        searchService.setType(SEARCH_KEYWORD, keywordList);
        searchService.setLocation(initCity);
        keywordList.removeClass('hide');
        searchWrap.removeClass('init');
        searchWrap.find('.submit').addClass('hide');
        searchWrap.find('.cancel').removeClass('hide');
        e.stopPropagation();
    });

    //关键字搜索
    $('#poi-search').find('.submit').on('click', function(e) {
         var value = searchWord.val().replace(/\s+/g, ''), searchKeys =fm.find('input[name=searchKey]');
        //搜索过的关键字存储
        searchKeys.val(searchKeys.val() + '_' + value);
        pageIndex = 1;
        searchService.clear();
        searchService.searching(null, value);
        e.stopPropagation();
    });

    //手动定位
    $('.picker').on('click', pick);
});
