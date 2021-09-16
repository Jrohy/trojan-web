<template>
  <section class="app-main">
      <router-view v-slot="{ Component }">
      <transition appear name="fade-transform" mode="out-in">
          <component :is="Component" :key="key" />
      </transition>
    </router-view>
  </section>
</template>

<script>
export default {
    name: 'AppMain',
    computed: {
        key() {
            return this.$route.path
        }
    }
}
</script>

<style lang="scss" scoped>
.app-main {
    transition: margin-left 0.25s;
    position: relative;
    box-sizing: border-box;
    overflow: hidden;
    padding: 60px 20px 5px 20px;
}
</style>
