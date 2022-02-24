import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Login from '../views/Login.vue'
import Users from '../views/Users.vue'
import store from '../store'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/users',
    name: 'Users',
    component: Users
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'Login',
    component: Login
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to) => {
  var sessionData = store.state.sessionData;
  if (to.name == 'Login') {
    if (sessionData) {
      return { name: 'Dashboard' };
    }
  } else {
    if (!sessionData) {
      return { name: 'Login' };
    }
  }
})



export default router
