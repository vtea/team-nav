<template>
  <section class="nav-home-main">
    <home-search-bar class="nav-home-main__search"/>
    <div class="nav-home-category" v-for="(category, index) in homeCards" :key="category.id">
      <div class="nav-home-category__anchor" :class="{'nav-home-category__anchor--first':index===0}" :id="category.id"></div>
      <div class="nav-home-category__title" v-if="Array.isArray(category.children)&&category.children.length===1">
        <span v-text="category.name + ' / ' + category.children[0].name"></span>
      </div>
      <div class="nav-home-category__title" v-else>
        <span v-text="category.name"></span>
      </div>
      <el-tabs v-if="Array.isArray(category.children)&&category.children.length>1" :value="category.children[0].id">
        <el-tab-pane lazy v-for="child in category.children" :key="child.id" :label="child.name" :name="child.id">
          <category-children :datas="child.cards"></category-children>
        </el-tab-pane>
      </el-tabs>
      <category-children v-else-if="Array.isArray(category.children)&&category.children.length===1"
                         :datas="category.children[0].cards"></category-children>
      <category-children v-else :datas="category.cards"></category-children>
    </div>
    <el-empty v-if="homeCards.length<=0" description="没有任何数据"></el-empty>
    <el-backtop target=".nav-home-main"></el-backtop>
  </section>
</template>

<script>

import {mapGetters} from "vuex";

export default {
  name: 'AppMain',
  components: {
    'home-search-bar': () => import('@/home/components/HomeSearchBar.vue'),
    'category-children': () => import('@/home/components/category-children.vue'),
  },
  computed: {
    ...mapGetters([
      'homeCards',
    ]),
  },
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";

.nav-home-main {
  height: calc(100vh - 48px);
  width: 100%;
  position: relative;
  overflow: auto;
  background-color: $apple-bg-page;
  padding: clamp(16px, 2vw, 24px) clamp(16px, 2.5vw, 28px) 40px;
  box-sizing: border-box;
}

.nav-home-main__search {
  display: block;
}

.nav-home-category {
  &:not(:first-of-type) {
    margin-top: 16px;
  }

  .nav-home-category__anchor {
    position: relative;
    top: -18px;
  }
  .nav-home-category__anchor--first {
    top: -20px;
  }

  .el-tabs {
    ::v-deep .el-tabs__header {
      margin: 10px 0 0 2px;

      .el-tabs__nav-wrap::after {
        display: none;
      }

      .el-tabs__active-bar {
        display: none;
      }

      .el-tabs__nav {
        border-radius: 10px;
        height: 34px;
        padding: 3px;
        background-color: rgba(255, 255, 255, 0.92);
        border: 1px solid $apple-border-hairline;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 14px rgba(0, 0, 0, 0.05);

        @supports ((-webkit-backdrop-filter: blur(1px)) or (backdrop-filter: blur(1px))) {
          -webkit-backdrop-filter: saturate(180%) blur(12px);
          backdrop-filter: saturate(180%) blur(12px);
        }

        .el-tabs__item {
          border-radius: 8px;
          text-align: center;
          padding: 0 14px;
          height: 28px;
          line-height: 28px;
          font-size: 13px;
          font-weight: 400;
          letter-spacing: -0.12px;
          color: $apple-text-tertiary;
        }

        .el-tabs__item.is-active {
          background-color: #ffffff;
          color: $apple-blue !important;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
          font-weight: 600;
        }
      }
    }
  }

  /**
   * 分区标题：介于侧栏 14px 与卡片标题 15px 之间略大一级（~19px），
   * 避免过大 Display 字号造成与正文比例失调（对齐 DESIGN 层级感）
   */
  .nav-home-category__title {
    font-size: $home-section-title-size;
    font-weight: 600;
    line-height: 1.14;
    letter-spacing: -0.15px;
    padding: 6px 2px 8px;
    color: $apple-text-primary;
  }
}

.blink-box {
  animation: home-section-pulse 1.2s ease-out 2 alternate;
}

@keyframes home-section-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(0, 113, 227, 0.25);
  }
  100% {
    box-shadow: 0 0 0 6px rgba(0, 113, 227, 0);
  }
}
</style>
