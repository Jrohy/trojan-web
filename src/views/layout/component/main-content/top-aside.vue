<template>
    <aside class="aside__top">
        <span
            class="iconfont icon-nav toggleNavCollapse"
            :class="{active:isSidebarNavCollapse}"
            @click="toggleNavCollapse"
        >
        </span>
        <div class="aside__top--right">
            <div class="user-msg">
                <el-dropdown trigger="click" placement="top">
                    <span class="el-dropdown-link">
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="systemVersion(); versionVisible=true">系统版本</el-dropdown-item>
                        <el-dropdown-item @click.native="getTitle(); loginVisible=true" v-if="isAdmin">修改标题</el-dropdown-item>
                        <el-dropdown-item @click.native="dialogVisible=true" v-if="isAdmin">修改密码</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-dialog :modal="false" title="修改登录页标题" :visible.sync="loginVisible" :width="dialogWidth">
                    <el-input type="text" v-model="title" placeholder="输入登录页标题" @keyup.enter.native="handleLoginInfo"/>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="loginVisible = false">取 消</el-button>
                        <el-button type="primary" @click="handleLoginInfo()">确 定</el-button>
                    </div>
                </el-dialog>
                <el-dialog :modal="false" title="trojan管理程序版本" :visible.sync="versionVisible" :width="dialogWidth">
                    <p> version: {{ versionList.version }} </p>
                    <p> gitVersion: {{ versionList.gitVersion.slice(0,7) }} </p>
                    <p> buildDate: {{ versionList.buildDate }} </p>
                    <p> goVersion: {{ versionList.goVersion }} </p>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="versionVisible = false">确 定</el-button>
                    </div>
                </el-dialog>
                <el-dialog :modal="false" title="变更管理员密码" :visible.sync="dialogVisible" :width="dialogWidth">
                    <el-form  :model="form" :rules="registerRules" ref="form" label-position="left">
                        <el-form-item prop="password1">
                            <el-input name="password1" :type="pwdType" v-model="form.password1" placeholder="输入密码" show-password/>
                        </el-form-item>
                        <el-form-item prop="password2">
                            <el-input name="password2" :type="pwdType" @keyup.enter.native="register" v-model="form.password2" placeholder="请再次输入密码" show-password/>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="dialogVisible = false; changePass()">确 定</el-button>
                    </div>
                </el-dialog>
            </div>
            <div class="quit-system" @click="loginOut">
                <span class="iconfont icon-quit"></span>
            </div>
        </div>
    </aside>
</template>

<script>
import { mapState } from 'vuex'
import CryptoJS from 'crypto-js'
import { sleep } from '@/utils/common'
import { resetPass, check } from '@/api/permission'
import { version, setLoginInfo } from '@/api/common'

export default {
    data() {
        const validatePass = (rule, value, callback) => {
            if (value.length < 5) {
                callback(new Error('密码不能小于5位'))
            } else {
                callback()
            }
        }
        return {
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
    computed: {
        ...mapState(['isSidebarNavCollapse', 'docTitle', 'isAdmin'])
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
    methods: {
        setDialogWidth() {
            let clientWith = document.body.clientWidth
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
            let result = await check()
            this.title = result.data.title
        },
        async handleLoginInfo() {
            let formData = new FormData()
            formData.set('title', this.title)
            let result = await setLoginInfo(formData)
            if (result.Msg === 'success') {
                this.$message({
                    message: '修复登录页标题成功!',
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
            let result = await version()
            this.versionList = result.Data
        },
        async changePass() {
            let formData = new FormData()
            if (this.form.password1 !== this.form.password2) {
                this.$message.error('两次输入不一致!')
                return
            } else {
                formData.set('password', CryptoJS.SHA224(this.form.password1).toString())
            }
            try {
                await resetPass(formData)
                this.$message({
                    message: '重置密码成功!',
                    type: 'success'
                })
                await sleep(1000 * 2)
                this.$store.commit('LOGIN_OUT')
                this.$router.replace('/login')
            } catch (e) {
                console.log(e)
            }
        },
        toggleNavCollapse() {
            this.$store.commit('toggleNavCollapse')
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
.aside__top {
    border-bottom: 1px solid #e5e5e5;
    height: 50px;
    line-height: 50px;
    position: fixed;
    left: 200px;
    top: 0;
    right: 0;
    background: #fff;
    z-index: 1000;
    transition: left 0.25s;
    .toggleNavCollapse {
        display: inline-block;
        margin-left: 8px;
        padding: 0 10px;
        font-size: 26px;
        vertical-align: middle;
        color: #333;
        cursor: pointer;
        transition: all 0.5s;
        &.active {
            transform: rotate(90deg);
        }
    }

    .aside__top--right {
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
            &.email {
                i {
                    position: absolute;
                    left: 18px;
                    top: -12px;
                    border-radius: 20px;
                    background: red;
                    color: #fff;
                    text-align: center;
                    font-size: 12px;
                    line-height: 1.5;
                    min-width: 20px;
                    min-height: 20px;
                }
            }
            &.user-msg {
                .user-img {
                    width: 34px;
                    height: 34px;
                    border-radius: 50%;
                    vertical-align: middle;
                }
                .user-name {
                    color: #758eb5;
                    padding: 0 4px;
                }
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
