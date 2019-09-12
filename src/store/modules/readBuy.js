const state = {
  test: '222',
  isAutoPlay: null,
  playtime: null,
  jumpPause: false
}
const mutations = {
  test(state, val) {
    state.test = val;
  },
  autoPlay(state, val) {
    state.isAutoPlay = val
  },
  setPlayTime(state, val) {
    state.playtime = val;
  },
  jumpPause(state, val) {
    state.jumpPause = val;
  }
}
const actions = {
  test(context, val) {
    context.commit('test', val);
  },
  autoPlay(context, val) {
    context.commit('autoPlay', val)
  },
  setPlayTime(context, val) {
    context.commit("setPlayTime", val)
  },
  jumpPause(context, val) {
    context.commit('jumpPause', val)
  }
}
const getters = {}

export default {
  state,
  actions,
  getters,
  mutations
}
