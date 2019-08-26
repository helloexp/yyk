import Vue from "vue";
import Router from "vue-router";
import readBuyDetail from "./views/readBuy";
import readBuyList from "./views/readBuyList";
Vue.use(Router);

const routes = [
  {
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
})