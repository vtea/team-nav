<template>
  <div
    class="nav-sidebar--with-logo nav-sidebar--shell-home"
    :class="settings.sideTheme"
  >
    <logo :collapse="isCollapse"/>
    <el-scrollbar :class="[settings.sideTheme, 'nav-sidebar__menu-scroll']" wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="settings.sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground"
        :text-color="settings.sideTheme === 'theme-dark' ? variables.menuColor : variables.menuLightColor"
        :unique-opened="settings.menuAccordion"
        :active-text-color="settings.theme"
        :default-openeds="openMenus"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="item in sidebarMenusResolved"
          :key="item.id"
          :item="item"
        />
      </el-menu>
    </el-scrollbar>
    <sidebar-user-footer/>
  </div>
</template>

<script>
import {mapGetters, mapState} from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import SidebarUserFooter from "./SidebarUserFooter";
import variables from "@/assets/styles/variables.scss";
import { enrichHomeSidebarMenus } from '@/utils/menu-icon'

export default {
  components: {SidebarItem, Logo, SidebarUserFooter},
  computed: {
    ...mapState(["settings"]),
    ...mapGetters([
      'sidebar',
      'homeMenus',
    ]),
    /** 名称推荐图标 + 同级去重，避免后台配置重复 icon 时与标题不符 */
    sidebarMenusResolved() {
      return enrichHomeSidebarMenus(this.homeMenus)
    },
    openMenus() {
      if (this.$store.state.settings.menuDefaultOpen) {
        return this.$store.state.home.openIds;
      }
      return [];
    },
    activeMenu() {
      const route = this.$route;
      const {meta, path} = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  }
};
</script>
