//将直角坐标转换成极坐标
function toRadians(anger) {
    return anger * Geo.PI / 180;
}

//haversine公式计算2点的间距，点用经纬度坐标表示
function haversine(log1, lat1, log2, lat2) {
    //转换坐标为极坐标
    for (var index in arguments) {
        arguments[index] = Geo.toRadians(arguments[index]);
    }

    //计算差值
    var lat_gap = lat2 - lat1; //纬度
    var log_gap = log2 - log1;

    //计算2点的球心夹角
    var a = Math.sin(lat_gap / 2) * Math.sin(lat_gap / 2)
        + Math.cos(lat1) * Math.cos(lat2) * Math.sin(log_gap / 2) * Math.sin(log_gap / 2);
    var angle = Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) * 2;
    //圆弧 = R* 圆心夹角
    var distance = Geo.RADIUS * angle;
    return distance;
}

//球面余弦定理计算2点的间距，点用经纬度坐标表示
function sphericalCosine(log1, lat1, log2, lat2) {
    //转换坐标为极坐标
    for (var index in arguments) {
        arguments[index] = Geo.toRadians(arguments[index]);
    }

    var angle = Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(log1 - log2));
    var distance = angle * Geo.RADIUS;
    return distance;
}

//定义成全局变量
window.Geo = function Geo() {
    console.log("新建一个Geo对象");
}

Geo.RADIUS = 6371000; //实际为6371393米左右
Geo.PI = 3.1416;
Geo.toRadians = toRadians;
Geo.haversine = haversine;
Geo.sphericalCosine = sphericalCosine;
Geo.randomLat = randomLat;
Geo.randomLog = randomLog;

function randomLat(precision, log) {
    var g=[];
    var pre = Math.pow(10, precision);
    // var diff = Math.pow(10, -1 * precision);
    var diff = 0.00068;
    for (var i=0; i<10; ++i) {
        var rand = Math.random();
        var a = Math.round(rand * 180 * pre) / pre;
        g[i] = Geo.haversine(log, a, log, a-diff);
    }
    console.log(g);
}

function randomLog(precision, lat) {
    var g=[];
    var pre = Math.pow(10, precision);
    // var diff = Math.pow(10, -1 * precision);
    var diff = 0.00067;
    for (var i=0; i<10; ++i) {
        var rand = Math.random();
        var a = Math.round(rand * 90 * pre) / pre;
        g[i] = Geo.haversine(a, lat, a-diff, lat);
    }
    console.log(g);
}