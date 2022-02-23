// @ is an alias to /src
import "../scss/dashboard.scss";
import axios from "axios";
import Calendar from '@/components/Calendar.vue'
import Clock from '@/components/Clock.vue'
import Announcements from '@/components/Announcements.vue'
import Swal from 'sweetalert2'
import Constants from '../../assets/constants/app.constants'
import SettingsConstants from '../../assets/constants/settings.constants'
import store from '../../store'
import { mapState } from 'vuex'
import moment from "moment";

export default {
    name: 'Dashboard',
    computed: mapState([
        'isUserTimeIn',
        'userTimeIn'
    ]),
    watch: {
    },
    data() {
        return {
            isSideNavOpen: false,
            isOnDuty: false,
            timeInFormated: null,
            timeIn: null,
            timeOut: null
        }
    },
    components: {
        Calendar,
        Clock,
        Announcements,
        Constants
    },
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
        setTimeIn: function () {
            var today = new Date();
            var swalText = "You will be starting your work!";
            if (today.getDay() == 6 || today.getDay() == 0) {
                swalText = "Today is " + Constants.WEEKDAYS[today.getDay()] + "! are you sure you want to time in.";
            }
            Swal.fire({
                title: 'Time In?',
                text: swalText,
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#6C757D',
                confirmButtonText: 'Yes, continue!'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.isOnDuty = true;
                    store.commit('SET_USER_TIME_IN', today);
                    store.commit('SET_IS_USER_TIME_IN', this.isOnDuty);
                    this.saveTimeInOut(today, 'timein');
                    Swal.fire(
                        'Success!',
                        'You are now on duty.',
                        'success'
                    );
                }
            });
        },
        setTimeOut: function () {
            var timeOut = new Date();
            Swal.fire({
                title: 'Time Out?',
                text: "You will be timing out",
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#6C757D',
                confirmButtonText: 'Yes, continue!'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.isOnDuty = false;
                    this.timeOut = timeOut;
                    store.commit('SET_IS_USER_TIME_IN', this.isOnDuty);
                    this.saveTimeInOut(timeOut, 'timeout');
                    Swal.fire(
                        'Success!',
                        'You are now on duty.',
                        'success'
                    );

                }
            });
        },
        formatDigits: function (date) {
            var time = new Date(date);
            var utc = new Date(date).toJSON().slice(0, 10).replace(/-/g, '/');
            var formated = utc + " - " + moment(time).format('LTS');
            return formated;
        },
        projectedTimeOut: function (date) {
            var time = new Date(date);
            Date.prototype.addHours = function (h) {
                this.setHours(this.getHours() + h);
                return this;
            }
            return time.addHours(9);
        },
        saveTimeInOut: function (date, type) {
            var bodyFormData = new FormData();
            bodyFormData.append(type, date);
            if (type == 'timeout') {
                bodyFormData.append('timein', this.userTimeIn);
            }
            axios({
                method: "post",
                url: SettingsConstants.BASE_URL + "/postTimeInOut.REST.php?type=" + type,
                data: bodyFormData,
                headers: { "Content-Type": "multipart/form-data" },
            })
                .then(function (response) {
                    console.log(response);
                    this.$refs.calendar.emitFunctions();
                }.bind(this))
                .catch(function (response) {
                    console.log(response);
                });
        }
    },
    mounted() {
        this.isOnDuty = this.isUserTimeIn;
        this.initSideNav();
    },
}