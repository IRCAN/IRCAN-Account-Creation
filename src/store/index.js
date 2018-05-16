import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    o: '',
    mail: '',
    sn: '',
    givenName: '',
    uid: ''
  },
  mutations: {
    setO (state, value) {
      state.o = value
    },
    setMail (state, value) {
      state.mail = value
    },
    setSn (state, value) {
      state.sn = value
    },
    setGivenName (state, value) {
      state.givenName = value
    },
    setUid (state, value) {
      state.uid = value
    }
  },
  getters: {
    o: state => state.o,
    mail: state => state.mail,
    sn: state => state.sn,
    givenName: state => state.givenName,
    uid: state => state.uid
  }
})

export default store
