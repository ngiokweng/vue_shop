import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/Login.vue'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')
// import Home from '../components/Home.vue'
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')
// import Welcome from '../components/Welcome.vue'
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue')
// import Users from '../components/user/Users.vue'
const Users = () => import(/* webpackChunkName: "users_rights_roles" */ '../components/user/Users.vue')
// import Rights from '../components/power/Rights.vue'
const Rights = () => import(/* webpackChunkName: "users_rights_roles" */ '../components/power/Rights.vue')
// import Roles from '../components/power/Roles.vue'
const Roles = () => import(/* webpackChunkName: "users_rights_roles" */ '../components/power/Roles.vue')
// import Categories from '../components/goods/Categories.vue'
const Categories = () => import(/* webpackChunkName: "cate_params" */ '../components/goods/Categories.vue')
// import Params from '../components/goods/Params.vue'
const Params = () => import(/* webpackChunkName: "cate_params" */ '../components/goods/Params.vue')
// import List from '../components/goods/List.vue'
const List = () => import(/* webpackChunkName: "list_add" */ '../components/goods/List.vue')
// import Add from '../components/goods/Add.vue'
const Add = () => import(/* webpackChunkName: "list_add" */ '../components/goods/Add.vue')
// import Orders from '../components/order/Orders.vue'
const Orders = () => import(/* webpackChunkName: "orders_reports" */ '../components/order/Orders.vue')
// import Reports from '../components/report/Reports.vue'
const Reports = () => import(/* webpackChunkName: "orders_reports" */ '../components/report/Reports.vue')

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
      },
      {
        path: '/goods', component: List
      },
      {
        path: '/goods/add', component: Add
      },
      {
        path: '/orders', component: Orders
      },
      {
        path: '/reports', component: Reports
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
