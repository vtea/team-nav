<template>
  <div class="nav-app-shell__top-bar">
    <hamburger id="hamburger-container"
               :is-active="sidebar.opened"
               class="hamburger-container" @toggleClick="toggleSideBar"/>
    <carousel-flip-notice class="carousel-flip-notice"></carousel-flip-notice>
    <div v-if="device !== 'mobile'" class="right-menu">
      <screenfull class="right-menu-item hover-effect"/>
      <doc v-if="showDoc" class="right-menu-item hover-effect"/>
      <!-- 登录与用户菜单在侧栏底部 -->
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  components: {
    'hamburger': () => import('@/components/Hamburger'),
    'screenfull': () => import('@/home/components/Screenfull'),
    'doc': () => import('@/home/components/doc'),
    'carousel-flip-notice': () => import('@/home/components/carousel-flip-notice'),
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'device',
      'showDoc'
    ]),
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";

/** 顶栏：浅色工具站风格（与侧栏浅灰、主区大搜索配套） */
.nav-app-shell__top-bar {
  display: flex;
  align-items: center;
  height: 48px;
  overflow: hidden;
  position: relative;
  /** 与主区画布同色相，避免顶栏一条「冷白」与灰底对撞 */
  background-color: rgba(245, 245, 247, 0.96);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.03);

  @supports ((-webkit-backdrop-filter: blur(1px)) or (backdrop-filter: blur(1px))) {
    background-color: rgba(245, 245, 247, 0.88);
    -webkit-backdrop-filter: saturate(180%) blur(18px);
    backdrop-filter: saturate(180%) blur(18px);
  }

  .hamburger-container {
    line-height: 48px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.2s;
    -webkit-tap-highlight-color: transparent;
    color: rgba(0, 0, 0, 0.65);

    &:hover {
      background: rgba(0, 0, 0, 0.04);
    }
  }

  .carousel-flip-notice {
    flex: auto;
    margin: 0 16px;
    min-height: 48px;
    /** 字号由 carousel-flip-notice 内组件控制，避免顶栏 13px 把公告压得过小 */
    color: rgba(0, 0, 0, 0.75);
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 48px;
    padding-right: 8px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 17px;
      color: rgba(0, 0, 0, 0.55);
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.2s;
        border-radius: 8px;

        &:hover {
          background: rgba(0, 0, 0, 0.05);
          color: rgba(0, 0, 0, 0.75);
        }
      }
    }

  }
}
</style>
