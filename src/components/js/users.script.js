import "../scss/users.scss";
import Header from '@/components/Header.vue'
import SideNav from '@/components/SideNav.vue'
import SettingsConstants from '../../assets/constants/settings.constants'
import { mapState } from 'vuex'
import axios from "axios";
//import store from '../store'

export default {
    name: 'Users',
    computed: mapState([
        'sessionData'
    ]),
    components: {
        Header,
        SideNav
    },
    watch: {
    },
    data() {
        return {
            userData: null,
        }
    },
    methods: {
        initUsers: function () {
            axios.get(SettingsConstants.BASE_URL + '/get-users.rest.php', { crossdomain: true })
                .then(function (response) {
                    // response.data.forEach(function (user){
                    //     switch (user.user_level) {
                    //         case Constants.USERLEVEL.ADMIN:
                    //             response.data.push()
                    //     }
                    // });
                    this.userData = response.data;

                }.bind(this));
        }
    },
    mounted() {
        this.initUsers();
    },

}