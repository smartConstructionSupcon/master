import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  qiNiuLink: 'http://image.supconit.net',

}

const mutations = {
    setqiNiuLink(state, value) {
      state.qiNiuLink = value;
    },

}
  const getters={
    // getcreatorderTime:state => state.creatOrderTime
}

export default new Vuex.Store({
  state,
  mutations,
  getters
});
