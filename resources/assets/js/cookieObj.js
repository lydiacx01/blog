/**
 * cookie对象， document.cookie的操作对象,可以将多个属性作为一个cookie名存储
 * @param document 文档对象，必需
 * @param name cookie变量名，必需
 * @param minutes 过期时间，按分钟算，可选
 * @param path 可访问路径，可选
 * @param domain 可访问域名，可选
 * @param secure 安全性，布尔值，是否用https或其他安全协议连接传输，可选
 * @constructor
 */


function CookieObj(document, name, minutes, path, domain, secure) {
    this.$document = document;
    this.$name = name;
    if (minutes) {
        this.$expires = new Date((new Date()).getTime() + minutes * 60000);
    }
    this.$path = path? path : null;
    this.$domain = domain? domain : null;
    this.$secure = secure? secure : false;
    return this;
}

//存入文档cookie
CookieObj.prototype.store = function() {
    //先将cookie值连接起来, prop1:val1&prop2:va2&prop3:val3
    var cookieVal = '';
    for(var prop in this) {
        //忽略所有$开头的属性和方法
        if (prop.charAt(0) == '$' || typeof(this[prop]) == "function") continue;
        if (cookieVal != '') cookieVal += '&';
        cookieVal +=  prop + ':' + encodeURIComponent(this[prop]);
        this[prop] = null; //清洗到之前的属性设置，防止后续设置在一个非初始化情况下
    }

    cookieVal += ';';
    if (this.$expires)
        cookieVal += 'expires=' + this.$expires.toGMTString();
    if (this.$path)
        cookieVal += ';path=' + this.$path;
    if (this.$domain)
        cookieVal += ';domain=' + this.$domain;
    if (this.$secure)
        cookieVal += ';secure=' + this.$secure;

    //写入到文档
    this.$document.cookie = this.$name + '=' + cookieVal;
}

//从cookie中提取
CookieObj.prototype.load = function() {
    var cookie = this.$document.cookie;
    if (!cookie) return false;

    var start = cookie.indexOf(this.$name + '=');
    if (start == -1) return false;

    start += this.$name.length + 1; //跳过名字和等号
    var end = cookie.indexOf(';', start);
    if (end == -1) end = cookie.length;
    var cookieVal = cookie.substring(start, end);

    //赋值到各属性上面去
    cookieVal = cookieVal.split('&');
    for(var i=0; i<cookieVal.length; ++i) {
        cookieVal[i] = cookieVal[i].split(':');
        this[cookieVal[i][0]] = decodeURIComponent(cookieVal[i][1]);
    }

    return true;
}

//删除cookie
CookieObj.prototype.remove = function() {
    var cookieVal = this.$name + '=';
    if (this.$path) cookieVal += ';path=' + this.$path;
    if (this.$domain) cookieVal += ';domain=' + this.$domain;
    cookieVal += ';expires=' + new Date((new Date()).getTime() - 1000);
    this.$document.cookie = cookieVal;
}

export default CookieObj

