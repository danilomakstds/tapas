import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

export default createStore({
  state: {
    fullCalendarProps: {},
    isUserTimeIn: null,
    userTimeIn: null,
    sessionData: null,
    lastSelectedView: null
  },
  mutations: {
    SET_FULL_CALENDAR_PROPS: function (state, fullCalendarProps) {
      state.fullCalendarProps = fullCalendarProps;
    },
    RESET_FULL_CALENDAR_PROPS: function (state) {
      state.fullCalendarProps = null;
    },
    SET_IS_USER_TIME_IN: function (state, isUserTimeIn) {
      state.isUserTimeIn = isUserTimeIn;
    },
    RESET_IS_USER_TIME_IN: function (state) {
      state.isUserTimeIn = false;
    },
    SET_USER_TIME_IN: function (state, userTimeIn) {
      state.userTimeIn = userTimeIn;
    },
    RESET_USER_TIME_IN: function (state) {
      state.userTimeIn = false;
    },
    SET_SESSION_DATA: function (state, sessionData) {
      state.sessionData = sessionData;
    },
    RESET_SESSION_DATA: function (state) {
      state.sessionData = null;
    },
    SET_LAST_SELECTED_VIEW: function (state, lastSelectedView) {
      state.lastSelectedView = lastSelectedView;
    },
    RESET_LAST_SELECTED_VIEW: function (state) {
      state.lastSelectedView = null;
    },
  },
  getters: {

  },
  methods: {

  },
  actions: {

  },
  modules: {

  },
  plugins: [createPersistedState()],
})
