import "../scss/payslips.scss";
import Header from '@/components/Header.vue'
import SideNav from '@/components/SideNav.vue'
import { mapState } from 'vuex'
import store from '../../store'
//import { Tab } from 'bootstrap'

export default {
    name: 'Payslips',
    computed: mapState([
        'sessionData',
        'lastSelectedView'
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
    },
    methods: {
        selectTab: function (event) {
            store.commit('SET_LAST_SELECTED_VIEW', event.target.id);
        }
    },
    mounted() {
        // if (this.lastSelectedView) {
        //     var someTabTriggerEl = document.querySelector('#' + this.lastSelectedView);
        //     var tab = new Tab(someTabTriggerEl);
        //     tab.show();
        // }
    },
}