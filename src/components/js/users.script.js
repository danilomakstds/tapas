import "../scss/users.scss";
import Header from '@/components/Header.vue'
import SideNav from '@/components/SideNav.vue'
import ToastComponent from '@/components/ToastComponent.vue'
import SettingsConstants from '../../assets/constants/settings.constants'
import { mapState } from 'vuex'
import axios from "axios";
import { Modal } from 'bootstrap'
//import store from '../store'

export default {
    name: 'Users',
    computed: mapState([
        'sessionData'
    ]),
    components: {
        Header,
        SideNav,
        ToastComponent
    },
    watch: {
    },
    data() {
        return {
            userData: null,
            selectedUser: [],
            editModal: null,
            adduserModal: null,
            newFirstName: null,
            newMiddleName: null,
            newLastName: null,
            newSuffix: null,
            newContactNumber: null,
            newAvatar: "https://t3.ftcdn.net/jpg/00/64/67/52/360_F_64675209_7ve2XQANuzuHjMZXP3aIYIpsDKEbF5dD.jpg",
            newBirthdate: null,
            newAddress: null,
            newEmail: null,
            newIdNumber: null,
            newJobDescription: null,
            newUserType: null,
            newTimeIn: null,
            newTimeOut: null,
            newDateHired: null,
            newSalary: null,
            newVL: null,
            newSL: null,
            newEL: null,
            newML: null,
            newBL: null,
            newSSS: null,
            newPagibig: null,
            newTin: null,
            newPhilhealth: null
        }
    },
    methods: {
        initUsers: function () {
            axios.get(SettingsConstants.BASE_URL + '/get-users.rest.php?type=all', { crossdomain: true })
                .then(function (response) {
                    this.userData = response.data;
                }.bind(this));
        },
        showEditModal: function (user) {
            this.selectedUser = user;
            this.editModal = new Modal(document.getElementById('editUserModal'));
            this.editModal.toggle();
        },
        showAddUserModal: function () {
            this.adduserModal = new Modal(document.getElementById('addUserModal'));
            this.adduserModal.toggle();
        },
        addNewUser: function (event) {
            event.preventDefault();
            var bodyFormData = new FormData();
            console.log(this.newFirstName);
            bodyFormData.append('firstname', this.newFirstName);
            bodyFormData.append('middlename', this.newMiddleName);
            bodyFormData.append('lastname', this.newLastName);
            bodyFormData.append('suffix', this.newSuffix);
            bodyFormData.append('contact_number', this.newContactNumber);
            bodyFormData.append('avatar', this.newAvatar);
            bodyFormData.append('birthday', this.newBirthdate);
            bodyFormData.append('address', this.newAddress);
            bodyFormData.append('email', this.newEmail);
            bodyFormData.append('id_number', this.newIdNumber);
            bodyFormData.append('salary', this.newSalary);
            bodyFormData.append('level', this.newUserType);
            bodyFormData.append('schedule_in', this.newTimeIn);
            bodyFormData.append('schedule_out', this.newTimeOut);
            bodyFormData.append('datehired', this.newDateHired);
            bodyFormData.append('sssnum', this.newSSS);
            bodyFormData.append('pagibignum', this.newPagibig);
            bodyFormData.append('tin', this.newTin);
            bodyFormData.append('philhealthnum', this.newPhilhealth);
            bodyFormData.append('user_vl', this.newVL);
            bodyFormData.append('user_sl', this.newSL);
            bodyFormData.append('user_el', this.newEL);
            bodyFormData.append('user_bl', this.newBL);
            bodyFormData.append('user_ml', this.newML);
            bodyFormData.append('jobdescription', this.newJobDescription);
            axios({
                method: "post",
                url: SettingsConstants.BASE_URL + "/post-user.rest.php?type=adduser",
                data: bodyFormData,
                headers: { "Content-Type": "multipart/form-data" },
            })
                .then(function (response) {
                    if (response) {
                        var toastType = "success";
                        var toastMessage = "User created!";
                        this.initUsers();
                        this.adduserModal.toggle();
                        ToastComponent.methods.show(toastType, toastMessage);
                    }
                }.bind(this))
                .catch(function (response) {
                    console.log(response);
                });
        },
        updateUser: function (event) {
            event.preventDefault();
            var bodyFormData = new FormData();
            bodyFormData.append('firstname', this.selectedUser.user_firstname);
            bodyFormData.append('middlename', this.selectedUser.user_middlename);
            bodyFormData.append('lastname', this.selectedUser.user_lastname);
            bodyFormData.append('suffix', this.selectedUser.user_suffix);
            bodyFormData.append('contact_number', this.selectedUser.user_contact_number);
            bodyFormData.append('avatar', this.selectedUser.user_avatar);
            bodyFormData.append('birthday', this.selectedUser.user_birthday);
            bodyFormData.append('address', this.selectedUser.user_current_address);
            bodyFormData.append('email', this.selectedUser.user_email);
            bodyFormData.append('id_number', this.selectedUser.user_id_number);
            bodyFormData.append('salary', this.selectedUser.user_salary);
            bodyFormData.append('level', this.selectedUser.user_level);
            bodyFormData.append('schedule_in', this.selectedUser.user_schedule_in);
            bodyFormData.append('schedule_out', this.selectedUser.user_schedule_out);
            bodyFormData.append('datehired', this.selectedUser.user_datehired);
            bodyFormData.append('sssnum', this.selectedUser.user_sssnum);
            bodyFormData.append('pagibignum', this.selectedUser.user_pagibignum);
            bodyFormData.append('tin', this.selectedUser.user_tin);
            bodyFormData.append('philhealthnum', this.selectedUser.user_philhealthnum);
            bodyFormData.append('user_vl', this.selectedUser.user_vl);
            bodyFormData.append('user_sl', this.selectedUser.user_sl);
            bodyFormData.append('user_el', this.selectedUser.user_el);
            bodyFormData.append('user_bl', this.selectedUser.user_bl);
            bodyFormData.append('user_ml', this.selectedUser.user_ml);
            bodyFormData.append('jobdescription', this.selectedUser.user_jobdescription);
            axios({
                method: "post",
                url: SettingsConstants.BASE_URL + "/post-user.rest.php?type=updateuser&userId=" + this.selectedUser.id,
                data: bodyFormData,
                headers: { "Content-Type": "multipart/form-data" },
            })
                .then(function (response) {
                    if (response) {
                        var toastType = "success";
                        var toastMessage = "user information updated!";
                        this.initUsers();
                        this.editModal.toggle();
                        ToastComponent.methods.show(toastType, toastMessage);
                    }
                }.bind(this))
                .catch(function (response) {
                    console.log(response);
                });
        }
    },
    mounted() {
        this.initUsers();
    },

}