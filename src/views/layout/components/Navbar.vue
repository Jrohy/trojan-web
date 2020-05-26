<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
        <div>
            <el-dropdown trigger="click" placement="top">
                <span class="el-dropdown-link">
                    <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="systemVersion(); versionVisible=true">{{ $t('navbar.version') }}</el-dropdown-item>
                    <el-dropdown-item @click.native="getTitle(); loginVisible=true" v-if="isAdmin">{{ $t('navbar.title') }}</el-dropdown-item>
                    <el-dropdown-item @click.native="dialogVisible=true" v-if="isAdmin">{{ $t('navbar.password') }}</el-dropdown-item>
                    <el-dropdown-item @click.native="handleSetLanguage('zh')" divided>中文</el-dropdown-item>
                    <el-dropdown-item @click.native="handleSetLanguage('en')">English</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-dialog :modal="false" :title="$t('navbar.changeTitle')" :visible.sync="loginVisible" :width="dialogWidth">
                <el-input type="text" v-model="title" :placeholder="$t('navbar.inputTitle')" @keyup.enter.native="handleLoginInfo"/>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="loginVisible = false">{{ $t('cancel') }}</el-button>
                    <el-button type="primary" @click="handleLoginInfo()">{{ $t('ok') }}</el-button>
                </div>
            </el-dialog>
            <el-dialog :modal="false" :title="$t('navbar.versionTitle')" :visible.sync="versionVisible" :width="dialogWidth">
                <p> version: {{ versionList.version }} </p>
                <p> gitVersion: {{ versionList.gitVersion.slice(0,7) }} </p>
                <p> buildDate: {{ versionList.buildDate }} </p>
                <p> goVersion: {{ versionList.goVersion }} </p>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="versionVisible = false">{{ $t('ok') }}</el-button>
                </div>
            </el-dialog>
            <el-dialog :modal="false" :title="$t('navbar.passwordTitle')" :visible.sync="dialogVisible" :width="dialogWidth">
                <el-form  :model="form" :rules="registerRules" ref="form" label-position="left">
                    <el-form-item prop="password1">
                        <el-input name="password1" :type="pwdType" v-model="form.password1" :placeholder="$t('inputPass')" show-password/>
                    </el-form-item>
                    <el-form-item prop="password2">
                        <el-input name="password2" :type="pwdType" @keyup.enter.native="register" v-model="form.password2" :placeholder="$t('inputPassAgain')" show-password/>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">{{ $t('cancel') }}</el-button>
                    <el-button type="primary" @click="dialogVisible = false; changePass()">{{ $t('ok') }}</el-button>
                </div>
            </el-dialog>
        </div>
        <div @click="loginOut">
            <span class="iconfont icon-quit"></span>
        </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import CryptoJS from 'crypto-js'
import { sleep } from '@/utils/common'
import { resetPass, check } from '@/api/permission'
import { version, setLoginInfo } from '@/api/common'

export default {
    data() {
        const validatePass = (rule, value, callback) => {
            if (value.length < 5) {
                callback(new Error(this.$t('passLessError')))
            } else {
                callback()
            }
        }
        return {
            handleSetLanguage(lang) {
                const successTip = lang === 'zh' ? '切换语言成功' : 'Switch Language Success'
                this.$i18n.locale = lang
                this.$store.dispatch('app/setLanguage', lang)
                this.$message({
                    message: successTip,
                    type: 'success'
                })
            },
            versionList: {
                version: '',
                buildDate: '',
                gitVersion: '',
                goVersion: ''
            },
            pwdType: 'password',
            dialogVisible: false,
            versionVisible: false,
            loginVisible: false,
            dialogWidth: '25%',
            title: '',
            form: {
                password1: '',
                password2: ''
            },
            registerRules: {
                password1: [
                    { required: true, trigger: 'blur', validator: validatePass }
                ],
                password2: [
                    { required: true, trigger: 'blur', validator: validatePass }
                ]
            }
        }
    },
    components: {
        Breadcrumb,
        Hamburger
    },
    created() {
        document.title = this.docTitle
    },
    mounted() {
        this.setDialogWidth()
        window.onresize = () => {
            this.setDialogWidth()
        }
    },
    computed: {
        ...mapState(['docTitle', 'isAdmin']),
        ...mapGetters([
            'sidebar'
        ])
    },
    methods: {
        toggleSideBar() {
            this.$store.dispatch('app/toggleSideBar')
        },
        setDialogWidth() {
            const clientWith = document.body.clientWidth
            if (clientWith < 600) {
                this.dialogWidth = '80%'
            } else if (clientWith >= 600 && clientWith < 1000) {
                this.dialogWidth = '50%'
            } else {
                this.dialogWidth = '25%'
            }
            this.$store.commit('SET_WIDTH', this.dialogWidth)
        },
        async getTitle() {
            const result = await check()
            this.title = result.data.title
        },
        async handleLoginInfo() {
            const formData = new FormData()
            formData.set('title', this.title)
            const result = await setLoginInfo(formData)
            if (result.Msg === 'success') {
                this.$message({
                    message: this.$t('navbar.changeTitleSuccess'),
                    type: 'success'
                })
                this.userItem = null
                document.title = this.title
                this.$store.commit('SET_TITLE', this.title)
            } else {
                this.$message.error(result.Msg)
            }
            this.loginVisible = false
        },
        async systemVersion() {
            const result = await version()
            this.versionList = result.Data
        },
        async changePass() {
            const formData = new FormData()
            if (this.form.password1 !== this.form.password2) {
                this.$message.error(this.$t('passDifferentError'))
                return
            } else {
                formData.set('password', CryptoJS.SHA224(this.form.password1).toString())
            }
            try {
                await resetPass(formData)
                this.$message({
                    message: this.$t('navbar/resetSuccess'),
                    type: 'success'
                })
                await sleep(1000 * 2)
                this.$store.commit('LOGIN_OUT')
                this.$router.replace('/login').catch(e => {})
            } catch (e) {
                console.log(e)
            }
        },
        loginOut() {
            this.$store.commit('LOGIN_OUT')
            /* 防止切换角色时addRoutes重复添加路由导致出现警告 */
            window.location.reload()
        }
    }
}
</script>

<style lang="scss" scoped>
@font-face {font-family: "iconfont";
    src: url('data:application/x-font-woff;charset=utf-8;base64,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') format('woff');
}

.iconfont {
    font-family:"iconfont" !important;
    font-size:16px;
    font-style:normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.icon-quit:before { content: "\e67d"; }

.navbar {
    border-bottom: 1px solid #e5e5e5;
    height: 50px;
    line-height: 50px;
    position: relative;
    background: #fff;
    transition: left 0.25s;
    .hamburger-container {
        line-height: 46px;
        height: 100%;
        float: left;
        cursor: pointer;
        transition: background .3s;
        -webkit-tap-highlight-color:transparent;

        &:hover {
            background: rgba(0, 0, 0, .025)
        }
    }

    .breadcrumb-container {
        float: left;
    }

    .right-menu {
        height: 100%;
        float: right;
        position: absolute;
        right: 10px;
        top: -1px;
        bottom: 0px;
        > div {
            position: relative;
            display: inline-block;
            text-align: center;
            vertical-align: middle;
            margin-left: 10px;
            padding: 0 15px;
            cursor: pointer;
            &:hover::after {
                transform-origin: 0 0;
                transform: scaleX(1);
            }
            &:first-child:before {
                border: none;
            }
            &::after {
                content: '';
                position: absolute;
                left: 0;
                bottom: 0;
                width: 100%;
                height: 2px;
                background: #ef4747;
                transform: scaleX(0);
                transform-origin: right 0;
                transition: transform 0.5s;
            }
            &::before {
                content: '';
                position: absolute;
                height: 20px;
                top: 50%;
                left: -8px;
                margin-top: -10px;
                border-left: 1px solid #ccc;
            }
            .iconfont {
                position: relative;
                font-size: 24px;
                color: #758eb5;
            }
        }
    }
}
</style>
