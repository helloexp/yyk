import Vue from "vue";
import Router from "vue-router";
import readBuyDetail from "./views/readBuy/index.vue";
import readBuyList from "./views/readBuyList/index.vue";
Vue.use(Router);

const routes = [{
    path: "/",
    name: "readBuyList",
    meta: {
      title: "边看边买"
    },
    component: readBuyList
  },
  {
    path: "/readBuyDetail",
    name: "readBuyDetail",
    meta: {
      title: "边看边买"
    },
    component: readBuyDetail
  }
];

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  linkActiveClass: "active",
  routes
});
