<template>
    <div :class="{navCollapsed:isSidebarNavCollapse}">
        <div v-if="!isSidebarNavCollapse" class="drawer-bg" @click="handleClickOutside"></div>
        <sidebarNav  class="sidebar"/>
        <mainContent/>
    </div>
</template>

<script>
import sidebarNav from './component/sidebar-nav'
import mainContent from './component/main-content/index'
import { mapState } from 'vuex'
export default {
    data() {
        return {}
    },
    computed: {
        ...mapState(['isSidebarNavCollapse'])
    },
    components: {
        sidebarNav,
        mainContent
    },
    methods: {
        handleClickOutside() {
            this.$store.commit('toggleNavCollapse')
        }
    }
}
</script>

<style lang="scss" scoped>
@media screen and (max-width: 600px){
    .drawer-bg {
        background: #000;
        opacity: 0.3;
        width: 100%;
        top: 0;
        height: 100%;
        position: absolute;
        z-index: 9999;
    }
}
</style>
