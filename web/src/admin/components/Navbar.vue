<template>
  <div class="nav-app-shell__top-bar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container"
               @toggleClick="toggleSideBar"/>

    <div class="right-menu" v-if="version.currentVersion">
      <div class="right-menu-item hover-effect btn-apply" @click="$router.push({path: '/admin/card/apply'})">
        <el-badge :hidden="applyCount === 0" :value="applyCount" :max="99">
          <i class="el-icon-message-solid" title="申请列表"></i>
        </el-badge>
      </div>
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <header-avatar></header-avatar>
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <a href="https://github.com/tuituidan/team-nav" target="_blank">
            <el-badge is-dot :hidden="!version.hasNewVersion"
                      :title="'最新版本：'+version.remoteVersion">
              <el-dropdown-item>版本：{{ version.currentVersion }}</el-dropdown-item>
            </el-badge>
          </a>
          <a target="_blank" href="https://github.com/tuituidan/team-nav/issues">
            <el-dropdown-item>问题反馈</el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  components: {
    Hamburger: () => import('@/components/Hamburger'),
    'header-avatar': () => import('@/components/header-avatar'),
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'version',
      'applyCount',
    ]),
  },
  mounted() {
    this.$store.dispatch('settings/loadVersion');
    this.$store.dispatch('user/refreshApplyCount');
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      this.$confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('user/LogOut').then(() => {
          this.$store.dispatch('settings/loadVersion');
        })
      }).catch(() => {
      });
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";

/** 后台顶栏：与首页同一浅灰画布 + 发丝线，避免黑顶栏与前台割裂 */
.nav-app-shell__top-bar {
  height: $navbar-height;
  overflow: hidden;
  position: relative;
  background-color: rgba(245, 245, 247, 0.96);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.03);

  @supports ((-webkit-backdrop-filter: blur(1px)) or (backdrop-filter: blur(1px))) {
    background-color: rgba(245, 245, 247, 0.88);
    -webkit-backdrop-filter: saturate(180%) blur(18px);
    backdrop-filter: saturate(180%) blur(18px);
  }

  .hamburger-container {
    line-height: $navbar-height;
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

  .right-menu {
    float: right;
    height: 100%;
    line-height: $navbar-height;

    &:focus {
      outline: none;
    }

    .btn-apply {
      margin-right: 10px;
      padding: 0 12px !important;

      ::v-deep .el-badge__content {
        top: 7px;
      }
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
        }
      }
    }

    .avatar-container {
      margin-right: 24px;

      .avatar-wrapper {
        position: relative;
        color: rgba(0, 0, 0, 0.55);

        .user-avatar {
          cursor: pointer;
          width: 36px;
          height: 36px;
          border-radius: 8px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -18px;
          top: 22px;
          font-size: 12px;
          color: rgba(0, 0, 0, 0.4);
        }
      }
    }
  }
}
</style>
