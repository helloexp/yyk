import Vue from 'vue';
import Vuex from 'vuex';
import readBuy from './readBuy/index';


Vue.use(Vuex);
export default new Vuex.Store({
  modules: {
    readBuy,
  },
});
