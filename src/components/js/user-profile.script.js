import "../scss/profile.scss";
import Header from '@/components/Header.vue'
import SideNav from '@/components/SideNav.vue'
import { mapState } from 'vuex'
import axios from "axios"
import SettingsConstants from '../../assets/constants/settings.constants'

export default {
    name: 'UserProfile',
    computed: mapState([
        'sessionData'
    ]),
    watch: {
    },
    data() {
        return {
            userDetails: []
        }
    },
    components: {
        Header,
        SideNav
    },
    methods: {
        getUserDetails: function () {
            axios.get(SettingsConstants.BASE_URL + '/get-users.rest.php?type=all-byid&userId=' + this.sessionData.id, { crossdomain: true })
                .then(function (response) {
                    if (response.data) {
                        this.userDetails = response.data[0];
                    }
                }.bind(this));
        }
    },
    mounted() {
        this.getUserDetails();
    },
}