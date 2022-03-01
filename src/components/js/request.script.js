import Header from '@/components/Header.vue'
import SideNav from '@/components/SideNav.vue'
import ToastComponent from '@/components/ToastComponent.vue'
import SettingsConstants from '../../assets/constants/settings.constants'
import Constants from '../../assets/constants/app.constants'
import { Modal, Tab } from 'bootstrap'
import { mapState } from 'vuex'
import axios from "axios";
import moment from 'moment'
import Swal from 'sweetalert2'
import store from '../../store'

export default {
    name: 'Request',
    computed: mapState([
        'sessionData',
        'lastSelectedView'
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
            leaveRequestData: [],
            constantsApprovalStatus: [],
            selectedLeaveDetails: []
        }
    },
    components: {
        Header,
        SideNav,
        ToastComponent,
        Constants
    },
    methods: {
        showAddLeaveModal: function () {
            var addLeaveModal = new Modal(document.getElementById('addleaveModal'));
            addLeaveModal.toggle();
        },
        showOTModal: function () {
            var addOTModal = new Modal(document.getElementById('addOTModal'));
            addOTModal.toggle();
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
                    this.addLeaveModal.toggle();
                    Swal.fire(
                        'Success!',
                        'leave request created!',
                        'success'
                    )
                    this.getLeaveRequest();
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
                        switch (leave.approval_status) {
                            case Constants.LEAVE_APPROVAL_STATUS.PENDING:
                                leave.status = 'Pending';
                                break;
                            case Constants.LEAVE_APPROVAL_STATUS.APPROVED:
                                leave.status = 'Approved';
                                break;
                            case Constants.LEAVE_APPROVAL_STATUS.REJECTED:
                                leave.status = 'Rejected';
                                break;
                        }
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
                            switch (leave.approval_status) {
                                case Constants.LEAVE_APPROVAL_STATUS.PENDING:
                                    leave.status = 'Pending';
                                    break;
                                case Constants.LEAVE_APPROVAL_STATUS.APPROVED:
                                    leave.status = 'Approved';
                                    break;
                                case Constants.LEAVE_APPROVAL_STATUS.REJECTED:
                                    leave.status = 'Rejected';
                                    break;
                            }
                        }.bind(this));
                    }
                }.bind(this));
        },
        approveLeave: function (leaveId) {
            Swal.fire({
                title: 'Are you sure?',
                text: "approve this leave request!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#6C757D',
                confirmButtonText: 'Yes, approve it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.get(SettingsConstants.BASE_URL + '/get-leave.rest.php?type=approve&leaveId=' + leaveId, { crossdomain: true })
                        .then(function (response) {
                            if (response.data) {
                                Swal.fire(
                                    'Success!',
                                    'leave request approved!',
                                    'success'
                                )
                                this.getLeaveRequest();
                            } else {
                                Swal.fire(
                                    'Error!',
                                    'error updating leave request!',
                                    'success'
                                )
                            }
                        }.bind(this));
                }
            })
        },
        openRejectLeaveModal: function (leave) {
            this.selectedLeaveDetails = leave;
            var rejectLeaveModal = new Modal(document.getElementById('rejectLeaveModal'));
            rejectLeaveModal.toggle();
        },
        rejectLeave: function (event) {
            event.preventDefault();
            var bodyFormData = new FormData();
            bodyFormData.append('rejectmessage', this.selectedLeaveDetails.approver_comment);
            axios({
                method: "post",
                url: SettingsConstants.BASE_URL + '/get-leave.rest.php?type=reject&leaveId=' + this.selectedLeaveDetails.id,
                data: bodyFormData,
                headers: { "Content-Type": "multipart/form-data" },
            }).then(function (response) {
                if (response.data) {
                    Swal.fire(
                        'Success!',
                        'leave request rejected!',
                        'success'
                    )
                    this.getLeaveRequest();
                } else {
                    Swal.fire(
                        'Error!',
                        'error updating leave request!',
                        'error'
                    )
                    this.getLeaveRequest();
                }
            }.bind(this));
        },
        getLeaveRequest: function () {
            if (this.sessionData.user_level > 1) {
                this.getAllLeaveRequest();
            } else {
                this.getUserLeaveRequest();
            }
        },
        selectTab: function (event) {
            store.commit('SET_LAST_SELECTED_VIEW', event.target.id);
        }
    },
    mounted() {
        this.constantsApprovalStatus = Constants.LEAVE_APPROVAL_STATUS;
        this.getLeaveRequest();

        if (this.lastSelectedView) {
            var someTabTriggerEl = document.querySelector('#' + this.lastSelectedView);
            var tab = new Tab(someTabTriggerEl);
            tab.show();
        }
    },
}