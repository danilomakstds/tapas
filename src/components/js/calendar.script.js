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

export default {
    name: 'Calendar',
    computed: mapState([
        'fullCalendarProps'
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
            holidayEvents: []
        }
    },
    methods: {
        handleDateClick: function (arg) {
            alert('date click! ' + arg.dateStr)
        },
        getAllHolidays: function () {
            axios.get(SettingsConstants.BASE_URL + '/getallholidays.REST.php', { crossdomain: true })
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
    },
    created() {
        this.getAllHolidays();
    },
    mounted() {

    },
}