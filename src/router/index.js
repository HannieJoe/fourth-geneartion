import Vue from "vue";
import Router from "vue-router";
import ElementUI from "element-ui";
import routers from "./routers";
import store from "@/store";
import { isLogin } from "@/api";

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: routers
});

router.beforeEach((to, from, next) => {
  if (to.name === "登录页") {
    next();
  } else {
    if (!store.state.isLogin) {
      isLogin().then(res => {
        if (!res.status) {
          next({
            name: "登录页"
          });
        } else {
          store.dispatch("login", true);
          next();
        }
      });
    } else {
      next();
    }
  }
});
export default router;
