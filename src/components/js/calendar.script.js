import "../scss/calendar.scss"
import axios from "axios";
import '@fullcalendar/core/vdom' // solves problem with Vite
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import Constants from '../../assets/constants/app.constants'
import SettingsConstants from '../../assets/constants/settings.constants'
import store from '../../store'
import { mapState } from 'vuex'
import moment from 'moment'
import { Modal } from 'bootstrap'
import Swal from 'sweetalert2'

export default {
    name: 'Calendar',
    computed: mapState([
        'fullCalendarProps',
        'sessionData'
    ]),
    props: {
        msg: String
    },
    watch: {
        calendarOptions: function (newval) {
            console.log(newval);
        }
    },
    components: {
        FullCalendar,
        Constants
    },
    data() {
        return {
            viewEventModal: null,
            viewLeaveEventModal: null,
            calendarOptions: {
                plugins: [dayGridPlugin, interactionPlugin],
                initialView: 'dayGridMonth',
                dateClick: this.handleDateClick,
                events: [],
                eventClick: function (info) {
                    this.selectedEvent = [];
                    this.selectedEvent = info.event;
                    setTimeout(function () {
                        this.editTimeInOutMode = false;
                        this.addOTRequestMode = false;
                        if (info.event._def.extendedProps.otMinutes) {
                            this.sliderValue = info.event._def.extendedProps.otMinutes;
                        } else {
                            this.sliderValue = null;
                        }
                        this.selectedEvent.envStart = moment(info.event._def.extendedProps.evntStart).format('LLL');
                        this.selectedEvent.envEnd = moment(info.event._def.extendedProps.realTimeOut).format('LLL');
                        this.editTimeIn = moment(info.event._def.extendedProps.evntStart).format("HH:mm");
                        this.editTimeOut = moment(info.event._def.extendedProps.realTimeOut).format("HH:mm");
                        this.checkIfOtCreated(info.event._def.extendedProps.evntStart);
                        this.viewEventModal = new Modal(document.getElementById('viewEventModal'));
                        this.viewEventModal.toggle();
                        console.log(info.event);
                    }.bind(this), 100);
                }.bind(this)
            },
            holidayEvents: [],
            myApprovedLeaveEvents: [],
            timeInOutEvents: [],
            selectedEvent: [],
            editTimeInOutMode: false,
            editTimeIn: null,
            editTimeOut: null,
            timeEditComment: null,
            userBasicDetails: [],
            sliderValue: null,
            isOTCreated: false,
        }
    },
    methods: {
        handleDateClick: function (arg) {
            console.log(arg);
            //alert('date click! ' + arg.dateStr)
        },
        editTimeInOut: function () {
            if (this.editTimeInOutMode) {
                this.editTimeInOutMode = false;
            } else {
                this.editTimeInOutMode = true;
            }
        },
        addOTRequest: function (otEvent, value) {
            Swal.fire({
                title: 'OT request',
                text: 'Create overtime request for ' + value + ' minutes?',
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#6C757D',
                confirmButtonText: 'Yes, create it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    var bodyFormData = new FormData();
                    bodyFormData.append('date_id', otEvent._def.extendedProps.evntId);
                    bodyFormData.append('minutes', value);
                    bodyFormData.append('date', otEvent._def.extendedProps.evntStart);
                    axios({
                        method: "post",
                        url: SettingsConstants.BASE_URL + "/overtime.rest.php?type=add&userId=" + this.sessionData.id,
                        data: bodyFormData,
                        headers: { "Content-Type": "multipart/form-data" },
                    })
                        .then(function (response) {
                            if (response.data) {
                                this.viewEventModal.toggle();
                                Swal.fire(
                                    'Created!',
                                    'OT request has been created.',
                                    'success'
                                )
                            }
                            console.log(response);
                        }.bind(this))
                        .catch(function (response) {
                            console.log(response);
                        });
                }
            })
        },
        submitTimeInOutRequest: function (event) {
            event.preventDefault();
            var bodyFormData = new FormData();
            bodyFormData.append('timein_id', this.selectedEvent._def.extendedProps.evntId);
            bodyFormData.append('new_timein', this.editTimeIn);
            bodyFormData.append('new_timeout', this.editTimeOut);
            bodyFormData.append('comment', this.timeEditComment);
            axios({
                method: "post",
                url: SettingsConstants.BASE_URL + "/post-time-in-out.rest.php?type=edittimeinout&userId=" + this.sessionData.id,
                data: bodyFormData,
                headers: { "Content-Type": "multipart/form-data" },
            })
                .then(function (response) {
                    if (response.data) {
                        this.viewEventModal.toggle();
                        this.editTimeInOutMode = false;
                        Swal.fire(
                            'Success!',
                            'Time edit request created!',
                            'success'
                        )
                    }
                    //console.log(response);
                }.bind(this))
                .catch(function (response) {
                    console.log(response);
                });
        },
        resetCalender: function () {
            this.calendarOptions.events = [];
        },
        getAllHolidays: function () {
            axios.get(SettingsConstants.BASE_URL + '/get-all-holidays.rest.php', { crossdomain: true })
                .then(function (response) {
                    this.holidayEvents = JSON.parse(response.data[0].JSON).response.holidays
                    this.holidayEvents.forEach(function (event) {
                        if (event.holidayType == 'Regular'
                            || event.holidayType == 'Special') {
                            event.title = event.name;
                            event.realTitle = event.name;
                            event.date = event.date.iso;
                            if (event.holidayType == 'Special') {
                                event.backgroundColor = "#D6D8D9";
                                event.borderColor = "#6C757D";
                                event.textColor = "#000";
                            } else {
                                event.backgroundColor = "#6C757D";
                                event.borderColor = "#6C757D";
                            }
                            this.calendarOptions.events.push(event);
                        }
                    }.bind(this));
                    store.commit('SET_FULL_CALENDAR_PROPS', this.calendarOptions);
                }.bind(this));
        },
        getAllTimeInOutPerUser: function () {
            axios.get(SettingsConstants.BASE_URL + '/get-time-in-out.rest.php?type=gettimeinout&userId=' + this.sessionData.id, { crossdomain: true })
                .then(function (response) {
                    if (response.data) {
                        store.commit('SET_IS_USER_TIME_IN', false);
                        this.$emit('updateIsOnDuty', false);
                        response.data.forEach(function (e) {
                            var event = [];
                            var end = null, start = null, minutes = null, sheduledOut = null, scheduledIn = null, ot = null;

                            /* get Scheduled out */
                            var reg = /\s\d\d:\d\d:\d\d\s/
                            if (e.timeout && e.projected_timeout) {
                                var scheduledOut = e.timeout.replace(reg, " " + e.projected_timeout + ":00 ");
                                /* get Scheduled out */
                                /* use scheduled out as timeout if user exceeds scheduled out */
                                if ((new Date(scheduledOut)).getTime() < (new Date(e.timeout)).getTime()) {
                                    ot = moment(e.timeout).diff(moment(scheduledOut), 'minutes');
                                    //console.log(ot);
                                }
                            }


                            /* use scheduled out as timeout if user exceeds scheduled out */
                            if (e.projected_timein) {
                                scheduledIn = e.timein.replace(reg, " " + e.projected_timein + ":00 ");
                            } else {
                                scheduledIn = e.timein;
                            }

                            if ((new Date(e.timein)).getTime() > (new Date(scheduledIn)).getTime()) {
                                var diff = moment(e.timein).diff(moment(scheduledIn), 'minutes');
                                if (diff < 15) { //if less than 15 minutes
                                    start = moment(scheduledIn);
                                } else {
                                    start = moment(e.timein);
                                }
                            } else {
                                start = moment(e.timein);
                            }

                            event.realTimeOut = moment(e.timeout).format()
                            event.start = start.format();
                            event.evntStart = start.format();
                            if (e.timeout) {
                                sheduledOut = scheduledOut ? moment(scheduledOut) : moment(e.timeout);
                                end = moment(e.timeout);
                                minutes = sheduledOut.diff(start, 'minutes');
                                minutes = minutes + (ot ? ot : 0);
                                if (ot) {
                                    event.otMinutes = ot;
                                }
                                if (!sheduledOut && minutes > 540) {
                                    event.otMinutes = minutes - 540;
                                }
                                event.end = end.format();
                                event.evntEnd = end.format();
                                event.evntId = e.id;
                            }
                            if (!minutes) {
                                event.title = start.format('LT') + " - Time In";
                                event.realTitle = "Time In";
                                event.backgroundColor = "#D1E7DD";
                                event.textColor = "#555";
                                store.commit('SET_NO_TIME_OUT_ID', e.id);
                                store.commit('SET_IS_USER_TIME_IN', true);
                                this.$emit('updateIsOnDuty', true);
                            } else {
                                event.title = parseFloat((minutes - 60) / 60).toFixed(2) + "h Time In - Time Out";
                                event.realTitle = "Time In - Time Out";
                                event.backgroundColor = "#5CB85C";
                            }
                            event.allDay = true;
                            event.borderColor = "#5CB85C";
                            this.calendarOptions.events.push(event);
                        }.bind(this));
                        store.commit('SET_FULL_CALENDAR_PROPS', this.calendarOptions);
                    }
                }.bind(this));
        },
        // getAllTimeInOut: function () {
        //     axios.get(SettingsConstants.BASE_URL + '/get-time-in-out.rest.php?type=getalltimeinout', { crossdomain: true })
        //         .then(function (response) {
        //             if (response.data) {
        //             response.data.forEach(function (e, index) {
        //                 var event = [];
        //                 var end, start, minutes;

        //                 /* get Scheduled out */
        //                 var reg = /\s\d\d:\d\d:\d\d\s/
        //                 if (e.timeout) {
        //                     var scheduledOut = e.timeout.replace(reg, " " + e.projected_timeout + ":00 ");
        //                         /* get Scheduled out */

        //                     /* use scheduled out as timeout if user exceeds scheduled out */
        //                     if ((new Date(scheduledOut)).getTime() < (new Date(e.timeout)).getTime()) {
        //                         end = moment(scheduledOut);
        //                     } else {
        //                         end = moment(e.timeout);
        //                     }
        //                     end = moment(e.timeout);
        //                 }


        //                 /* use scheduled out as timeout if user exceeds scheduled out */

        //                 start = moment(e.timein);
        //                 event.start = start.format();
        //                 event.evntStart = start.format();
        //                 if (e.timeout) {
        //                     minutes = end.diff(start, 'minutes');
        //                     event.end = end.format();
        //                     event.evntEnd = end.format();
        //                     event.evntId = e.id;
        //                 }
        //                 console.log(minutes);
        //                 alert(minutes);
        //                 if (!minutes) {
        //                     event.title = start.format('LT') + " - Time In";
        //                     event.realTitle = "Time In";
        //                     event.backgroundColor = "#D1E7DD";
        //                     event.textColor = "#555";
        //                     if (response.data.length == index + 1) {
        //                         store.commit('SET_IS_USER_TIME_IN', true);
        //                         this.$emit('updateIsOnDuty', true);
        //                     }
        //                 } else {
        //                     event.title = parseFloat((minutes - 60) / 60).toFixed(1) + "h Time In - Time Out";
        //                     event.realTitle = "Time In - Time Out";
        //                     event.backgroundColor = "#5CB85C";
        //                     if (response.data.length - 1 == index + 1) {
        //                         store.commit('SET_IS_USER_TIME_IN', false);
        //                         this.$emit('updateIsOnDuty', false);
        //                     }
        //                 }
        //                 event.allDay = true;
        //                 event.borderColor = "#5CB85C";
        //                 this.calendarOptions.events.push(event);

        //             }.bind(this));
        //                 store.commit('SET_FULL_CALENDAR_PROPS', this.calendarOptions);
        //             }
        //         }.bind(this));
        // },
        getAllApprovedLeavePerUser: function () {
            axios.get(SettingsConstants.BASE_URL + '/leave.rest.php?type=all-per-user&userId=' + this.sessionData.id, { crossdomain: true })
                .then(function (response) {
                    if (response.data) {
                        this.myApprovedLeaveEvents = response.data;
                        this.myApprovedLeaveEvents.forEach(function (myLeaves) {
                            var event = [];
                            switch (myLeaves.leave_type) {
                                case Constants.LEAVE_TYPES.SICK:
                                    event.title = 'Sick Leave';
                                    event.backgroundColor = "#FFC107";
                                    event.borderColor = "#FFC107";
                                    break;
                                case Constants.LEAVE_TYPES.VACATION:
                                    event.title = 'Vacation Leave';
                                    event.backgroundColor = "#007BFF";
                                    event.borderColor = "#007BFF";
                                    break;
                                case Constants.LEAVE_TYPES.EMERGENCY:
                                    event.title = 'Emergency Leave';
                                    event.backgroundColor = "#DC3545";
                                    event.borderColor = "#DC3545";
                                    break;
                                case Constants.LEAVE_TYPES.MATERNITY:
                                    event.title = 'Maternity Leave';
                                    event.backgroundColor = "#563D7C"
                                    event.borderColor = "#563D7C"
                                    break;
                                case Constants.LEAVE_TYPES.BIRTHDAY:
                                    event.title = 'Birthday Leave';
                                    event.backgroundColor = "#17A2B8";
                                    event.borderColor = "#17A2B8";
                                    break;
                            }
                            event.date = moment(myLeaves.timestart).format('YYYY-MM-DD');
                            event.eventDay = moment(myLeaves.timestart).format('LL');
                            event.evntStart = myLeaves.timestart;
                            event.evntEnd = myLeaves.timeend;
                            event.realTitle = event.title;
                            event.allDay = true;
                            event.eventType = "leave";
                            event.description = myLeaves.comment;
                            this.calendarOptions.events.push(event);
                        }.bind(this));
                        store.commit('SET_FULL_CALENDAR_PROPS', this.calendarOptions);
                    }
                }.bind(this));
        },
        getAllApprovedLeave: function () {
            axios.get(SettingsConstants.BASE_URL + '/leave.rest.php?type=all-approved', { crossdomain: true })
                .then(function (response) {
                    if (response.data) {
                        this.myApprovedLeaveEvents = response.data;
                        this.myApprovedLeaveEvents.forEach(function (myLeaves) {
                            var event = [];
                            switch (myLeaves.leave_type) {
                                case Constants.LEAVE_TYPES.SICK:
                                    event.title = 'Sick Leave';
                                    event.backgroundColor = "#FFC107";
                                    event.borderColor = "#FFC107";
                                    break;
                                case Constants.LEAVE_TYPES.VACATION:
                                    event.title = 'Vacation Leave';
                                    event.backgroundColor = "#007BFF";
                                    event.borderColor = "#007BFF";
                                    break;
                                case Constants.LEAVE_TYPES.EMERGENCY:
                                    event.title = 'Emergency Leave';
                                    event.backgroundColor = "#DC3545";
                                    event.borderColor = "#DC3545";
                                    break;
                                case Constants.LEAVE_TYPES.MATERNITY:
                                    event.title = 'Maternity Leave';
                                    event.backgroundColor = "#563D7C"
                                    event.borderColor = "#563D7C"
                                    break;
                                case Constants.LEAVE_TYPES.BIRTHDAY:
                                    event.title = 'Birthday Leave';
                                    event.backgroundColor = "#17A2B8";
                                    event.borderColor = "#17A2B8";
                                    break;
                            }
                            event.date = moment(myLeaves.timestart).format('YYYY-MM-DD');
                            event.eventDay = moment(myLeaves.timestart).format('LL');
                            event.evntStart = myLeaves.timestart;
                            event.evntEnd = myLeaves.timeend;
                            event.realTitle = event.title;
                            event.allDay = true;
                            event.eventType = "leave";
                            event.description = myLeaves.comment;
                            if (parseInt(this.sessionData.user_level) > 1) {
                                this.userBasicDetails.data.filter(function (user) {
                                    if (user.id == myLeaves.userId) {
                                        event.title = user.user_firstname + ' - ' + event.title;
                                        event.username = user.user_firstname + ' ' + user.user_lastname;
                                    }
                                }.bind(event));
                            }
                            this.calendarOptions.events.push(event);
                        }.bind(this));
                        store.commit('SET_FULL_CALENDAR_PROPS', this.calendarOptions);
                    }
                }.bind(this));
        },
        checkIfOtCreated: function (date) {
            axios.get(SettingsConstants.BASE_URL + '/overtime.rest.php?type=get-item-bydate&userId=' + this.sessionData.id + '&date=' + date, { crossdomain: true })
                .then(function (response) {
                    if (response.data) {
                        this.isOTCreated = true;
                    } else {
                        this.isOTCreated = false;
                    }
                }.bind(this));
        },
        getAllUserBasicDetails: function () {
            axios.get(SettingsConstants.BASE_URL + '/get-users.rest.php?type=all-user', { crossdomain: true })
                .then(function (response) {
                    if (response.data) {
                        this.userBasicDetails = response;
                    }
                }.bind(this));
        },
        emitFunctions: function () {
            this.resetCalender();
            if (this.sessionData.user_level > 1) {
                this.getAllUserBasicDetails();
                //this.getAllTimeInOut();
                this.getAllApprovedLeave();
            } else {
                this.getAllApprovedLeavePerUser();
            }
            this.getAllTimeInOutPerUser();
            this.getAllHolidays();
            this.getAllApprovedLeavePerUser();
        }
    },
    created() {
        this.emitFunctions();
    },
}