import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Categories from '../components/goods/Categories.vue'
import Params from '../components/goods/Params.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome', component: Welcome
      },
      {
        path: '/users', component: Users
      },
      {
        path: '/rights', component: Rights
      },
      {
        path: '/roles', component: Roles
      },
      {
        path: '/categories', component: Categories
      },
      {
        path: '/params', component: Params
      }
    ]
  }
]
const router = new VueRouter({
  routes: routes
})
// 路由導航守衙
router.beforeEach((to, from, next) => {
  // to:前往的地址
  // from:從哪個地址跳轉而來
  // next():放行    next('/login'):強制跳轉到/login
  if (to.path === '/login') {
    return next()
  }
  const token = window.sessionStorage.getItem('token')
  if (!token) {
    return next('/login')
  }
  next()
})
export default router
