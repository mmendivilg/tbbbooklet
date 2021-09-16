import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Login from '../components/Login.vue'
import Signup from '../components/Signup.vue'
import Ubicaciones from '../components/Ubicaciones.vue'
import MapsTest from '../components/Maps/MapsTest.vue'
import GalleryTest from '../components/GalleryTest.vue'
import ImageTest from '../components/ImageTest.vue'
import UploadTest from '../components/UploadTest.vue'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Signup
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/ubicaciones',
      name: 'ubicaciones',
      component: Ubicaciones,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/maps',
      name: 'maps',
      component: MapsTest,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/upload/:id',
      name: 'upload',
      component: UploadTest,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/gallery/:id',
      name: 'gallery',
      component: GalleryTest,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/image',
      name: 'image',
      component: ImageTest,
      meta: {
        requiresAuth: true
      }
    },
  ]
})
  
router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    store.dispatch('INIT').then(() => {
    }).finally(() => {
      if (store.getters.isLoggedIn) {
        next()
        return
      }
      next('/login')
    })
  } else {
    next()
  }
})
export default router