<template>
  <div class="nav-home-cards" :class="{'nav-home-cards--layout-large': cardSize==='large'}">
    <div class="nav-home-cards__cell--sm nav-home-cards__cell--md nav-home-cards__cell--xl nav-home-cards__cell--xxl" v-for="card in datas" :key="card.id">
      <el-card class="nav-home-card"
               shadow="never"
               @click.native="cardClickHandler(card)">
        <button
          type="button"
          class="nav-home-card__star"
          :class="card.star ? 'nav-home-card__star--active' : ''"
          :title="card.star ? '移除常用' : '置为常用'"
          aria-label="常用"
          @click.stop="starHandler(card)"
        >
          <i :class="card.star ? 'el-icon-star-on' : 'el-icon-star-off'"></i>
        </button>
        <div class="nav-home-card__row">
          <ivu-avatar v-if="card.icon.src"
                      :src="card.icon.src"
                      shape="square"
                      class="nav-home-card__icon"></ivu-avatar>
          <ivu-avatar v-else
                      class="nav-home-card__icon"
                      shape="square"
                      :style="{background: card.icon.color}">{{ card.icon.text }}
          </ivu-avatar>
          <div class="nav-home-card__body">
            <div v-text="card.title" class="nav-home-card__title"></div>
            <div v-if="card.type.startsWith('dynamic') && !card.content" class="nav-home-card__text nav-home-card__text--loading">
              <i class="el-icon-loading"></i>正在加载...
            </div>
            <div v-else v-text="card.content" class="nav-home-card__text"></div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "category-children",
  props: {
    datas: {
      type: Array
    }
  },
  computed: {
    ...mapGetters([
      'cardSize',
    ]),
  },
  methods: {
    cardClickHandler(card) {
      if (card.url) {
        // 页面中引入外网的链接资源，会产生一个新的http请求。为了安全（URL里可能包含用户信息），
        // 浏览器一般都会给这写请求头加上表示来源的referrer 字段，让目标站判断来源地址
        window.open(card.url,'_blank','noopener=yes,noreferrer=yes');
      }
    },
    starHandler(card) {
      this.$store.dispatch('home/setStarCard', card).then(star => {
        card.star = star;
        this.$modal.msgSuccess(star ? '已添加到个人常用' : '已移出个人常用');
      });
    },
  }
}
</script>


<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
@import "~@/assets/styles/typography-mixins.scss";

.nav-home-cards {
  display: flex;
  flex-wrap: wrap;
  padding-left: 2px;
  padding-bottom: 10px;
  gap: 0;

  .nav-home-card__row {
    display: flex;
    align-items: flex-start;
    width: 100%;
  }

  /** 卡片：纯白表面 + 统一发丝线与阴影，与画布 #f5f5f7 对比清晰、减少「多块灰白打架」 */
  .nav-home-card.el-card {
    @include apple-nav-card-surface;
    @include apple-nav-card-body-padding;

    .nav-home-card__star {
      @include apple-nav-card-star-default;
    }

    .nav-home-card__star:hover {
      background-color: $apple-overlay-hover-light;
      color: $apple-text-subtle;
    }

    .nav-home-card__star.nav-home-card__star--active,
    .nav-home-card__star .el-icon-star-on {
      color: $apple-star-gold;
    }

    .nav-home-card__star .el-icon-star-off {
      font-size: 16px;
    }

    .nav-home-card__star .el-icon-star-on {
      font-size: 16px;
    }

    .nav-home-card__icon {
      vertical-align: middle;
      width: 44px;
      height: 44px;
      line-height: 44px;
      flex-shrink: 0;
      border-radius: $nav-card-logo-radius !important;
      overflow: hidden;
    }

    .nav-home-card__icon ::v-deep img {
      object-fit: cover;
    }

    .nav-home-card__body {
      flex: 1;
      min-width: 0;
      margin-left: 12px;
      padding-right: 22px;
    }

    .nav-home-card__title {
      @include apple-nav-card-title-default;
      @include apple-text-ellipsis-single-line;
    }

    .nav-home-card__text {
      @include apple-nav-card-content-default;
    }

    .nav-home-card__text--loading {
      display: block;
      white-space: nowrap;
      -webkit-line-clamp: unset;
    }
  }

  /** 悬停：浅蓝高亮 */
  .nav-home-card.el-card:hover {
    @include apple-nav-card-hover;
  }
}

.nav-home-cards--layout-large {
  .nav-home-card__title {
    @include apple-nav-card-title-large-layout;
  }

  .nav-home-card__text {
    @include apple-nav-card-content-large-layout;
  }

  .nav-home-card__icon {
    width: 48px !important;
    height: 48px !important;
    line-height: 48px !important;
    border-radius: $nav-card-logo-radius !important;
  }
}

/**
 * 响应式栅格（移动优先）：
 * - 默认：一行一个
 * - ≥480px：一行两个
 * - ≥768px：一行四个
 */
.nav-home-cards__cell--sm {
  -ms-flex: 0 0 100%;
  flex: 0 0 100%;
  max-width: 100%;
  padding: 10px;
  margin-top: 0;
}

@media (min-width: 480px) {
  .nav-home-cards__cell--sm {
    -ms-flex: 0 0 50%;
    flex: 0 0 50%;
    max-width: 50%;
  }
}

@media (min-width: 768px) {
  .nav-home-cards__cell--md {
    -ms-flex: 0 0 25%;
    flex: 0 0 25%;
    max-width: 25%;
  }
  .nav-home-cards--layout-large .nav-home-cards__cell--md {
    -ms-flex: 0 0 25%;
    flex: 0 0 25%;
    max-width: 25%;
  }
}

@media (min-width: 1200px) {
  .nav-home-cards__cell--xl {
    -ms-flex: 0 0 25%;
    flex: 0 0 25%;
    max-width: 25%;
  }
  .nav-home-cards--layout-large .nav-home-cards__cell--xl {
    -ms-flex: 0 0 25%;
    flex: 0 0 25%;
    max-width: 25%;
  }
}

@media (min-width: 1600px) {
  .nav-home-cards__cell--xxl {
    -ms-flex: 0 0 25%;
    flex: 0 0 25%;
    max-width: 25%;
  }
  .nav-home-cards--layout-large .nav-home-cards__cell--xxl {
    -ms-flex: 0 0 25%;
    flex: 0 0 25%;
    max-width: 25%;
  }
}

/** 小屏（小于 768px）：单列或双列，略收紧栅格；单列时保持可读字号 */
@media (max-width: 767px) {
  .nav-home-cards {
    padding-left: 2px;
    padding-right: 2px;
  }

  .nav-home-cards__cell--sm {
    padding: 8px 6px;
  }

  .nav-home-cards .nav-home-card__star {
    top: 5px;
    right: 4px;
    width: 28px;
    height: 28px;
  }
}

@media (max-width: 479px) {
  .nav-home-cards .nav-home-card.el-card ::v-deep .el-card__body {
    padding: 12px 12px !important;
  }

  .nav-home-cards .nav-home-card__icon {
    width: 44px !important;
    height: 44px !important;
    line-height: 44px !important;
  }

  .nav-home-cards .nav-home-card__body {
    margin-left: 12px;
    padding-right: 22px;
  }

  .nav-home-cards .nav-home-card__title {
    font-size: $home-card-title-size;
  }

  .nav-home-cards .nav-home-card__text {
    font-size: $home-card-body-size;
    margin-top: 5px;
  }

  .nav-home-cards--layout-large .nav-home-card__icon {
    width: 46px !important;
    height: 46px !important;
    line-height: 46px !important;
  }

  .nav-home-cards--layout-large .nav-home-card__title {
    font-size: 16px !important;
  }

  .nav-home-cards--layout-large .nav-home-card__text {
    font-size: 13px !important;
  }
}

@media (min-width: 480px) and (max-width: 767px) {
  .nav-home-cards .nav-home-card.el-card ::v-deep .el-card__body {
    padding: 10px 10px !important;
  }

  .nav-home-cards .nav-home-card__icon {
    width: 38px !important;
    height: 38px !important;
    line-height: 38px !important;
  }

  .nav-home-cards .nav-home-card__body {
    margin-left: 10px;
    padding-right: 20px;
  }

  .nav-home-cards .nav-home-card__title {
    font-size: 13px;
  }

  .nav-home-cards .nav-home-card__text {
    font-size: 12px;
    margin-top: 4px;
  }

  .nav-home-cards--layout-large .nav-home-card__icon {
    width: 40px !important;
    height: 40px !important;
    line-height: 40px !important;
  }

  .nav-home-cards--layout-large .nav-home-card__title {
    font-size: 14px !important;
  }

  .nav-home-cards--layout-large .nav-home-card__text {
    font-size: 12px !important;
  }
}

</style>
