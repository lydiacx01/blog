
/**
 * First we will load all of this project's JavaScript dependencies which
 * include Vue and Vue Resource. This gives a great starting point for
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

require('./common-func');

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the body of the page. From here, you may begin adding components to
 * the application, or feel free to tweak this setup for your needs.
 */

Vue.component('warning', require('./components/warning.vue'));
Vue.component('page-index', require('./components/page-index.vue'));
Vue.component('inline-button', require('./components/inline-button.vue'));
Vue.component('add-input-group', require('./components/add-input-group.vue'));
Vue.component('submit-on-progress', require('./components/submit-progress.vue'));
Vue.component('custome-table', require('./components/custome-table.vue'));
Vue.component('custome-table-td', require('./components/custome-table-td.vue'));
Vue.component('table-or-warning', require('./components/table-or-warning.vue'));
Vue.component('custome-li', require('./components/custome-li.vue'));
Vue.component('upload-file-list-group', require('./components/upload-file-list-group.vue'));
Vue.component('upload-img-list-group', require('./components/upload-img-list-group.vue'));
Vue.component('form-group', require('./components/form-group.vue'));
Vue.component('download-file-link', require('./components/download-file-link.vue'));
Vue.component('select-option', require('./components/select-option.vue'));
Vue.component('select-wrap', require('./components/select-wrap.vue'));
Vue.component('multi-level-linkage', require('./components/multi-level-linkage.vue'));
Vue.component('multi-level-linkage-table', require('./components/multi-level-linkage-table.vue'));
Vue.component('loading-square-rotate', require('./components/loading-square-rotate.vue'));
Vue.component('checkbox-or-radio', require('./components/checkbox-or-radio.vue'));
Vue.component('checkbox-or-radio-list', require('./components/checkbox-or-radio-list.vue'));
const appVue = new Vue({
    el: '#app'
});
