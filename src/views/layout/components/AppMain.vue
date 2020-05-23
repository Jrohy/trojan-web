<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
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
    padding: 60px 20px 5px 20px;
}
</style>
