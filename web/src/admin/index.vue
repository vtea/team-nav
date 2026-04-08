<template>
  <div :class="classObj" class="nav-app-shell nav-app-shell--admin">
    <sidebar v-if="!sidebar.hide" class="nav-sidebar"/>
    <div :class="{'nav-app-shell__main--sidebar-hidden': sidebar.hide}" class="nav-app-shell__main">
      <div class="nav-app-shell__header">
        <navbar/>
      </div>
      <app-main/>
    </div>
  </div>
</template>

<script>
import { AppMain, Navbar, Sidebar } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    Sidebar,
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sideTheme: state => state.settings.sideTheme,
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
    }),
    classObj() {
      return {
        'nav-app-shell--sidebar-collapsed': !this.sidebar.opened,
        'nav-app-shell--sidebar-expanded': this.sidebar.opened,
        'nav-app-shell--no-animation': this.sidebar.withoutAnimation,
        'nav-app-shell--mobile': this.device === 'mobile'
      }
    },
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/assets/styles/mixin.scss";
  @import "~@/assets/styles/variables.scss";

  .nav-app-shell {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.nav-app-shell--mobile.nav-app-shell--sidebar-expanded {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .nav-app-shell__header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$base-sidebar-width});
    transition: width 0.28s;
  }

  .nav-app-shell--sidebar-collapsed .nav-app-shell__header {
    width: calc(100% - 54px);
  }

  .nav-app-shell__main--sidebar-hidden .nav-app-shell__header {
    width: 100%;
  }

  .nav-app-shell--mobile .nav-app-shell__header {
    width: 100%;
  }
</style>
