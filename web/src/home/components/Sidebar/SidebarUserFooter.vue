<template>
  <div
    class="sidebar-user-footer"
    :class="{
      'sidebar-user-footer--collapsed': isCollapse,
      'sidebar-user-footer--dark': isDark
    }"
  >
    <!-- 未登录：整块可点，与工具站侧栏底栏一致 -->
    <div
      v-if="!loginUser.id"
      class="sidebar-user-footer__block sidebar-user-footer__guest"
      :title="guestTitle"
      @click="openLoginDialog"
    >
      <div class="sidebar-user-footer__avatar-wrap">
        <span class="sidebar-user-footer__placeholder">
          <i class="el-icon-user-solid"/>
        </span>
      </div>
      <div v-show="!isCollapse" class="sidebar-user-footer__meta">
        <span class="sidebar-user-footer__label">未登录</span>
        <span class="sidebar-user-footer__hint">点击登录</span>
      </div>
    </div>

    <!-- 已登录：下拉菜单（原顶栏入口迁移至此） -->
    <el-dropdown
      v-else
      class="sidebar-user-footer__dropdown"
      trigger="click"
      placement="right-start"
      @command="onDropdownCommand"
    >
      <div class="sidebar-user-footer__block sidebar-user-footer__user" :title="loginUser.nickname">
        <div class="sidebar-user-footer__avatar-wrap">
          <header-avatar class="sidebar-user-footer__header-avatar"/>
        </div>
        <div v-show="!isCollapse" class="sidebar-user-footer__meta">
          <span class="sidebar-user-footer__label text-ellipsis">{{ displayName }}</span>
          <span class="sidebar-user-footer__hint text-ellipsis">{{ loginUser.username }}</span>
        </div>
        <i v-show="!isCollapse" class="el-icon-arrow-right sidebar-user-footer__caret"/>
      </div>
      <el-dropdown-menu slot="dropdown">
        <router-link v-if="loginUser.isAdmin" to="/admin/category">
          <el-dropdown-item>后台管理</el-dropdown-item>
        </router-link>
        <el-dropdown-item command="settings">布局设置</el-dropdown-item>
        <el-dropdown-item command="password">修改密码</el-dropdown-item>
        <el-dropdown-item v-if="!loginUser.isAdmin">
          <card-apply>卡片申请</card-apply>
        </el-dropdown-item>
        <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <change-password ref="changePassword"/>
  </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex'
import {openLoginDialog as mountLoginDialog} from '@/utils/open-login-dialog'

/**
 * 首页侧栏底部用户区：未登录态展示「未登录」并打开登录；已登录态展示头像与菜单。
 * 布局对齐工具目录类站点（底栏固定，不占用顶栏）。
 */
export default {
  name: 'SidebarUserFooter',
  components: {
    'header-avatar': () => import('@/components/header-avatar'),
    'change-password': () => import('@/home/components/change-password'),
    'card-apply': () => import('@/home/components/card-apply'),
  },
  computed: {
    ...mapGetters(['sidebar', 'loginUser']),
    ...mapState(['settings']),
    isCollapse() {
      return !this.sidebar.opened
    },
    isDark() {
      return this.settings.sideTheme === 'theme-dark'
    },
    displayName() {
      return this.loginUser.nickname || this.loginUser.username || '用户'
    },
    guestTitle() {
      return this.isCollapse ? '未登录，点击登录' : ''
    },
  },
  methods: {
    openLoginDialog() {
      mountLoginDialog()
    },
    onDropdownCommand(cmd) {
      if (cmd === 'settings') {
        this.$store.dispatch('settings/changeSetting', {key: 'showSettings', value: true})
      } else if (cmd === 'password') {
        this.$refs.changePassword.open()
      } else if (cmd === 'logout') {
        this.logout()
      }
    },
    async logout() {
      try {
        await this.$confirm('确定要退出登录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await this.$store.dispatch('user/LogOut')
        await this.$store.dispatch('settings/loadVersion')
      } catch (e) {
        /* 用户取消 */
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";

.sidebar-user-footer {
  flex-shrink: 0;
  min-width: 0;
  width: 100%;
  max-width: 100%;
  min-height: 56px;
  overflow: hidden;
  /** 左右 8px 与 theme-light 菜单 margin 对齐；底栏略加厚，避免头像贴住侧栏下沿圆角 */
  padding: 10px 8px 14px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  box-sizing: border-box;
  font-size: 13px;
  position: relative;
  z-index: 2;

  &--dark {
    border-top-color: rgba(255, 255, 255, 0.08);
  }

  &--collapsed {
    padding: 10px 6px 14px;

    .sidebar-user-footer__block {
      justify-content: center;
      padding-left: 4px;
      padding-right: 4px;
    }

    /** 展开时给箭头留的 padding-right 收起时必须去掉，否则头像会偏左 */
    .sidebar-user-footer__user {
      padding-left: 0 !important;
      padding-right: 0 !important;
    }

    .sidebar-user-footer__caret {
      display: none !important;
    }
  }

  &__block {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    min-height: 36px;
    cursor: pointer;
    border-radius: 10px;
    padding: 6px 8px;
    margin: 0;
    box-sizing: border-box;
    transition: background 0.15s ease;

    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }
  }

  /**
   * 侧栏展开时：与上方菜单图标左缘对齐。
   * - theme-light：`el-menu-item` 有左右 8px margin，与 Element 默认左内边距合计约 28px。
   * - theme-dark：无额外 margin，与图标左缘约 20px。
   */
  &:not(.sidebar-user-footer--collapsed) .sidebar-user-footer__block {
    padding-left: 20px;
  }

  &--dark:not(.sidebar-user-footer--collapsed) .sidebar-user-footer__block {
    padding-left: 12px;
  }

  &--dark &__block:hover {
    background: rgba(255, 255, 255, 0.08);
  }

  &__guest {
    user-select: none;
  }

  &__user {
    position: relative;
    box-sizing: border-box;
    /** 为右侧箭头留空；收起侧栏时在 &--collapsed 中由 .sidebar-user-footer__block 覆盖左右 padding */
    padding-right: 20px;
  }

  &__avatar-wrap {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: 50%;
  }

  &__placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.08);
    color: rgba(0, 0, 0, 0.35);
    font-size: 18px;
  }

  &--dark &__placeholder {
    background: rgba(255, 255, 255, 0.12);
    color: rgba(255, 255, 255, 0.45);
  }

  &__header-avatar {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    overflow: hidden;
    border-radius: 50%;
  }

  &__header-avatar ::v-deep .ivu-avatar {
    width: 36px !important;
    height: 36px !important;
    line-height: 36px !important;
    font-size: 14px !important;
    display: block;
  }

  &__header-avatar ::v-deep .ivu-avatar > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    vertical-align: top;
  }

  &__meta {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 2px;
  }

  &__label {
    font-weight: 600;
    color: $apple-text-primary;
    line-height: 1.25;
    max-width: 100%;
  }

  &--dark &__label {
    color: rgba(255, 255, 255, 0.92);
  }

  &__hint {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
    line-height: 1.2;
    max-width: 100%;
  }

  &--dark &__hint {
    color: rgba(255, 255, 255, 0.45);
  }

  &__caret {
    position: absolute;
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 12px;
    color: rgba(0, 0, 0, 0.35);
  }

  &--dark &__caret {
    color: rgba(255, 255, 255, 0.4);
  }

  /** Element UI 默认 inline-block，易在窄侧栏内撑出宽度导致头像「浮」到主区 */
  &__dropdown {
    display: block !important;
    width: 100% !important;
    max-width: 100%;
    min-width: 0;
    box-sizing: border-box;
  }

  .text-ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
    width: 100%;
  }
}
</style>
