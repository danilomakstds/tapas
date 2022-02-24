<template>
    <div class="l-navbar" id="nav-bar">
        <nav class="nav">
           <div id="route_list">
              <a href="#" class="nav_logo">
                <span class="nav_logo-name">
                  <img src="../assets/images/maks.png" class="me-3" style="height:35px"/> T P A S
                </span>
              </a>
              <div class="nav_list">
                <a href="/dashboard" class="nav_link" id="dashboard-link">
                  <font-awesome-icon :icon="['fa', 'chart-line']" class="ms-2 nav_icon" />
                  <span class="nav_name">Dashboard</span>
                </a>
                <a href="#" class="nav_link" id="payslip-link">
                  <font-awesome-icon :icon="['fa', 'money-check-dollar']" class="ms-2 nav_icon" />
                  <span class="nav_name">Payslips</span>
                </a>
                <a href="#" class="nav_link" id="leave-link">
                  <font-awesome-icon :icon="['fa-solid', 'mug-hot']" class="ms-2 nav_icon" />
                  <span class="nav_name">&nbsp;Leave</span>
                </a>
                <a href="#" class="nav_link" id="overtime-link">
                  <font-awesome-icon :icon="['fa-solid', 'clock-four']" class="ms-2 nav_icon" />
                  <span class="nav_name">&nbsp;Overtime</span>
                </a>
                <a href="#" class="nav_link" id="holidays-link">
                  <font-awesome-icon :icon="['fa-solid', 'cake-candles']" class="ms-2 nav_icon" />
                  <span class="nav_name"> &nbsp;&nbsp;Holidays</span>
                </a>
                <a href="/users" class="nav_link" id="users-link">
                  <font-awesome-icon :icon="['fa-solid', 'user-group']" class="ms-2 nav_icon" />
                  <span class="nav_name">Users</span>
                </a>
                <a href="#" class="nav_link" id="profile-link">
                  <font-awesome-icon :icon="['fa-solid', 'user-gear']" class="ms-2 nav_icon" />
                  <span class="nav_name">Profile</span>
                </a>
              </div>
            </div> 
            <!-- <a href="#" class="nav_link"> <i class='bx bx-log-out nav_icon'></i> <span class="nav_name">SignOut</span> </a> -->
        </nav>
    </div>

    <br/>
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#" class="text-secondary">Maks</a></li>
        <li class="breadcrumb-item"><a href="#" class="text-secondary">TPAS</a></li>
        <li class="breadcrumb-item text-secondary">{{$root.$route.name}}</li>
      </ol>
    </nav>
    
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'SideNav',
    computed: mapState([
        'sessionData',
        'lastSelectedView'
    ]),
    methods: {
        initSideNav: function () {
            var showNavbar = (toggleId, navId, bodyId, headerId) => {
                const toggle = document.getElementById(toggleId),
                    nav = document.getElementById(navId),
                    bodypd = document.getElementById(bodyId),
                    headerpd = document.getElementById(headerId)

                // Validate that all variables exist
                if (toggle && nav && bodypd && headerpd) {
                    toggle.addEventListener('click', () => {
                        // show navbar
                        nav.classList.toggle('show')
                        // change icon
                        toggle.classList.toggle('bx-x')
                        // add padding to body
                        bodypd.classList.toggle('dashboard-pd')
                        // add padding to header
                        headerpd.classList.toggle('body-pd')
                    })
                }
            }
            showNavbar('header-toggle', 'nav-bar', 'body-pd', 'header')
            const linkColor = document.querySelectorAll('.nav_link')
            function colorLink() {
                if (linkColor) {
                    linkColor.forEach(l => l.classList.remove('active'))
                    this.classList.add('active')
                }
            }
            linkColor.forEach(l => l.addEventListener('click', colorLink));
        },
        setView: function () {
            var path = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
            // console.log(this.$router.options.routes);
            // pathlist = this.$root.$router.getRoutes();
            var linkIdArray = [];
            window.$('#route_list .nav_link').each(function () {
                linkIdArray.push(this.id);
            });
            linkIdArray.forEach(function (route) {
                if (path == route.replace('-link', '')) {
                    window.$('#' + route).addClass('active');
                }
            });

        }
    },
    mounted() {
        this.initSideNav();
        this.setView();
    }
}
</script>