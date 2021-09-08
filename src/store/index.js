import { createStore } from 'vuex'

import state from './state'
import getters from './getters'
import modules from './modules'
import actions from './actions'
import mutations from './mutations'

export default createStore({
    state,
    getters,
    mutations,
    actions,
    modules
})
