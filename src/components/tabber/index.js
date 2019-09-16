import tabbar from './index.vue';
export default {
  install: vue => {
    const Tabbar = vue.extend(tabbar);
    const instance = new Tabbar();
    instance.$mount(document.createElement('div'));
    document.body.appendChild(instance.$el)
    vue.prototype.$tabbar = () => {}
  }
}
