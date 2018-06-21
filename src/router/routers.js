// 懒加载
//  { path: '/index', component: resolve => require(['./index.vue'], resolve) },

export default [
  {
    path: "/",
    name: "首页",
    component: () => import("@/views/home"),
    children: [
      {
        path: "/realtimeCommand",
        name: "实时指挥",
        component: () => import("@/views/components/realtimeCommand")
      },
      {
        path: "/electronicFence",
        name: "电子围栏",
        component: () => import("@/views/components/electronicFence")
      },
      {
        path: "/patrolRoute",
        name: "巡逻路线",
        component: () => import("@/views/components/patrolRoute")
      },
      {
        path: "/employeeGroup",
        name: "巡逻组管理",
        component: () => import("@/views/components/employeeGroup")
      },
      {
        path: "/intercom",
        name: "对讲频道",
        component: () => import("@/views/components/intercom")
      },
      {
        path: "/4G",
        name: "4G",
        component: () => import("@/views/components/4G")
      },
    ]
  },
  {
    path: "/login",
    name: "登录页",
    component: () => import("@/views/login")
  },
  {
    path: "/notFound",
    name: "404",
    component: () => import("@/views/notFound")
  }
];
