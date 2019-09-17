import copy from './copy';
import Vue from "vue";
const directives = {
  copy
}
export default {
  install(Vue) {
    Object.keys(directives).forEach((key) => {
      Vue.directive(key, directives[key])
    })
  }
}
