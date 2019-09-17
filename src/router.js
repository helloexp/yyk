import Vue from "vue";
import Router from "vue-router";
const Tabbar = () => import('./components/testtabber.vue');
import readBuyDetail from "./views/readBuy/index.vue";
import readBuyList from "./views/readBuyList/index.vue";
import study from "./views/study/index.vue";
Vue.use(Router);

const routes = [{
    path: "/",
    name: "readBuyList",
    meta: {
      title: "边看边买",
      keepAlive: true
    },
    components: {
      default: readBuyList,
      tabbar: Tabbar
    },
  },
  {
    path: "/readBuyDetail",
    name: "readBuyDetail",
    meta: {
      title: "边看边买"
    },
    component: readBuyDetail
  },
  {
    path: '/study',
    name: 'study',
    meta: {
      title: "学习ing"
    },
    component: study
  }
];

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  linkActiveClass: "active",
  routes
});
