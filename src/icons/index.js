// import Vue from 'vue'
// import SvgIcon from '@/components/SvgIcon'// svg组件

// // register globally
// Vue.component('svg-icon', SvgIcon)

const Mixins = import.meta.globEager("./svg/*.svg")
export default {
    mixins: Object.values(Mixins).map((v) => v.default)
}
