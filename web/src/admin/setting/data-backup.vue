<template>
  <el-card class="data-backup-card">
    <div slot="header" class="card-title">
      <span>数据导入导出</span>
    </div>
    <div>
      <el-divider content-position="left">数据备份/还原</el-divider>
      <div class="backup-panel backup-panel--actions">
        <el-button type="primary"
                   class="backup-item"
                   icon="el-icon-download"
                   :loading="backupLoading"
                   size="small"
                   @click="backupHandler">备份数据
        </el-button>
        <file-uploader type="revert"
                       class="backup-item"
                       accept="application/zip"
                       :file-list="[]"
                       @file-change="revertUploadSuccess"
                       :limit="1">还原备份数据
        </file-uploader>
      </div>
      <el-divider content-position="left">浏览器书签导入</el-divider>
      <div class="backup-panel backup-panel--actions">
        <file-uploader type="bookmark"
                       accept="text/html"
                       :file-list="[]"
                       @file-change="bookmarkUploadSuccess"
                       :limit="1">上传浏览器书签
        </file-uploader>
      </div>
      <bookmark-preview ref="refBookmark"></bookmark-preview>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "data-backup",
  components: {
    'com-tip': () => import('@/components/com-tip/index.vue'),
    'file-uploader': () => import('@/components/file-uploader/index.vue'),
    'bookmark-preview': () => import('@/admin/setting/dialog/bookmark-preview.vue'),
  },
  data() {
    return {
      backupLoading: false,
      revertLoading: false,
      revertUrl: `${process.env.VUE_APP_BASE_API}/api/v1/data/revert`,
    }
  },
  methods: {
    backupHandler() {
      this.backupLoading = true
      this.$download.download(`/api/v1/data/backup`)
        .then(() => {
          this.$modal.msgSuccess('备份成功');
        })
        .finally(() => {
          this.backupLoading = false;
        });
    },
    revertUploadSuccess() {
      this.$modal.msgSuccess('还原成功');
      setTimeout(() => {
        location.reload();
      }, 1000);
    },
    bookmarkUploadSuccess(list){
      this.$refs.refBookmark.open(list[0].path);
    }
  }
}
</script>

<style scoped lang="scss">
.backup-panel {
  margin-bottom: 80px;
}

/** 横向排列用 flex，避免 float + 宽容器把按钮拉满一行导致内容贴左 */
.backup-panel--actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}
</style>

<!-- 不用 scoped：穿透子组件 file-uploader 内 el-upload / el-button，保证居中生效 -->
<style lang="scss">
.data-backup-card .backup-panel {
  .el-upload {
    display: inline-block;
    width: auto !important;
    vertical-align: middle;
  }

  .el-button {
    display: inline-flex !important;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: auto;
    min-width: unset;
  }
}
</style>
