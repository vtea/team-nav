<template>
  <div class="app-container role-page">
    <el-row :gutter="20" class="role-page__stack">
      <el-col :span="24">
        <role-list @roleRowChange="roleRowChange"></role-list>
      </el-col>
      <el-col :span="24">
        <el-card shadow="never" class="role-page__card role-page__card--tree">
          <div slot="header" class="card-header">
            <span>拥有分类</span>
            <el-button
              type="primary"
              plain
              icon="el-icon-document"
              size="mini"
              :disabled="!Boolean(roleDetail.id) || roleDetail.id === '1'"
              @click="roleCategorySave()"
            >保存
            </el-button>
          </div>
          <el-tree
            ref="categoryTree"
            :data="categories"
            :props="{label: 'name'}"
            node-key="id"
            highlight-current
            :default-checked-keys="roleDetail.categoryIds"
            show-checkbox>
          </el-tree>
        </el-card>
      </el-col>
      <el-col :span="24">
        <el-card shadow="never" class="user-table-card">
          <div slot="header" class="card-header">
            <span>拥有用户</span>
            <el-button
              type="primary"
              plain
              icon="el-icon-document"
              size="mini"
              :disabled="!Boolean(roleDetail.id)"
              @click="roleUserSave()"
            >保存
            </el-button>
          </div>
          <el-table
            highlight-current-row
            ref="dataTable"
            v-loading="loading"
            :data="table.dataList">
            <el-table-column label="序号" type="index" width="50" align="center" :index="table.index"/>
            <el-table-column type="selection" width="50" align="center"/>
            <el-table-column label="用户姓名" align="center" prop="nickname"
                             :show-overflow-tooltip="true"/>
          </el-table>
          <pagination
            small
            :pager-count="5"
            layout="sizes,prev,pager,next"
            v-show="table.total>0"
            :total="table.total"
            :page.sync="queryParam.pageIndex"
            :limit.sync="queryParam.pageSize"
            @pagination="getUserList"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "role-index",
  components: {
    'role-list': () => import('./role-list')
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 查询参数
      queryParam: {
        pageIndex: 1,
        pageSize: 10,
      },
      table: {
        total: 0,
        index: 1,
        dataList: []
      },
      categories: [],
      roleDetail: {
        id: '',
        roleName: '',
        categoryIds: [],
        userIds: [],
      },
    };
  },
  mounted() {
    this.getCategoriesTree();
    this.getUserList();
  },
  methods: {
    getCategoriesTree() {
      this.$http.get('/api/v1/category/tree')
        .then(res => {
          this.categories = res;
        })
    },
    getUserList() {
      this.loading = true;
      this.$http.get(`/api/v1/user/page`, {params: this.queryParam})
        .then(res => {
          this.table.dataList = res.content;
          this.table.total = res.totalElements;
          this.table.index = res.pageable.offset + 1;
          this.loading = false;
        });
    },
    roleRowChange(row) {
      this.$refs.categoryTree.setCheckedKeys([]);
      this.$refs.dataTable.clearSelection();
      this.$http.get(`/api/v1/role/${row.id}`)
        .then(res => {
          this.roleDetail = res;
          if (this.roleDetail.id === '1') {
            this.roleDetail.categoryIds = [];
          }
          this.table.dataList.filter(it => this.roleDetail.userIds.includes(it.id)).forEach(it => {
            this.$refs.dataTable.toggleRowSelection(it);
          })
        })
    },
    roleCategorySave() {
      if (!this.roleDetail.id) {
        return;
      }
      const keys = this.$refs.categoryTree.getCheckedKeys();
      this.$http.patch(`/api/v1/role/${this.roleDetail.id}/category`, keys)
        .then(() => {
          this.$modal.msgSuccess("保存成功");
          this.roleRowChange({id: this.roleDetail.id});
        })
    },
    roleUserSave() {
      if (!this.roleDetail.id) {
        return;
      }
      this.$http.patch(`/api/v1/role/${this.roleDetail.id}/user`, {
        checkIds: this.$refs.dataTable.selection.map(it => it.id),
        userIds: this.table.dataList.map(it => it.id)
      })
        .then(() => {
          this.$modal.msgSuccess("保存成功");
          this.roleRowChange({id: this.roleDetail.id});
        })
    },
  }
}
</script>

<style scoped lang="scss">
/** 单列自上而下：角色列表 → 拥有分类 → 拥有用户 */
.role-page__stack > .el-col + .el-col {
  margin-top: 16px;
}

.role-page__card--tree ::v-deep .el-card__body {
  max-height: 420px;
  overflow: auto;
}

::v-deep .el-card__header {
  padding: 11px 15px;
}

::v-deep .el-card__body {
  padding: 10px;
}

.user-table-card {
  ::v-deep .el-card__body {
    padding: 0 0 20px 0;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  align-items: center;
}
</style>
