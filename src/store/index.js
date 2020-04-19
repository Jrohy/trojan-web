import Vuex from 'vuex'

import state from './state'
import getters from './getters'
import modules from './modules'
import actions from './actions'
import mutations from './mutations'

export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
    modules
})
