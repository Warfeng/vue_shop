import Vue from "vue"
import Router from "vue-router"
import Login from "./components/Login"
import Home from "./components/Home"
import Welcome from "./components/Welcome"
import Users from "./components/user/Users"
import Rights from '@/components/power/Rights'
import Roles from '@/components/power/Roles'
import Cate from '@/components/goods/Cate'

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Cate }
    ]}
  ]
})

// 路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 放行 next('/')强制跳转

  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
