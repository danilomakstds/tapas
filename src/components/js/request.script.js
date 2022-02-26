import Header from '@/components/Header.vue'
import SideNav from '@/components/SideNav.vue'
import ToastComponent from '@/components/ToastComponent.vue'
import SettingsConstants from '../../assets/constants/settings.constants'
import { Tab, Modal } from 'bootstrap'
import { mapState } from 'vuex'
import axios from "axios";
import moment from 'moment'

export default {
    name: 'Request',
    computed: mapState([
        'sessionData'
    ]),
    watch: {
    },
    data() {
        return {
            leaveKey: null,
            isFullDay: true,
            leaveHours: 8,
            leaveReqDate: null,
            leaveComments: null,
            leaveRequestData: []
        }
    },
    components: {
        Header,
        SideNav,
        ToastComponent
    },
    methods: {
        showAddLeaveModal: function () {
            this.addLeaveModal = new Modal(document.getElementById('addleaveModal'));
            this.addLeaveModal.toggle();
        },
        showOTModal: function () {
            this.addLeaveModal = new Modal(document.getElementById('addOTModal'));
            this.addLeaveModal.toggle();
        },
        addLeaveRequest: function (event) {
            event.preventDefault();
            var enddate, startdate;
            var bodyFormData = new FormData();
            if (this.sessionData.user_schedule_in.split(':')[0] > this.sessionData.user_schedule_out.split(':')[0]) {
                enddate = new Date(this.leaveReqDate + " " + this.sessionData.user_schedule_in + ":00");
                enddate.setDate(enddate.getDate() + 1);
            } else {
                enddate = new Date(this.leaveReqDate + " " + this.sessionData.user_schedule_out + ":00");
            }
            startdate = new Date(this.leaveReqDate + " " + this.sessionData.user_schedule_in + ":00");
            bodyFormData.append('leavetype', this.leaveKey);
            bodyFormData.append('leavedatestart', startdate);
            bodyFormData.append('leavedateend', enddate);
            bodyFormData.append('leavehours', this.leaveHours);
            bodyFormData.append('leavecomments', this.leaveComments);
            axios({
                method: "post",
                url: SettingsConstants.BASE_URL + "/post-leave.rest.php?type=add&userId=" + this.sessionData.id,
                data: bodyFormData,
                headers: { "Content-Type": "multipart/form-data" },
            }).then(function (response) {
                if (response) {
                    var toastType = "success";
                    var toastMessage = "leave request created";
                    this.addLeaveModal.toggle();
                    ToastComponent.methods.show(toastType, toastMessage);
                    this.getUserLeaveRequest();
                }
            }.bind(this))
                .catch(function (response) {
                    console.log(response);
                });
        },
        getAllLeaveRequest: function () {
            axios.get(SettingsConstants.BASE_URL + '/get-leave.rest.php?type=all', { crossdomain: true })
                .then(function (response) {
                    this.leaveRequestData = response.data;
                    this.leaveRequestData.forEach(function (leave) {
                        axios.get(SettingsConstants.BASE_URL + '/get-users.rest.php?type=user&userId=' + leave.userId, { crossdomain: true })
                            .then(function (response) {
                                var userdata = response.data[0];
                                var name = userdata.user_firstname + ' ' + userdata.user_middlename + ' ' + userdata.user_lastname;
                                leave.avatar = userdata.user_avatar;
                                leave.username = name;
                            }.bind(leave));
                        leave.date = moment(leave.timestart).format('LL');
                        leave.leavetype = (leave.leave_type == 2) ? 'Vacation Leave' : 'Sick Leave';
                        leave.timestart = moment(leave.timestart).format('LT');
                        leave.timeend = moment(leave.timeend).format('LT');
                    }.bind(this));
                }.bind(this));
        },
        getUserLeaveRequest: function () {
            axios.get(SettingsConstants.BASE_URL + '/get-leave.rest.php?type=user&userId=' + this.sessionData.id, { crossdomain: true })
                .then(function (response) {
                    if (response.data) {
                        this.leaveRequestData = response.data;
                        this.leaveRequestData.forEach(function (leave) {
                            leave.date = moment(leave.timestart).format('LL');
                            leave.leavetype = (leave.leave_type == 2) ? 'Vacation Leave' : 'Sick Leave';
                            leave.timestart = moment(leave.timestart).format('LT');
                            leave.timeend = moment(leave.timeend).format('LT');
                        }.bind(this));
                    }
                }.bind(this));
        }
    },
    mounted() {
        if (this.sessionData.user_level > 1) {
            this.getAllLeaveRequest();
        } else {
            this.getUserLeaveRequest();
        }

        var someTabTriggerEl = document.querySelector('#myTab li:last-child button');
        var tab = new Tab(someTabTriggerEl);
        tab.show();

    },
}