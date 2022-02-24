<template>
    <header class="header" id="header">
        <div class="header_toggle"> <font-awesome-icon :icon="['fa', 'bars']" id="header-toggle" /></div>
        <!-- <div class="header_img"> <img src="https://i.imgur.com/hczKIze.jpg" alt=""> </div> -->
        <div class="d-flex flex-row-reverse bd-highlight">
          
          <div class="p-2 bd-highlight ps-3">
            <font-awesome-icon :icon="['fa', 'gear']" class="main-icon animate_infinite"/>
          </div>
          
          <div class="p-2 bd-highlight position-relative ps-3">
            <div class="dropdown dropleft">
              <a role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <img :src="avatarUrl" class="rounded-circle" style="height:30px;"/>
                <span class="ms-2">{{sessionData.user_firstname}}</span>
                <font-awesome-icon :icon="['fa', 'angle-down']" style="font-size: 10px" class="ms-2"/>
              </a>
              <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                <a class="dropdown-item" href="#">
                  <font-awesome-icon :icon="['fa', 'user']" class="me-2"/> Profile</a>
                <a class="dropdown-item" href="#">
                  <font-awesome-icon :icon="['fa', 'wallet']" class="me-2"/> My Wallet</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#" @click="logOutUser">
                  <font-awesome-icon :icon="['fa', 'arrow-right-from-bracket']" class="me-2"/> Logout</a>
              </div>
            </div>
          </div>

          <div class="p-2 bd-highlight position-relative ps-3">
            <span class="badge badge-pill badge-danger">9</span>
            <font-awesome-icon :icon="['fa', 'bell']" class="main-icon"/>
          </div>
        </div>
    </header>
</template>

<script>
import store from '../store'
import { mapState } from 'vuex'

export default {
    name: 'Header',
    computed: mapState([
        'sessionData'
    ]),
    data() {
      return {
        avatarUrl: null
      }
    },
    methods: {
        logOutUser: function () {
            store.commit('RESET_SESSION_DATA');
            if (!this.sessionData) {
                window.location.href = '/';
            }
        }
    },
    mounted() {
      this.avatarUrl = this.sessionData.user_avatar;
    },
}
</script>