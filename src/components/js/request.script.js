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
            timeinoutRequestData: [],
            constantsApprovalStatus: [],
            selectedLeaveDetails: [],
            selectedTimeEditDetails: [],
            editLeave: [],
            addLeaveModal: null,
            editLeaveModal: null,
            addOTModal: null
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
            this.addLeaveModal = new Modal(document.getElementById('addleaveModal'));
            this.addLeaveModal.toggle();
        },
        showOTModal: function () {
            this.addOTModal = new Modal(document.getElementById('addOTModal'));
            this.addOTModal.toggle();
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
            }).then(function (request) {
                if (request.data) {
                    this.addLeaveModal.toggle();
                    Swal.fire(
                        'Success!',
                        'leave request created!',
                        'success'
                    )
                    this.getAllRequest();
                }
            }.bind(this))
                .catch(function (response) {
                    console.log(response);
                });
        },
        showEditLeaveModal: function (leave) {
            this.editLeave = leave;
            var date = new Date('December 23, 2022');
            this.editLeave.editDate = moment(date).format('YYYY-MM-DD');
            this.editLeaveModal = new Modal(document.getElementById('editleaveModal'));
            this.editLeaveModal.toggle();
        },
        editLeaveRequest: function (event) {
            event.preventDefault();
            var enddate, startdate;
            var bodyFormData = new FormData();
            if (this.sessionData.user_schedule_in.split(':')[0] > this.sessionData.user_schedule_out.split(':')[0]) {
                enddate = new Date(this.editLeave.date + " " + this.sessionData.user_schedule_in + ":00");
                enddate.setDate(enddate.getDate() + 1);
            } else {
                enddate = new Date(this.editLeave.date + " " + this.sessionData.user_schedule_out + ":00");
            }
            startdate = new Date(this.editLeave + " " + this.sessionData.user_schedule_in + ":00");
            bodyFormData.append('leavetype', this.editLeave.leave_type);
            bodyFormData.append('leavedatestart', startdate);
            bodyFormData.append('leavedateend', enddate);
            bodyFormData.append('leavehours', this.editLeave.totalhours);
            bodyFormData.append('leavecomments', this.editLeave.comment);
            axios({
                method: "post",
                url: SettingsConstants.BASE_URL + "/post-leave.rest.php?type=edit&leaveId=" + this.editLeave.id,
                data: bodyFormData,
                headers: { "Content-Type": "multipart/form-data" },
            }).then(function (request) {
                if (request.data) {
                    this.editLeaveModal.toggle();
                    Swal.fire(
                        'Success!',
                        'leave request created!',
                        'success'
                    )
                    this.getAllRequest();
                }
            }.bind(this))
                .catch(function (response) {
                    console.log(response);
                });
        },
        getAllLeaveRequest: function () {
            axios.get(SettingsConstants.BASE_URL + '/leave.rest.php?type=all', { crossdomain: true })
                .then(function (response) {
                    if (response.data) {
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
                            switch (leave.leave_type) {
                                case '1':
                                    leave.leavetype = 'Sick Leave';
                                    break;
                                case '2':
                                    leave.leavetype = 'Vacation Leave';
                                    break;
                                case '3':
                                    leave.leavetype = 'Emergency Leave';
                                    break;
                                case '4':
                                    leave.leavetype = 'Maternity Leave';
                                    break;
                                case '5':
                                    leave.leavetype = 'Birthday Leave';
                                    break;
                            }
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
                    } else {
                        this.leaveRequestData = [];
                    }
                }.bind(this));
        },
        getUserLeaveRequest: function () {
            axios.get(SettingsConstants.BASE_URL + '/leave.rest.php?type=user&userId=' + this.sessionData.id, { crossdomain: true })
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
                    } else {
                        this.leaveRequestData = [];
                    }
                }.bind(this));
        },
        getAllTimeEditRequest: function () {
            axios.get(SettingsConstants.BASE_URL + '/get-time-in-out.rest.php?type=gettimeedit', { crossdomain: true })
                .then(function (response) {
                    if (response.data) {
                        this.timeinoutRequestData = response.data;
                        this.timeinoutRequestData.forEach(function (timeEdit) {
                            axios.get(SettingsConstants.BASE_URL + '/get-users.rest.php?type=user&userId=' + timeEdit.userId, { crossdomain: true })
                                .then(function (response) {
                                    var userdata = response.data[0];
                                    var name = userdata.user_firstname + ' ' + userdata.user_middlename + ' ' + userdata.user_lastname;
                                    timeEdit.avatar = userdata.user_avatar;
                                    timeEdit.username = name;
                                }.bind(timeEdit));
                            axios.get(SettingsConstants.BASE_URL + '/get-time-in-out.rest.php?type=gettimeinout_byid&timeId=' + timeEdit.timein_id, { crossdomain: true })
                                .then(function (response) {
                                    var timedata = response.data[0];
                                    var reg = /\s\d\d:\d\d:\d\d\s/;
                                    timeEdit.oldTimeIn = timedata.timein;
                                    timeEdit.oldTimeOut = timedata.timeout;
                                    timeEdit.newTimeIn = timeEdit.oldTimeIn.replace(reg, " " + timeEdit.new_timein + ":00 ");
                                    timeEdit.newTimeOut = timeEdit.oldTimeOut.replace(reg, " " + timeEdit.new_timeout + ":00 ");
                                    timeEdit.getDate = moment(timeEdit.oldTimeIn).format('LL');
                                    timeEdit.otimeinFormat = moment(timeEdit.oldTimeIn).format('HH:mm');
                                    timeEdit.otimeoutFormat = moment(timeEdit.oldTimeOut).format('HH:mm');
                                    // timeEdit.ntimeinFormat = timeEdit.new_timein;
                                    // timeEdit.ntimeoutFormat = timeEdit.new_timeout;
                                }.bind(timeEdit));
                            console.log(timeEdit);
                        });
                    } else {
                        this.timeinoutRequestData = [];
                    }
                }.bind(this));
        },
        getUserTimeEditRequest: function () {

        },
        deleteLeaveRequest: function (leaveId) {
            Swal.fire({
                title: 'Delete leave request?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.get(SettingsConstants.BASE_URL + '/leave.rest.php?type=delete&leaveId=' + leaveId, { crossdomain: true })
                        .then(function (response) {
                            if (response.data) {
                                Swal.fire(
                                    'Deleted!',
                                    'Your leave request has been deleted.',
                                    'success'
                                )
                                this.getAllRequest();
                            } else {
                                Swal.fire(
                                    'Error!',
                                    'error deleting leave request!',
                                    'error'
                                )
                            }
                        }.bind(this));

                }
            })
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
                    axios.get(SettingsConstants.BASE_URL + '/leave.rest.php?type=approve&leaveId=' + leaveId, { crossdomain: true })
                        .then(function (response) {
                            if (response.data) {
                                Swal.fire(
                                    'Success!',
                                    'leave request approved!',
                                    'success'
                                )
                                this.getAllRequest();
                            } else {
                                Swal.fire(
                                    'Error!',
                                    'error updating leave request!',
                                    'error'
                                )
                            }
                        }.bind(this));
                }
            })
        },
        approveTimeEdit: function (timedata) {
            Swal.fire({
                title: 'Are you sure?',
                text: "approve this time edit request!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#6C757D',
                confirmButtonText: 'Yes, approve it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    var bodyFormData = new FormData();
                    bodyFormData.append('timein', timedata.newTimeIn);
                    bodyFormData.append('timeout', timedata.newTimeOut);
                    axios({
                        method: "post",
                        url: SettingsConstants.BASE_URL + "/post-time-in-out.rest.php?type=approved-edit-time-inout&id=" + timedata.timein_id,
                        data: bodyFormData,
                        headers: { "Content-Type": "multipart/form-data" },
                    })
                        .then(function (response) {
                            if (response.data) {
                                axios.get(SettingsConstants.BASE_URL + '/get-time-in-out.rest.php?type=approvetimeedit&timeEditId=' + timedata.id, { crossdomain: true })
                                    .then(function (response) {
                                        if (response.data) {
                                            Swal.fire(
                                                'Success!',
                                                'time edit request approved!',
                                                'success'
                                            )
                                            this.getAllRequest();
                                        } else {
                                            Swal.fire(
                                                'Error!',
                                                'error updating leave request!',
                                                'error'
                                            )
                                        }
                                    }.bind(this));
                            }
                        }.bind(this))
                        .catch(function (response) {
                            console.log(response);
                        });
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
                url: SettingsConstants.BASE_URL + '/leave.rest.php?type=reject&leaveId=' + this.selectedLeaveDetails.id,
                data: bodyFormData,
                headers: { "Content-Type": "multipart/form-data" },
            }).then(function (response) {
                if (response.data) {
                    Swal.fire(
                        'Success!',
                        'leave request rejected!',
                        'success'
                    )
                    this.getAllRequest();
                } else {
                    Swal.fire(
                        'Error!',
                        'error updating leave request!',
                        'error'
                    )
                    this.getAllRequest();
                }
            }.bind(this));
        },
        getAllRequest: function () {
            if (this.sessionData.user_level > 1) {
                this.getAllLeaveRequest();
                this.getAllTimeEditRequest();
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
        this.getAllRequest();

        if (this.lastSelectedView) {
            var someTabTriggerEl = document.querySelector('#' + this.lastSelectedView);
            var tab = new Tab(someTabTriggerEl);
            tab.show();
        }
    },
}