<template>
    <div id="home">
        <el-container class="out-container">
            <!-- 侧栏菜单 -->
            <el-aside :width="asideWidth">
                <el-menu router :default-active='defaultActive' :unique-opened='isUniqueOpened' :collapse='isCollapse' @select='menuSelect' background-color='#545c64' text-color='#fff' active-text-color='#ffd04b'>
                    <el-submenu v-for="(menu) in menus" :key="menu.id" :index='menu.name'>
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span slot="title">{{menu.name}}</span>
                        </template>
                        <el-menu-item v-for="(child) in menu.children" :key="child.id" :index='menuItemIndex(child.route)'>{{child.name}}</el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>

            <!-- 主体部分 -->
            <el-container class="inner-container">
                <!-- header按钮 -->
                <el-header>
                    <el-button icon='el-icon-menu' circle @click="menuToggle"></el-button>
                    <el-button icon='el-icon-refresh' circle></el-button>
                </el-header>
                <!-- tabs -->
                <el-main>
                    <el-tabs v-model="activeTab" type="card" @tab-click='clickTab' @tab-remove='removeTab'>
                        <el-tab-pane v-for="tab in tabs" :key="tab.name" :closable='tab.closable' :label='tab.name' :name='tab.name'>
                        </el-tab-pane>
                    </el-tabs>
                    <keep-alive>
                        <router-view :a-map-center="aMapCenter" />
                    </keep-alive>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import Vue from "vue";
import store from '@/store';
import { getMenus } from '@/api';
import { getAMapCenter } from '@/api';
import axios from "axios";
export default {
    name: 'Home',
    data() {
        return {
            // menu相关设置
            isCollapse: false,
            isUniqueOpened: true,
            asideWidth: '220px',
            menus: [],
            // defaultActive: '',
            defaultActive: this.$route.path.split('/')[1],
            // tab相关设置
            // activeTab: '',
            tabs: [],
            aMapCenter: { lat: '32.089023', lon: '118.832171' },//默认值
        };
    },
    created() {
        // 获取地图中心点

        this._getAMapCenter();
        // this._getActiveMenu();
        // this._getActiveTab();
        /* getMenus().then(res => {
            if (res.status) {
                this.defaultActive = res.data[0].children[0].route.slice(17, -5);
                let newTab = Object.assign({}, res.data[0].children[0], { closable: false });
                this.tabs.push(newTab);
                // this.activeTab = newTab.name;
                this.activeTab = newTab.name;
                store.dispatch('addRoute', { route: this.defaultActive, name: this.activeTab });
                this.menus = res.data;
            }
        }); */
    },
    computed: {
        activeTab: {
            get() {
                return this.$store.state.activeTab;
            },
            set(val) {
                this.$store.commit('setActiveTab', val);
            }
        }

    },
    methods: {
        // 获取地图中心点
        _getAMapCenter() {
            getAMapCenter().then(res => {
                if (res.status) {
                    this.aMapCenter = res.data;
                }
            });
        },
        _getMenus() {
            this.menus = store.state.menus;
        },
        _getInitTabs() {
            this.tabs = store.state.tabs;
        },
        _getActiveMenu() {
            this.defaultActive = store.state.activeRoute;
        },
        // _getActiveTab() {
        //     this.activeTab = store.state.activeTab;
        // },
        menuItemIndex(route) {
            return route.slice(17, -5);
        },
        menuSelect(index, indexPath) {
            console.log(index, indexPath);
            // 判断tab是否存在,不存在 增加tab,存在显示tab
            let tab = this.tabs.find(n => n.route.slice(17, -5) === index);
            // 增加tab
            if (!tab) {
                let menu = this.menus.find(n => n.name === indexPath[0]);
                let menuItem = menu.children.find(n => n.route.slice(17, -5) === index);
                let newTab = Object.assign({}, menuItem, { closable: true });
                this.tabs.push(newTab);
                this.activeTab = newTab.name;
            } else {
                this.activeTab = tab.name;

            }
            store.commit('addRoute', { route: index, name: this.activeTab });
            store.dispatch('getActiveRoute', { activeTab: this.activeTab, activeMenu: this.activeMenu });

        },
        menuToggle() {
            if (this.isCollapse) {
                this.isCollapse = false;
                this.asideWidth = '220px';
            } else {
                this.isCollapse = true;
                this.asideWidth = '65px';
            }
        },
        clickTab() {
            // this.activeTab = tab.name;
            // 根据activeTab找到对应的menu
            let tab = this.tabs.find(n => n.name === this.activeTab);
            this.defaultActive = tab.route.slice(17, -5);
            this.$router.push({ path: this.defaultActive })
        },
        removeTab(targetName) {
            store.commit('delTab', targetName);
            this.tabs = this.tabs.filter(tab => tab.name !== targetName);
            if (this.activeTab === targetName) {
                let tab = this.tabs[this.tabs.length - 1];
                this.defaultActive = tab.route.slice(17, -5);
                store.commit('setActiveTab', this.defaultActive);
                this.activeTab = tab.name;
                this.$router.push({ path: this.defaultActive });
            }



        },
    },
    watch: {
        '$route'(to) {
            let flag = false;
            console.log(to);
            if (to.path != '/') {
                for (let tab of this.tabs) {
                    if (tab.name === to.name) {
                        flag = true;
                        store.commit('setActiveTab', tab.route.slice(17, -5));
                        break;
                    }
                }
                if (!flag) {
                    store.commit('addRoute', { route: to.path, name: to.name });
                    store.commit('setActiveTab', to.path.slice(1));
                    // this.tabs.push({ name: to.name, route: to.path, closable: true });
                }
                this.activeTab = to.name;
                this.defaultActive = to.path.slice(1)
            } else {
                // 返回登录页
                // this.$route.path.push({ path: '/login' });
                this.activeTab = this.menus[0].children[0].name;
                this.defaultActive = this.menus[0].children[0].route.slice(17, -5);
            }

        },
    },
    // 刷新时以当前路由作为tab加入tabs
    beforeCreate() {
        this.$store.dispatch("addRoute");
    },
    mounted() {
        let self = this;
        setTimeout(function() {
            self.$router.push({ path: store.state.routes[0].route });
            self._getMenus();
            self._getInitTabs();
        }, 1000);
    },

}
</script>

<style lang="less" scoped>
@import '../styles/vars.less';
#home {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
}

.out-container {
    position: relative;
    width: 100%;
    height: 100%;
}

.inner-container {
    position: relative;
    left: 0;
    right: 0;
    background-color: @main-bg;
}

.out-container>.el-aside {
    position: relative;
    top: 0;
    bottom: 0;
    left: 0;
    width: 220px;
    overflow: hidden;
    z-index: 1;
}

#app .el-menu {
    height: 100%;
}


.inner-container>.el-header {
    padding-top: 10px;
    padding-bottom: 10px;
    background-color: @head-bg;
}
</style>






