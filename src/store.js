import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isAutoPlay: null,
    playtime: null
  },
  mutations: {
    autoPlay(state, val) {
      state.isAutoPlay = val
    },
    setPlayTime(state, val) {
      state.playtime = val;
    }
  },
  actions: {
    autoPlay(context, val) {
      context.commit('autoPlay', val)
    },
    setPlayTime(context, val) {
      context.commit("setPlayTime", val)
    }
  }
});
