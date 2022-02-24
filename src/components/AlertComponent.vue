<template>
    <div class="alert fade show mb-4 text-start" role="alert" :class="type">
         <strong>{{this.titleMessage}}</strong> {{message}}
    </div>
</template>

<script>
export default {
    props: {
        message: String,
        type: String,
        delay: Number
    },
    data() {
        return {
            titleMessage: null
        }
    },
    mounted() {
        switch (this.type) {
            case 'alert-danger': this.titleMessage = 'Error! ';
            break;
            case 'alert-warning': this.titleMessage = 'Warning!, ';
            break;
            case 'alert-primary': this.titleMessage = '';
            break;
            case 'alert-info': this.titleMessage = 'Info, ';
            break;
            case 'alert-success': this.titleMessage = 'Success, ';
            break;
        }
        //window.$('.alert').delay(this.delay).hide(0);
    }
}
</script>