<template>
  <section class="nav-admin-main">
    <transition name="fade-transform" mode="out-in">
      <router-view v-if="!$route.meta.link" :key="key" />
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
@import "~@/assets/styles/variables.scss";

.nav-admin-main {
  height: 100vh;
  width: 100%;
  position: relative;
  overflow: auto;
  box-sizing: border-box;
  background-color: $apple-bg-page;
  padding: $navbar-height 24px 32px;
}
</style>
