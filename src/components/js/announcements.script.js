
import "../scss/announcements.scss"

export default {
    name: 'Announcements',
    props: {
        msg: String
    },
    components: {

    },
    data() {
        return {
        }
    },
    methods: {
        initAnnouncements: function () {

        }
    },
    mounted() {
        this.initAnnouncements();
        // var count = 0;
        // var wordsArray = ["Beta", "Gamma", "Delta", "Alpha"];
        // setInterval(function () {
        //     count++;
        //     window.$('#word').fadeOut(400, function () {
        //         window.$(this).text(wordsArray[count % wordsArray.length]).fadeIn(400);
        //     });
        // }, 2000);
    },
}



