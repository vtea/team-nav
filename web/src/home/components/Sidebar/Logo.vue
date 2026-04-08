<template>
  <div class="sidebar-logo-container" :class="[sideTheme, { collapse: collapse }]">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img :src="logoPath" class="sidebar-logo" />
        <h1 class="sidebar-title">{{ title }} </h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img :src="logoPath" class="sidebar-logo" />
        <h1 class="sidebar-title">{{ title }} </h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    sideTheme() {
      return this.$store.state.settings.sideTheme
    },
    logoPath(){
      return this.$store.state.settings.logoPath;
    },
    title() {
      return this.$store.state.settings.title;
    }
  },
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";

.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 48px;
  line-height: 48px;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 28px;
      height: 28px;
      vertical-align: middle;
      margin-right: 10px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      font-weight: 600;
      line-height: 48px;
      font-size: 14px;
      letter-spacing: -0.15px;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "PingFang SC", "Helvetica Neue", Helvetica, Arial, sans-serif;
      vertical-align: middle;
    }
  }

  &.theme-dark .sidebar-title {
    color: $base-logo-title-color;
  }

  &.theme-light .sidebar-title {
    color: $base-logo-light-title-color;
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
