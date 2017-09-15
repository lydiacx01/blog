window.showdown = require('showdown');

window.onload = function() {
    var c,
        md = $('#md'),
        htm = $('#ht'),
        af = $('.submit-after-wrap'),
        m = $('#mask');

    function load(e) {
        var t = e.target, url;
        if (t.scrollHeight <= t.scrollTop + $(t).height()) {
            url = t.dataset.url;//jquery中的data属性没变，但是实际上DOM的data-url属性是变化了的，所以改用dataset.url的DOM形式
            if (url != undefined && url.length) {
                $.get(url, function(result) {
                    var items = '';
                    for (var k in result.items) {
                        var article = result.items[k];
                        items += '<li class="article-item">' +
                            '<div class="article-info">' +
                            '<a class="article-title" href="/blog/s/'+ article.id + ' ">' + article.title + '</a>' +
                            '<span class="info">' + article.category_name + '</span>' +
                            '<span class="info">' + article.updated_at + '</span>' +
                            '</div>' +
                            '<div class="article-description">' +
                            article.description +
                            '</div>' +
                            ' </li>';
                    }
                    $(t).find('ul').append(items);
                    $(t).attr('data-url', result.next);
                });
            } else {
                $('.end').removeClass('hide');
            }
        }
    }

    function initTextArea(em) {
        //textarea初始化value，没有value属性，只能通过js实现
        if (em.attr('data-text') != undefined) {
            em.val(em.attr('data-text'));
            em.attr('data-text', null);
        }
    }

    function initShow() {
        var a = location.href.split('/');
        if (a[a.length - 2] == 's') {
            if (htm.get(0).dataset.text != undefined) {
                md2html(htm.get(0).dataset.text);
                htm.attr('data-text', null);
            }
        }
    }

    function md2html(text) {
        c = new showdown.Converter();
        htm.empty();
        htm.append(c.makeHtml(text));
    }

    function toggle(e) {
        var t = e.target;
        if (t.tagName == 'A') {
            var h = t.href.split('#');
            if (h.length > 1) {
                h = h[1];
                if (h == 'ht') {
                    md2html(md.val());
                }
            }
        }
    }

    function mask(e) {
        m.css('height', $('.body-container').height());
        af.removeClass('hide');
        return false;
    }

    function cancel(e) {
        m.css('height', 0);
        af.addClass('hide');
        return false;
    }

    function check(e) {
        var items = ['title', 'category', 'description', 'content'],
            a = location.href.split('/'),
            prop,
            f = $('.container-form'),
            c = $('.article-content');
        if (a[a.length - 2] == 'e') {
            items.push('id');
            if (document.getElementsByName('code').length < 1) {
                f.append('<input type="hidden" name="update" value="true" /><input type="hidden" name="code" value="' +
                    (c.data('code')? c.data('code') : '') +
                    '" >');
            }
        }
        for (var p in items) {
            prop = document.getElementsByName(items[p])[0];
            if (prop.value.length < 1) {
                alert('请填写完整后再提交！');
                return false;
            }
        }

        return true;
    }

    function cateCheck(e) {
        if (!$('[name=category]').val()) {
            alert('请添加新分类后再提交！')
            return false;
        }
        return  true;
    }

    initShow();
    initTextArea(md);
    initTextArea($('#article-description'));
    $('#article-list').on('scroll', load);
    $('.article-content').on('click', toggle);
    $('#before-submit').on('click', mask);
    $('#cancel').on('click', cancel);
    $('#submit').on('click', check);
    $('#submit-new-category').on('click', cateCheck);
}