<template>
  <div>
    <el-carousel v-if="dataList.length"
                 trigger="click" height="48px"
                 indicator-position="none"
                 :interval="cutOverSpeed * 1000">
      <el-carousel-item v-for="item in dataList" :key="item.id">
        <div class="carousel-notice-row">
          <div class="carousel-notice__content" v-html="item.content"></div>
          <el-statistic
            v-if="item.endTime"
            format="DD天HH小时mm分钟ss秒"
            :value="new Date(item.endTime)"
            time-indices>
          </el-statistic>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "carousel-flip-notice",
  computed: {
    ...mapGetters([
      'cutOverSpeed',
    ]),
  },
  data() {
    return {
      dataList: []
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.$http.get('/api/v1/notice', {params: {status: true}}).then(res => {
        this.dataList = res;
      })
    }
  }
}
</script>

<style scoped lang="scss">
.carousel-notice-row {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px 12px;
  min-height: 48px;
  padding: 0 8px;
  box-sizing: border-box;
}

/** 公告正文：与主区辅助文案同阶，避免过小 */
.carousel-notice__content {
  line-height: 1.45;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: -0.12px;
  color: rgba(0, 0, 0, 0.72);

  ::v-deep p {
    margin: 0;
  }
}

.el-statistic {
  width: auto;
  display: flex;
  flex-shrink: 0;

  ::v-deep .con {
    display: flex;
    align-items: baseline;
  }

  /** 倒计时：略小于原 22px，与左侧正文视觉平衡 */
  ::v-deep .con .number {
    font-size: 15px;
    font-weight: 600;
    letter-spacing: -0.12px;
    color: #0071e3;
  }
}
</style>
