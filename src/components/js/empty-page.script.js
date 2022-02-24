import Header from '@/components/Header.vue'
import SideNav from '@/components/SideNav.vue'
import { mapState } from 'vuex'

export default {
    name: 'Empty',
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