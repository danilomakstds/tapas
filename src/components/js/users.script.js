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
            editModal: null
        }
    },
    methods: {
        initUsers: function () {
            axios.get(SettingsConstants.BASE_URL + '/get-users.rest.php', { crossdomain: true })
                .then(function (response) {
                    this.userData = response.data;
                }.bind(this));
        },
        showEditModal: function (user) {
            this.selectedUser = user;
            this.editModal = new Modal(document.getElementById('editUserModal'));
            this.editModal.toggle();
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