loadJs('map.qq.com/api/js?v=2.exp', 'utf-8');
window.onload = function () {
    var v, load, pv, city, loadC, radius, update, save, qqList, dwList, map_container, center, map, clusters, infoWindow, qqMapLib, cityLoc;
    v = new Vue({
        el: '#app',
        created: function() {
            this.$on('changeSelect', this.changeSelect)
        },
        beforeDestroy: function() {
             this.$off('changeSelect', this.changeSelect);
        },
        methods: {
            changeSelect: function(val, txt) {
                //根据城市名字切换地图
                cityLoc.searchCityByName(txt);
            }
        }
    });
    load = $('#load');
    pv = $('.multi-level-linkage .level-1 select');
    city = $('.multi-level-linkage .level-2 select');
    loadC = $('#loadC');
    radius = $('#radius');
    update = $('#update');
    save = $('#save');
    map_container = $('#map_container');
    qqMapLib = qq.maps;
    map = new qqMapLib.Map(map_container[0], {
        //北京故宫
        center: new qqMapLib.LatLng(39.916527, 116.397128),
        zoom: 10
    });
    cityLoc = new qqMapLib.CityService({
        complete: function(result) {
            map.setCenter(result.detail.latLng);
        },
        error: function() {
            console.log('城市定位失败！');
        }
    });

    //IP定位初始化地图
    cityLoc.searchLocalCity();
    load.on('click', loadMarkers);
    loadC.on('click', getClusters);

    function disable(elem, msg, needDis) {
        $(elem).attr('disabled', needDis)
            .text(msg);
    }

    function clearMarkerList() {
        if (markerList.length) {
            for (var i in markerList) {
                markerList[i].overlay.setMap(null);
            }
            markerList = [];
        }
    }

    /**
     * @-khtml-keyframes
     @-moz-keyframes
     @-ms-keyframes
     @-o-keyframes
     @-webkit-keyframes
     @keyframes
     * @param e
     * @returns {boolean}
     */

    function loadMarkers(e) {
        var targ = e.target, val = city.val(), data= {}, txt;
        txt = targ.innerHTML;
        disable(targ, '正在加载', true);
        clearMarkerList();
        if (val.length < 1) {
            alert("必须选择省份和城市！");
            disable(targ, txt, false);
            return false;
        }
        data[city.attr('name')] = val;
        data[pv.attr('name')] = pv.find('option:selected').text();
        $.get('/fengwo/edit/load', data, function(result) {
            if (result.error) {
                alert(result.error);
                disable(targ, txt, false);
                return false;
            }


            dwList = result.dw;
            qqList = result.qq;

            infoWindow = new qq.maps.InfoWindow({
                map: map,
                zIndex: 101
            });
            showAllMarkers();
            //画出蜂窝边界
            update.on('click', getClusters);
            //保存蜂窝
            save.on('click', saveClusters);
            disable(targ, txt, false);
        });
    }

    function saveClusters(e) {
        var targ = e.target, data = {}, val = city.val(), txt;
        txt = targ.innerHTML;
        disable(targ, '正在保存', true);
        data['radius'] = Number(radius.val());
        data[city.attr('name')] = val;
        data[pv.attr('name')] = pv.find('option:selected').text();
        $.get('/fengwo/edit/save', data, function(result) {
            if (result.error) {
                alert(result.error);
                disable(targ, txt, false);
                return false;
            }

            alert('蜂窝保存成功！');
            disable(targ, txt, false);
        });
    }

    function getClusters(e) {
        var targ = e.target, data = {}, val = city.val(), url, txt;
        txt = targ.innerHTML;
        disable(targ, '正在执行', true);
        if (radius.length > 0) {
            data['radius'] = Number(radius.val());
        }
        data[city.attr('name')] = val;
        data[pv.attr('name')] = pv.find('option:selected').text();
        url = targ.id;
        $.get('/fengwo/edit/' + url, data, function(result) {
            if (result.error) {
                alert(result.error);
                disable(targ, txt, false);
                return false;
            }
            clusters = result.clusters;
            var radius = result.radius;

            console.log("共有" + result.count + '个聚类');
            for (var prop in clusters) {
                var oneCluster = clusters[prop];
                (function(oneCluster, prop, radius) {
                    var fengwo = null;
                    var boundBox = oneCluster.boundBox;
                    var length = boundBox.length;

                    //如果只有boundBox只有一点，则画圆; 否则就画多边形
                    if (length == 1) {
                        var theradius = radius == undefined? oneCluster.radius : radius;
                        var center = new qq.maps.LatLng((boundBox[0]).latitude, (boundBox[0]).longitude);
                        fengwo = new qq.maps.Circle({
                            center: center,
                            radius: theradius,
                            strokeColor:  '#000000',
                            strokeWeight: 1,
                            visible: true,
                            map: map,
                            zIndex: 100
                        });
                    }
                    else {
                        //多边形路径
                        var path = [];
                        for (var ind = 0; ind < length; ++ind) {
                            var point = boundBox[ind];
                            path[ind] = new qq.maps.LatLng(point.latitude, point.longitude);
                        }
                        //多边形
                        fengwo = new qq.maps.Polygon({
                            path: path,
                            strokeColor: '#000000',
                            strokeWeight: 1,
                            map: map,
                            visible: true,
                            zIndex: 100
                        });
                    }

                    qq.maps.event.addListener(fengwo, 'click', function() {
                        infoWindow.setContent('<p> 类中心点id=' + prop  + '</p> '
                            + '<p> 类中心点:</p>' +
                            '<p style="margin-right: 10px"> [ lat=' + oneCluster.latitude + ', long=' + oneCluster.longitude + ' ]</p>');
                        infoWindow.setPosition(
                            new qq.maps.LatLng(
                                oneCluster.latitude,
                                oneCluster.longitude)
                        );
                        infoWindow.open();
                    });
                })(oneCluster, prop, radius);
            }

            disable(targ, txt, false);
        });
    }

     /**
     *  地图上显示所有点
     */
     var markerList = [];
     function showAllMarkers() {
         var size = new qq.maps.Size(10, 15);
         var origin = new qq.maps.Point(0,0);
         var anchor = new qq.maps.Point(5, 15);
         var iconRed = new qq.maps.MarkerImage('/img/red-marker.png', size, origin, anchor, size);
         var iconBlue = new qq.maps.MarkerImage('/img/bl-marker.png', size, origin, anchor, size);

         showMarker(qqList, iconBlue);
         showMarker(dwList, iconRed);
         console.log("所有点显示出来了");
     }

     function showMarker(pList, icon) {
         for (var i=0; i < pList.length; ++i) {
             var p = pList[i];
             var position = new qq.maps.LatLng(p.latitude, p.longitude);

             //对多个marker分别添加click事件，不能依靠marker的属性传值到click事件中
             (function (icon, p, position) {
                 var one ={};
                 var marker = new qq.maps.Marker({
                     position: position,
                     map: map,
                 });
                 one.overlay = marker;

                markerList.push(one);
                 if (icon != null) {
                    marker.setIcon(icon);
                }

                 //点击marker，显示其信息框
                 qq.maps.event.addListener(marker, 'click', function(e) {
                     infoWindow.setContent('<div style="width: 250px">' + '<p> 店名:' + p.title  + '</p>'
                     + '<p> 地址：' + p.address + '</p>' +  '</div>');
                     infoWindow.setPosition(
                     new qq.maps.LatLng(
                         p.latitude,
                         p.longitude)
                    );
                    infoWindow.open();
                });
            })(icon, p, position);
        }
     }


}
