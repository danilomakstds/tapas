// @ is an alias to /src
import "../scss/login.scss";
import axios from "axios";
// import Swal from 'sweetalert2'
// import Constants from '../../assets/constants/app.constants'
import SettingsConstants from '../../assets/constants/settings.constants'
//import AlertComponent from '@/components/AlertComponent.vue'
import store from '../../store'
import { mapState } from 'vuex'
// import moment from "moment";

export default {
    name: 'Login',
    computed: mapState([
        'sessionData'
    ]),
    watch: {
    },
    data() {
        return {
            user_email: null,
            user_password: null,
            showMessage: false,
            message: null,
            messageType: null
        }
    },
    components: {
    },
    methods: {
        userLogin: function (event) {
            event.preventDefault();
            var md5 = require('md5');
            this.checkIfUserExist(this.user_email, md5(this.user_password));
        },
        checkIfUserExist: function (uname, pass) {
            var bodyFormData = new FormData();
            bodyFormData.append('username', uname);
            bodyFormData.append('password', pass);
            axios({
                method: "post",
                url: SettingsConstants.BASE_URL + "/post-check-user.rest.php",
                data: bodyFormData,
                headers: { "Content-Type": "multipart/form-data" },
            })
                .then(function (response) {

                    if (response.data[0].user_email) {
                        this.message = "<strong>Success! </strong>";
                        this.messageType = "alert-success";
                        //start session
                        store.commit('SET_SESSION_DATA', response.data[0]);
                        if (this.sessionData) {
                            window.location.href = '/dashboard';
                        }
                    } else {
                        this.showMessage = true;
                        this.message = "<strong>Error! </strong> No user found matching email and password!";
                        this.messageType = "alert-danger";
                    }

                }.bind(this))
                .catch(function (response) {
                    console.log(response);
                });
        },
    },
    mounted() {
        window.$('body').addClass('login-body');
    },
}