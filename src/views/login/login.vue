<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" class="login-form" autocomplete="on" label-position="left">

      <div class="title-container">
        <h3 class="title"> {{title}} </h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-tooltip v-model:visible="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="Password"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.prevent="handleLogin">{{ $t('login') }}</el-button>
    </el-form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CryptoJS from 'crypto-js'
import { check, login } from '@/api/permission'
export default {
    data() {
        return {
            loginForm: {
                username: '',
                password: ''
            },
            loading: false,
            capsTooltip: false,
            passwordType: 'password',
            title: ''
        }
    },
    created() {
        document.title = this.docTitle
        check().then((res) => {
            if (res.code === 201) {
                this.$router.replace('/register').catch()
            } else {
                this.title = res.data.title
                document.title = this.title
                this.$store.commit('SET_TITLE', this.title)
            }
        })
    },
    computed: {
        ...mapState(['docTitle'])
    },
    mounted() {
        this.$refs.password.focus()
    },
    methods: {
        showPwd() {
            if (this.passwordType === 'password') {
                this.passwordType = ''
            } else {
                this.passwordType = 'password'
            }
            this.$nextTick(() => {
                this.$refs.password.focus()
            })
        },
        checkCapslock(e) {
            const { key } = e
            this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
        },
        async handleLogin() {
            if (this.loginForm.username === '' || this.loginForm.password === '') {
                this.$message.error(this.$t('inputNotNull'))
                return
            }
            const loginInfo = Object.assign({}, this.loginForm)
            loginInfo.password = CryptoJS.SHA224(this.loginForm.password).toString()
            const data = await login(loginInfo)
            const token = data.token
            let isAdmin = false
            if (this.loginForm.username === 'admin') {
                isAdmin = true
            }
            this.$store.commit('SET_ADMIN', isAdmin)
            this.$store.commit('LOGIN_IN', token)
            this.$router.replace('/').catch()
        }
    }
}
</script>

<style lang="scss">

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

/* reset element-ui css */
.login-container {
  .el-input {
    height: 47px;
    width: 92%;
    position: static;

    .el-input__wrapper {
      padding:0;
      box-shadow:none;
    }

    input {
      background: $bg;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
