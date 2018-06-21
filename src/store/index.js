import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

import { getMenus } from "@/api";
export default new Vuex.Store({
    state: {
        isLogin: false,
        routes: [], //{route:'',name:''}
        activeRoute: "",
        activeTab: "",
        menus: [],
        tabs: []
    },
    mutations: {
        login(state, data) {
            state.isLogin = data;
        },
        getActiveRoute(state, data) {
            state.activeRoute = data.activeMenu;
            state.activeTab = data.activeTab;
        },
        addRoute(state, data) {
            state.activeRoute = data.route;
            state.activeTab = data.name;
            state.routes.push(data);
        },
        // 设置当前激活的tab
        setActiveTab(state, index) {
            state.activeTab = index;
        },
        delTab(state, name) {
            let index = 0;
            for (let route of state.routes) {
                if (route.name === name) {
                    break;
                }
                index++;
            }
            state.routes.splice(index, 1);
        }
    },
    actions: {
        login(context, data) {
            context.commit("login", data);
        },
        getActiveRoute(context, data) {
            context.commit("getActiveRoute", data);
        },
        addRoute(context, data) {
            getMenus().then(res => {
                if (res.status) {
                    this.state.menus = res.data;
                    console.log(this.state.menus);
                    let tab = Object.assign({}, res.data[0].children[0], {
                        closable: false
                    });
                    this.state.tabs.push(tab);

                    context.commit("addRoute", {
                        route: tab.route.slice(17, -5),
                        name: tab.name
                    });
                }
            });
        },
        delRoute(context, data) {
            context.commit("delRoute", data);
        }
    },
    modules: {}
});
