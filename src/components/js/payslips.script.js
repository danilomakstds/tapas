import "../scss/payslips.scss";
import Header from '@/components/Header.vue'
import SideNav from '@/components/SideNav.vue'
import { mapState } from 'vuex'
import axios from "axios"
import moment from 'moment'
import Swal from 'sweetalert2'
import SettingsConstants from '../../assets/constants/settings.constants'
import Constants from '../../assets/constants/app.constants'
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
                                        if (response.data.id) {
                                            response.data.forEach(function (taxBracket) {
                                                if (parseFloat(employee.user_salary) >= parseFloat(taxBracket.bracket_start) && parseFloat(employee.user_salary) <= parseFloat(taxBracket.bracket_end)) {
                                                    employee.amountTaxDeduction = parseFloat(taxBracket.base_tax) + ((parseFloat(employee.user_salary) - parseFloat(taxBracket.bracket_start)) * parseFloat(taxBracket.percentage_over));
                                                }
                                            });
                                        }
                                    }
                                }.bind(employee));

                            var name = employee.user_firstname + ' ' + employee.user_middlename + ' ' + employee.user_lastname + ' ' + employee.user_suffix;
                            employee.fullname = name;
                            employee.checked = true;
                            employee.ratePerDay = (employee.user_salary / 20);
                            employee.ratePerHour = (employee.user_salary / 20) / 8;
                            employee.salaryAfterDeductions = 0;
                        });
                        console.log(this.employees);
                    }
                }.bind(this));
        },
        viewPayslip: function (userDetails) {
            var reg = /\s\d\d:\d\d:\d\d\s/;
            var starDate = new Date(this.payperiodStart+' 00:00:00');
            var endDate = new Date(this.payperiodEnd+' 23:59:00');
            //var formatSD = null;
            //var formatED = null;
            //var startQuery = (moment(this.payperiodStart).format('ddd') + ' ' + moment(this.payperiodStart).format(formatSD));
            //var endQuery = (moment(this.payperiodEnd).format('ddd') + ' ' + moment(this.payperiodEnd).format(formatED));
            if(endDate > starDate){
                this.userDetails = userDetails;
                this.userDetails.totalHoursWorked = 0;
                this.userDetails.specialNonWorkingHours = 0;
                this.userDetails.regularHilidayHours = 0;
                this.userDetails.totalLeaveHours = 0;
                this.userDetails.timeinOut = [];
                this.userDetails.holidays = [];
                this.userDetails.leaves = [];
                this.isUserSelected = true;
                axios.get(SettingsConstants.BASE_URL + '/get-time-in-out.rest.php?type=gettimeinout&userId=' + this.userDetails.id, { crossdomain: true })
                .then(function (response) {
                    var validDates = [];
                    if (response.data) {
                        response.data.forEach (function (date, idx, array) {
                            var check = new Date(date.timein);
                            if (check <= endDate && check >= starDate) {
                                var start = null, minutes = null, scheduledIn = null, scheduledOut = null;
                                var end = null;
                                scheduledOut = date.timeout.replace(reg, " " + date.projected_timeout + ":00 ");
                                scheduledIn = date.timein.replace(reg, " " + date.projected_timein + ":00 ");
                                if (date.projected_timeout && date.projected_timein) {
                                    if ((new Date(date.timein)).getTime() > (new Date(scheduledIn)).getTime()) {
                                        var diff = moment(date.timein).diff(moment(scheduledIn), 'minutes');
                                        if (diff < 15) { //if less than 15 minutes
                                            start = moment(scheduledIn);
                                        } else {
                                            start = moment(date.timein);
                                        }
                                    } else {
                                        start = moment(date.timein);
                                    }
                                    (new Date(date.timeout)).getTime() > (new Date(scheduledOut)).getTime() ? end = moment(scheduledOut) : end = moment(date.timeout);
                                } else {
                                    start = start = moment(date.timein);
                                    end = moment(date.timeout);
                                }
                                minutes = end.diff(start, 'minutes');
                                var hours = (minutes/60) > 8? 8 : (minutes/60);
                                this.userDetails.totalHoursWorked += parseFloat(parseFloat(hours).toFixed(2));
                                validDates.push({
                                    'timein': moment(date.timein).format('LT'),
                                    'timeout': moment(date.timeout).format('LT'),
                                    'date': moment(date.timein).format('L'),
                                    'hours': parseFloat(hours).toFixed(2)
                                });
                            }
                            if (idx === array.length - 1){ 
                                this.userDetails.timeinOut = validDates;
                                // this.userDetails.timeinOut.forEach(function (){
                                    
                                // });
                            }
                        }.bind(this));
                    }
                }.bind(this));

                axios.get(SettingsConstants.BASE_URL + '/get-all-holidays.rest.php', { crossdomain: true })
                .then(function (response) {
                    JSON.parse(response.data[0].JSON).response.holidays.forEach(function (event) {
                        var check = new Date(event.date.iso);
                        if (check <= endDate && check >= starDate && event.holidayType == 'Regular' && check.getDay() != 6 && check.getDay() != 0) {
                            this.userDetails.regularHilidayHours += 8;
                            this.userDetails.holidays.push({
                                'date': event.date.iso,
                                'name': event.name,
                                'hours': 8
                            });
                            //console.log(event);
                        }
                    }.bind(this));
                    store.commit('SET_FULL_CALENDAR_PROPS', this.calendarOptions);
                }.bind(this));


                axios.get(SettingsConstants.BASE_URL + '/leave.rest.php?type=all-per-user&userId=' + this.userDetails.id, { crossdomain: true })
                    .then(function (response) {
                        if (response.data) {
                            response.data.forEach(function (myLeaves) {
                                var check = new Date(myLeaves.timestart);
                                if (check <= endDate && check >= starDate) {
                                    switch (myLeaves.leave_type) {
                                    case Constants.LEAVE_TYPES.SICK:
                                        myLeaves.leavetitle = 'Sick Leave';
                                        break;
                                    case Constants.LEAVE_TYPES.VACATION:
                                        myLeaves.leavetitle = 'Vacation Leave';
                                        break;
                                    case Constants.LEAVE_TYPES.EMERGENCY:
                                        myLeaves.leavetitle = 'Emergency Leave';
                                        break;
                                    case Constants.LEAVE_TYPES.MATERNITY:
                                        myLeaves.leavetitle = 'Maternity Leave';
                                        break;
                                    case Constants.LEAVE_TYPES.BIRTHDAY:
                                        myLeaves.leavetitle = 'Birthday Leave';
                                        break;
                                    }
                                    this.userDetails.totalLeaveHours += parseInt(myLeaves.totalhours);
                                    this.userDetails.leaves.push({
                                        'date': moment(myLeaves.timestart).format('L')+' '+moment(myLeaves.timestart).format('LT'),
                                        'name': myLeaves.leavetitle,
                                        'hours': myLeaves.totalhours
                                    });
                                }
                            }.bind(this));
                            store.commit('SET_FULL_CALENDAR_PROPS', this.calendarOptions);
                        }
                    }.bind(this));
            



            } else {
                Swal.fire(
                'Date error!',
                'Invalid dates selected',
                'error'
                )
            }
            
        },
        getTotalHourse: function () {
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