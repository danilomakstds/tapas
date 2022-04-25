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
            isUserSelected: false,
            allowanceDeduction: [],
            selectedPeriod: 15
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
                            axios.get(SettingsConstants.BASE_URL + '/deduction-adjustments.rest.php?type=adjustments-deduction&userId=' + employee.id, { crossdomain: true })
                                .then(function (response) {
                                    if (response.data) {
                                        response.data.forEach(function (ad) {
                                            employee.sssDeduction = ad.sss;
                                            employee.pagibigDeduction = ad.pagibig;
                                            employee.philhealthDeduction = ad.philhealth;
                                            employee.taxDeduction = ad.tax;
                                            employee.otherAdjustments = ad.other_adjustments;
                                            employee.loanDeduction = ad.loan;
                                            employee.amountPagibigDeduction = parseFloat(ad.amount_pagibig);
                                            employee.amountPagibigMp2Deduction = parseFloat(ad.amount_pagibig_mp2);
                                            employee.amountPhilhealthDeduction = parseFloat(ad.amount_philhealth);
                                            employee.amountSSSDeduction = parseFloat(ad.amount_sss);
                                        });
                                    }
                                }.bind(employee));
                            axios.get(SettingsConstants.BASE_URL + '/deduction-adjustments.rest.php?type=tax-bracket', { crossdomain: true })
                                .then(function (response) {
                                    if (response.data) {
                                        response.data.forEach(function (taxBracket) {
                                            if (parseFloat(employee.user_salary) >= parseFloat(taxBracket.bracket_start) && parseFloat(employee.user_salary) <= parseFloat(taxBracket.bracket_end)) {
                                                employee.amountTaxDeduction = parseFloat(taxBracket.base_tax) + ((parseFloat(employee.user_salary) - parseFloat(taxBracket.bracket_start)) * parseFloat(taxBracket.percentage_over));
                                            }
                                        });
                                    }
                                }.bind(employee));

                            var name = employee.user_firstname + ' ' + employee.user_middlename + ' ' + employee.user_lastname + ' ' + employee.user_suffix;
                            employee.fullname = name;
                            employee.checked = true;
                            employee.ratePerDay = (employee.user_salary / 20);
                            employee.ratePerHour = (employee.user_salary / 20) / 8;
                            employee.salaryAfterDeductions;
                        });
                        console.log(this.employees);
                    }
                }.bind(this));
        },
        viewPayslip: function (userDetails) {
            this.userDetails = userDetails;
            this.isUserSelected = true;
        },
        generatePayslip: function () {

        },
        selectTab: function (event) {
            store.commit('SET_LAST_SELECTED_VIEW', event.target.id);
        },
        printPayslip: function () {
            var divToPrint = document.getElementById("payslip-table");
            var newWin = window.open('', '', 'height=600,width=1000');
            newWin.document.write('<head><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"' +
                'integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">');
            newWin.document.write('<style> #payslip-table {border: 1px solid #ccc;} #payslip-table tr td {border: 1px solid #ccc; padding: 10px;}</style></head>');
            setTimeout(function () {
                newWin.document.write(divToPrint.outerHTML);
                newWin.document.close();
                newWin.focus();
                newWin.print();
                setTimeout(function () {
                    newWin.close();
                }, 500);
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