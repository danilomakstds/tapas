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
            calendarOptions: {
                plugins: [dayGridPlugin, interactionPlugin],
                initialView: 'dayGridMonth',
                dateClick: this.handleDateClick,
                events: [],
                eventClick: function () {
                    //alert(info.event.date);
                }
            },
            holidayEvents: [],
            timeInOutEvents: []
        }
    },
    methods: {
        handleDateClick: function (arg) {
            alert('date click! ' + arg.dateStr)
        },
        resetCalender: function () {
            this.calendarOptions.events = [];
        },
        getAllHolidays: function () {
            axios.get(SettingsConstants.BASE_URL + '/get-all-holidays.rest.php', { crossdomain: true })
                .then(function (response) {
                    this.holidayEvents = JSON.parse(response.data[0].JSON).response.holidays
                    this.holidayEvents.forEach(function (event) {
                        if (event.type[0] == Constants.HOLIDAY_TYPE.NATIONAL
                            || event.type[0] == Constants.HOLIDAY_TYPE.OBSERVANCE) {
                            event.title = event.name;
                            event.date = event.date.iso;
                            event.backgroundColor = "#6C757D";
                            event.borderColor = "#6C757D";
                            this.calendarOptions.events.push(event);
                        }
                    }.bind(this));
                    store.commit('SET_FULL_CALENDAR_PROPS', this.calendarOptions);
                }.bind(this));
        },
        getAllTimeInOut: function () {
            axios.get(SettingsConstants.BASE_URL + '/get-time-in-out.rest.php?userId=' + this.sessionData.id, { crossdomain: true })
                .then(function (response) {
                    response.data.forEach(function (e) {
                        var event = [];
                        var start = moment(e.timein);
                        var end = moment(e.timeout);
                        var hours = end.diff(start, 'hours');
                        event.start = start.format();
                        event.end = end.format();
                        if (isNaN(hours)) {
                            event.title = start.format('LT') + " - Time In";
                            event.backgroundColor = "#D1E7DD";
                            event.textColor = "#555";
                        } else {
                            event.title = hours - 1 + "h - Time In - Time Out";
                            event.backgroundColor = "#5CB85C";
                        }
                        event.allDay = true;
                        event.borderColor = "#5CB85C";
                        this.calendarOptions.events.push(event);
                    }.bind(this));
                    store.commit('SET_FULL_CALENDAR_PROPS', this.calendarOptions);
                }.bind(this));
        },
        emitFunctions: function () {
            this.resetCalender();
            this.getAllHolidays();
            this.getAllTimeInOut();
        }
    },
    created() {
        this.emitFunctions();
    },
    mounted() {

    },
}