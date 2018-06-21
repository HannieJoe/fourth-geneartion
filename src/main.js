// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import App from "./App";
import store from "./store";
import router from "./router";
import "./styles/index.less";
import "./styles/vars.less";

Vue.use(ElementUI);
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: {
    App
  },
  template: "<App/>",
  computed: {
    // routes() {
    //   return this.$store.state.routes;
    // }
  },
  watch: {
    // routes() {
    //   this.$router.push({
    //     path: this.routes[this.routes.length - 1].route
    //   });
    // }
  },
  created() {
    // this.$store.dispatch("addRoute");
  }
});
