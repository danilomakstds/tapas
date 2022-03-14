import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import { library } from "@fortawesome/fontawesome-svg-core";
import {
    faPhone, faCartShopping, faCheck, faCartArrowDown, faBars,
    faGear, faAngleDown, faBell, faUser, faArrowRightFromBracket,
    faWallet, faBusinessTime, faHourglassStart, faCalendar, faPlus,
    faChartLine, faFileInvoiceDollar, faMoneyCheckDollar, faCalendarMinus,
    faCalendarXmark, faClockFour, faMugHot, faGift, faUserGroup, faUserGear,
    faCakeCandles, faHourglassEnd, faUserPen, faPen, faBan, faTrashCan, faComment,
    faEye, faPrint
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(faPhone, faCartShopping, faCheck, faCartArrowDown, faBars,
    faGear, faAngleDown, faBell, faUser, faArrowRightFromBracket,
    faWallet, faBusinessTime, faHourglassStart, faCalendar, faPlus,
    faChartLine, faFileInvoiceDollar, faMoneyCheckDollar, faCalendarMinus,
    faCalendarXmark, faClockFour, faMugHot, faGift, faUserGroup, faUserGear,
    faCakeCandles, faHourglassEnd, faUserPen, faPen, faBan, faTrashCan, faComment,
    faEye, faPrint);

createApp(App).use(store).use(router).component("font-awesome-icon", FontAwesomeIcon).mount('#app')
