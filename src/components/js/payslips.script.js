import "../scss/payslips.scss";
import Header from '@/components/Header.vue'
import SideNav from '@/components/SideNav.vue'
import { mapState } from 'vuex'

export default {
    name: 'Payslips',
    computed: mapState([
        'sessionData'
    ]),
    watch: {
    },
    data() {
        return {
        }
    },
    components: {
        Header,
        SideNav
    }
}