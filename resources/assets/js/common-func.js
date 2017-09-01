/**
 * 加载url格式的js
 * 如果protocol没值，则会以： 当前协议 + url的格式加载; 否则就会以protocol + url的格式加载
 * @param url
 * @param protocol
 */
window.loadJs = function loadJs(url, charset="utf-8", protocol = false) {
    if (protocol === false) {
        protocol = location.protocol;
    } else if (protocol !== 'http' && protocol !== 'https') {
        console.error('url加载失败，协议错误！');
    } else {
        protocol += ':';
    }
    document.write('<script src="' + protocol + '//' + url +  '" type="text/javascript" charset="' + charset + '"></script>');
}