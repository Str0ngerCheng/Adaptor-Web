import 'babel-polyfill'
import Vue from "vue";
import frame from "./frame.vue";
import router from "./router";
import store from "./store";
import axios from "./common/axios";
import filters from "./filters";
import VueProgressBar from "vue-progressbar";
import Element from "element-ui";
import 'element-ui/lib/theme-chalk/index.css';
import ImpPanel from "./components/panel.vue";
import VueAMap from 'vue-amap';
<<<<<<< HEAD
import VideoPlayer from 'vue-video-player';
import 'babel-polyfill'
=======
import VideoPlayer from 'vue-video-player'
require('promise.prototype.finally').shim()
>>>>>>> 818c75df2e24c37b116f3691959edbe5935d6c55
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')

Vue.prototype.$http = axios
Vue.axios = axios
Vue.http = axios;


Vue.use(axios);
Vue.use(Element);
Vue.use(VueAMap);
Vue.use(VideoPlayer)

VueAMap.initAMapApiLoader({
  key: '8d552938b286df5704d2ced87767b73a',
  plugin: ['AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType'],
  uiVersion: '1.0'
});

Vue.component(ImpPanel.name, ImpPanel);

Vue.use(VueProgressBar, {
  color: '#eeeeee',
  failedColor: '#874b4b',
  thickness: '2px',
  transition: {
    speed: '0.2s',
    opacity: '0.6s'
  },
  autoRevert: true,
  location: 'top',
  inverse: false
})


Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

new Vue({
  store,
  router,
  el: "#root",
  render: h => h(frame)
})
