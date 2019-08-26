import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// 基础样式
import "./assets/less/base.less";
// 字体图标
import "./assets/iconfont/iconfont.css";
// 动画插件
import "animate.css";

import toast from './components/Toast'
import loading from './components/Loading'
Vue.use(toast)
Vue.use(loading)

import axios from "axios";

// import 'lib-flexible'
import VueAwesomeSwiper from "vue-awesome-swiper";

// require styles
import "swiper/dist/css/swiper.css";

Vue.use(VueAwesomeSwiper /* { default global options } */);

Vue.prototype.$axios = axios;

Vue.config.productionTip = false;

import api from "./api/install";
Vue.use(api);

import VueLazyload from "vue-lazyload";

Vue.use(VueLazyload, {
  // preLoad: 1.3,
  error: "dist/error.png",
  loading: "dist/loading.gif",
  attempt: 1
});

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
