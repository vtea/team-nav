<template>
  <el-dialog title="登录"
             :visible.sync="show"
             width="380px"
             top="0"
             append-to-body
             custom-class="login-dialog-wrap"
             :before-close="beforeClose"
             :close-on-click-modal="false">
    <div slot="title" class="login-dialog-title">
      <i class="el-icon-coffee-cup login-dialog-title__icon"></i>
      欢迎登录
    </div>
    <div class="login-dialog-body">
      <el-form ref="form"
               :model="form"
               :rules="formRules"
               label-width="0"
               @keyup.enter.native="loginHandler()"
               @submit.native.prevent>
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            v-trim
            clearable
            size="small"
            placeholder="请输入账户"
            class="login-dialog-input"
          >
            <template slot="prepend">
              <i class="el-icon-user"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            v-trim
            clearable
            show-password
            size="small"
            placeholder="请输入密码"
            class="login-dialog-input"
          >
            <template slot="prepend">
              <i class="el-icon-lock"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item class="login-dialog__checks">
          <el-checkbox v-model="rememberMe">记住密码</el-checkbox>
          <el-checkbox v-model="autoLogin" :disabled="!rememberMe">自动登录</el-checkbox>
        </el-form-item>
        <el-form-item class="login-dialog__submit">
          <el-button
            type="primary"
            size="small"
            :loading="loading"
            class="login-button"
            round
            @click="loginHandler"
          >登 录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
// 是否显示登录弹窗

export let isRelogin = {show: false};

export default {
  name: "login-dialog-index",
  data() {
    return {
      show: false,
      loading: false,
      rememberMe: false,
      autoLogin: false,
      form: {
        username: '',
        password: '',
      },
      formRules: {
        username: [
          {required: true, message: '账号不能为空', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '密码不能为空', trigger: 'blur'}
        ]
      }
    }
  },
  watch: {
    rememberMe(val) {
      if (!val) {
        this.autoLogin = false
      }
    }
  },
  mounted() {
    this.show = true;
    this.init();
  },
  methods: {
    init() {
      if (localStorage.rememberMe === 'true') {
        this.form.username = localStorage.username;
        this.form.password = localStorage.password;
        this.rememberMe = true;
        if (localStorage.autoLogin === 'true') {
          this.autoLogin = true;
          if (!localStorage.userLogout) {
            this.$nextTick(() => {
              this.loginHandler();
            })
          }
        }
      }
    },
    loginHandler() {
      this.loading = true;
      this.$refs.form.validate(valid => {
        if (!valid) {
          this.loading = false;
          return;
        }
        if (this.rememberMe) {
          localStorage.username = this.form.username;
          localStorage.password = this.form.password;
          localStorage.rememberMe = this.rememberMe;
          if (this.autoLogin) {
            localStorage.autoLogin = this.autoLogin
          } else {
            delete localStorage.autoLogin;
          }
        } else {
          delete localStorage.username;
          delete localStorage.password;
          delete localStorage.rememberMe;
        }
        let cardIds = null;
        if (localStorage.hasOwnProperty('starCardIds')) {
          if (localStorage.starCardIds) {
            cardIds = localStorage.starCardIds.split(',');
          } else {
            cardIds = [];
          }
        }
        this.$http.post(`/api/v1/quick/login?returnUrl=${window.location.href}`, {...this.form, cardIds: cardIds}).then(() => {
          window.location.reload();
          isRelogin.show = false;
          this.show = false;
          delete localStorage.userLogout;
        }).finally(() => {
          this.loading = false;
        })
      });
    },
    beforeClose() {
      isRelogin.show = false
      this.show = false;
    }
  }
}
</script>

<style scoped lang="scss">
@import "~@/assets/styles/variables.scss";

.login-dialog-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 600;
  color: $apple-text-primary;
  letter-spacing: -0.12px;
}

.login-dialog-title__icon {
  color: $apple-blue;
  font-size: 20px;
}

/** 表单整体收窄并居中，避免输入框、按钮撑满整行显得过大 */
.login-dialog-body {
  max-width: 300px;
  margin: 0 auto;
  text-align: center;
}

.login-dialog-input {
  width: 100%;
}

.login-dialog__checks ::v-deep .el-form-item__content {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 12px 20px;
  line-height: 1.4;
  margin-left: 0 !important;
}

.login-dialog__submit {
  margin-bottom: 0 !important;
}

.login-dialog__submit ::v-deep .el-form-item__content {
  display: flex;
  justify-content: center;
  margin-left: 0 !important;
}

.login-button {
  min-width: 140px;
  padding-left: 28px;
  padding-right: 28px;
  border-radius: 8px;
}

.login-dialog-input ::v-deep .el-input-group__prepend {
  padding: 0 10px;
}
</style>

<style lang="scss">
/**
 * 仅登录弹窗：在视口内垂直 + 水平居中（:has 兼容现代浏览器）
 * top="0" 去掉默认 15vh 上外边距，配合 flex 居中
 */
.el-dialog__wrapper:has(.login-dialog-wrap) {
  display: flex;
  align-items: center;
  justify-content: center;
}

.el-dialog__wrapper:has(.login-dialog-wrap) .login-dialog-wrap.el-dialog {
  margin-top: 0 !important;
  margin-bottom: 0;
}

/** 标题栏与内容区：主区内上下留白一致（首输入上缘 ≈ 登录按钮下缘） */
.login-dialog-wrap {
  /**
   * 标题栏：必须 position:relative，关闭钮才能相对标题栏绝对定位在右上。
   * 勿让 .el-dialog__title width:100% 独霸一行把关闭钮挤出可视区（会表现为「跑到下面」）。
   */
  .el-dialog__header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 18px 24px;
    box-sizing: border-box;
    min-height: 52px;
  }

  .el-dialog__header .el-dialog__title {
    flex: 1;
    margin: 0;
    padding: 0 36px;
    line-height: 1.3;
    text-align: center;
  }

  /** Element UI 关闭：固定右上角，勿参与 flex 流 */
  .el-dialog__headerbtn {
    position: absolute !important;
    top: 50% !important;
    right: 16px !important;
    left: auto !important;
    margin: 0 !important;
    transform: translateY(-50%) !important;
    z-index: 2;
  }

  /**
   * 上下 padding 相同；最后一项表单项 margin 清零，避免「按钮下」比「首输入上」多出一块
   */
  .el-dialog__body {
    padding: 24px 24px 24px;
    box-sizing: border-box;
  }

  .el-dialog__body .login-dialog-body .el-form-item:last-child {
    margin-bottom: 0;
  }
}
</style>
