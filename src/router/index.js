import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Login from '../views/Login.vue'
import Users from '../views/Users.vue'
import UserProfile from '../views/UserProfile.vue'
import Payslips from '../views/Payslips.vue'
import Request from '../views/Request.vue'
import store from '../store'
//import settingsConstants from '../assets/constants/settings.constants'

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
    path: '/profile',
    name: 'Profile',
    component: UserProfile
  },
  {
    path: '/payslips',
    name: 'Payslips',
    component: Payslips
  },
  {
    path: '/request',
    name: 'Request',
    component: Request
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
