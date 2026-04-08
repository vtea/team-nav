<template>
  <div class="nav-home-search">
    <el-input
      ref="refSearchInput"
      v-model="keywords"
      v-trim
      clearable
      size="medium"
      prefix-icon="el-icon-search"
      placeholder="输入关键词，按回车搜索…"
      @change="searchHandler"
      @clear="searchHandler"
      @keyup.enter.native="searchHandler"
    />
  </div>
</template>

<script>
/**
 * 首页主区顶部搜索条（参考工具站：大圆角、浅底、左侧搜索图标）
 */
export default {
  name: 'HomeSearchBar',
  data() {
    return {
      keywords: ''
    }
  },
  mounted() {
    document.addEventListener('keypress', this.onGlobalKeypress)
  },
  beforeDestroy() {
    document.removeEventListener('keypress', this.onGlobalKeypress)
  },
  methods: {
    onGlobalKeypress() {
      if (!document.body.className.includes('el-popup-parent--hidden') && this.$refs.refSearchInput) {
        this.$refs.refSearchInput.focus()
      }
    },
    searchHandler() {
      this.$store.dispatch('home/loadHomeCards', this.keywords)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";

.nav-home-search {
  width: 100%;
  margin-bottom: clamp(20px, 2.5vw, 28px);

  ::v-deep .el-input__inner {
    height: 44px;
    line-height: 44px;
    font-size: 15px;
    font-weight: 400;
    letter-spacing: -0.224px;
    color: $apple-text-primary;
    border-radius: 12px;
    padding-left: 42px;
    background-color: $apple-surface;
    border: 1px solid $apple-border-hairline;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 14px rgba(0, 0, 0, 0.05);

    @supports ((-webkit-backdrop-filter: blur(1px)) or (backdrop-filter: blur(1px))) {
      background-color: rgba(255, 255, 255, 0.92);
      -webkit-backdrop-filter: saturate(180%) blur(16px);
      backdrop-filter: saturate(180%) blur(16px);
      border-color: $apple-border-hairline;
    }

    &::placeholder {
      color: rgba(0, 0, 0, 0.4);
    }

    &:hover {
      border-color: rgba(0, 0, 0, 0.1);
    }

    &:focus {
      border-color: $apple-blue;
      box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.18);
      background-color: #ffffff !important;

      @supports ((-webkit-backdrop-filter: blur(1px)) or (backdrop-filter: blur(1px))) {
        background-color: rgba(255, 255, 255, 0.96) !important;
      }
    }
  }

  ::v-deep .el-input__prefix {
    left: 12px;
    color: rgba(0, 0, 0, 0.35);
  }

  ::v-deep .el-input__suffix {
    right: 8px;
  }
}
</style>
