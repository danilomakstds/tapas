<template>
    <div class="toast align-items-center text-white border-0" role="alert" aria-live="assertive" aria-atomic="true" id="myToastEl">
        <div class="d-flex">
            <div class="toast-body">
            <strong id="title"></strong> <span id="message"></span>
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    </div>
</template>

<script>
import { Toast } from 'bootstrap'

export default {
    data() {
        return {
            titleMessage: null
        }
    },
    methods: {
        show: function (type, message) {
            switch (type) {
                case 'danger':
                    this.titleMessage = 'Error! ';
                break;
                case'warning':
                    this.titleMessage = 'Warning!, ';
                break;
                case 'primary':
                    this.titleMessage = '';
                break;
                case 'info':
                    this.titleMessage = 'Info, ';
                break;
                case 'success':
                    this.titleMessage = 'Success, ';
                break;
            }
            window.$('#title').text(this.titleMessage);
            window.$('#message').text(message);
            window.$('#myToastEl').addClass('bg-'+type);
            var newToast = new Toast(document.getElementById('myToastEl'));
            newToast.show();
        }
    },
    mounted() {
        
    }
}
</script>

<style scoped>
    #myToastEl {
        position: absolute;
        top: 10px !important;
        right: 30px !important;
        left: auto !important;
        padding: 7px;
        color: #fff !important;
    }

    .bg-success {
        background-color: #4CB050 !important;
    }

    .bg-warning {
        background-color: #FF9700 !important;
    }

    .bg-danger {
        background-color: #E51C24 !important;
    }

    .bg-info {
        background-color: #9C28B1 !important;
    }
</style>