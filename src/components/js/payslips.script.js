import "../scss/payslips.scss";
import Header from '@/components/Header.vue'
import SideNav from '@/components/SideNav.vue'
import { mapState } from 'vuex'
import axios from "axios"
// import moment from 'moment'
// import Swal from 'sweetalert2'
import SettingsConstants from '../../assets/constants/settings.constants'
import store from '../../store'
import { Tab } from 'bootstrap'

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
            employees: [],
            payperiodStart: null,
            payperiodEnd: null,
            userDetails: [],
        }
    },
    components: {
        Header,
        SideNav
    },
    methods: {
        getAllEmployees: function () {
            axios.get(SettingsConstants.BASE_URL + '/get-users.rest.php?type=all', { crossdomain: true })
                .then(function (response) {
                    if (response.data) {

                        this.employees = response.data;
                        this.employees.forEach(function (employee) {
                            var name = employee.user_firstname + ' ' + employee.user_middlename + ' ' + employee.user_lastname + ' ' + employee.user_suffix;
                            employee.fullname = name;
                            employee.checked = true;
                            employee.ratePerDay = (employee.user_salary / 20);
                            employee.ratePerHour = (employee.user_salary / 20) / 8;
                        });
                        //console.log(this.employees);
                    }
                }.bind(this));
        },
        viewPayslip: function (userDetails) {
            this.userDetails = userDetails;
        },
        selectTab: function (event) {
            store.commit('SET_LAST_SELECTED_VIEW', event.target.id);
        },
        printPayslip: function () {
            var divToPrint = document.getElementById("payslip-table");
            var newWin = window.open("");
            newWin.document.write('<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"' +
                'integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">');
            newWin.document.write('<style>#payslip-table {' +
                'border: 1px solid #ccc;}#payslip-table tr td{border: 1px solid #ccc;padding: 10px;} html {font-family: "Poppins", sans-serif;' +
                'font-size: 15px;}</style>');
            newWin.document.write('<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet"/>');
            setTimeout(function () {
                newWin.document.write(divToPrint.outerHTML);
                newWin.print();
                newWin.close();
            }, 500);
        }
    },
    mounted() {
        if (this.lastSelectedView) {
            var someTabTriggerEl = document.querySelector('#' + this.lastSelectedView);
            if (someTabTriggerEl) {
                var tab = new Tab(someTabTriggerEl);
                tab.show();
            }
        }
        this.getAllEmployees();
    },
}