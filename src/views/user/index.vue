<template>
  <div>
    <el-form :inline="true" label-width="80px" style="height: 29px;">
    <el-form-item size="mini">
        <el-button-group>
            <el-button type="primary" icon="el-icon-refresh" @click.native="refresh()">刷新</el-button>
            <el-button type="primary" icon="el-icon-plus" @click.native="commonType=2;userInfo.username='';userInfo.password='';userVisible=true" v-if="isAdmin">添加</el-button>
            <el-button type="primary" icon="el-icon-refresh-left" @click.native="copySelection=multipleSelection;patchButton=true;commonType=1;confirmVisible=true" v-if="isAdmin">重置流量</el-button>
            <el-button type="danger" icon="el-icon-delete" @click.native="copySelection=multipleSelection;patchButton=true;commonType=0;confirmVisible=true" v-if="isAdmin">删除</el-button>
        </el-button-group>
    </el-form-item>
    </el-form>
    <el-table
    :data="dataList.filter(data => !search || data.Username.toLowerCase().includes(search.toLowerCase()))" style="width: 100%" :height="clientHeight" @selection-change="handleSelectionChange">
        <el-table-column
        type="selection"
        width="55" v-if="isAdmin">
        </el-table-column>
        <el-table-column
        label="用户名"
        prop="Username"
        >
        </el-table-column>
        <el-table-column
        label="密码"
        :formatter="passwordFormatter">
        </el-table-column>
        <el-table-column
        label="上传流量"
        :formatter="uploadFormatter" :sort-method="uploadSort" sortable>
        </el-table-column>
        <el-table-column
        label="下载流量"
        :formatter="downloadFormatter" :sort-method="downloadSort" sortable>
        </el-table-column>
        <el-table-column
        label="总流量"
        :formatter="totalFormatter" :sort-method="totalSort" sortable>
        </el-table-column>
        <el-table-column
        label="流量限制"
        :formatter="quotaFormatter">
        </el-table-column>
        <el-table-column
        width="170"
        align="center">
        <template slot="header">
            <el-input
                v-model="search"
                size="small"
                placeholder="输入用户名搜索" v-if="isAdmin"/>
            <div v-if="!isAdmin">操作</div>
        </template>
        <template slot-scope="scope">
            <el-dropdown  size="mini" split-button type="text" v-if="isAdmin">
                编辑
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="userItem=scope.row; quotaVisible=true">限制流量</el-dropdown-item>
                    <el-dropdown-item @click.native="userItem=scope.row; commonType=1; patchButton=false; confirmVisible=true">重置流量</el-dropdown-item>
                    <el-dropdown-item @click.native="userItem=scope.row; handelEditUser()">修改账密</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-button
            size="mini"
            type="text"
            @click.native="userItem=scope.row;handleShare()"
            >分享</el-button>
            <el-button
            v-if="isAdmin"
            size="mini"
            type="text"
            @click.native="userItem=scope.row;commonType=0;patchButton=false;confirmVisible=true"
            >删除</el-button>
        </template>
        </el-table-column>
    </el-table>
    <el-dialog :title="commonTitle" :visible.sync="userVisible" :width="dialogWidth">
        <el-input type="text" v-model="userInfo.username" placeholder="输入用户名"/>
        <el-input type="text" v-model="userInfo.password" placeholder="输入密码" @keyup.enter.native="commonType === 2? handleAddUser(): handleUpdateUser()"/>
        <div slot="footer" class="dialog-footer">
            <el-button @click="userVisible = false">取 消</el-button>
            <el-button type="primary" @click="commonType === 2? handleAddUser(): handleUpdateUser()">确 定</el-button>
        </div>
    </el-dialog>
    <el-dialog :title="commonTitle" :visible.sync="confirmVisible" :width="dialogWidth">
        {{ editUser }}
        <div slot="footer" class="dialog-footer">
            <el-button @click="confirmVisible = false;copySelection=[];">取 消</el-button>
            <el-button type="primary" @click="confirmVisible = false; patchButton ? handlePatchOpera(): handleOpera()">确 定</el-button>
        </div>
    </el-dialog>
    <el-dialog :title="quotaText" :visible.sync="quotaVisible" :width="dialogWidth">
        <el-tooltip effect="dark" content="-1代表无流量限制" placement="top">
            <el-input-number v-model="quota" :min="-1" :precision="0" size="mini"></el-input-number>
        </el-tooltip>
        <el-select v-model="quotaUnit" placeholder="请选择" size="mini" style="margin-left: 5px; width:80px">
            <el-option
            v-for="item in quotaOptions"
            :key="item.value"
            :label="item.value"
            :value="item.value">
            </el-option>
        </el-select>
        <div slot="footer" class="dialog-footer">
            <el-button @click="quotaVisible=false">取 消</el-button>
            <el-button type="primary" @click="quotaVisible=false; handleSetQuota()">确 定</el-button>
        </div>
    </el-dialog>
    <el-dialog title="trojan分享链接" :visible.sync="qrcodeVisible" :width="dialogWidth" @close="closeQRCode">
        <div id="qrcode" ref="qrcode" class="qrcodeCenter"></div>
        <p class="qrcodeCenter"> {{ shareLink }} </p>
    </el-dialog>
  </div>
</template>

<script>
import { userList, addUser, delUser, updateUser } from '@/api/user'
import { setQuota, cleanData } from '@/api/data'
import { readablizeBytes, isValidIP } from '@/utils/common'
import { mapState } from 'vuex'
import QRCode from 'qrcodejs2'
export default {
    data() {
        return {
            search: '',
            domain: '',
            shareLink: '',
            dataList: [],
            multipleSelection: [],
            copySelection: [],
            clientHeight: 0,
            userVisible: false,
            confirmVisible: false,
            quotaVisible: false,
            qrcodeVisible: false,
            patchButton: false,
            // 确认框类型: 0删除, 1重置流量, 2新增用户, 3修改用户
            commonType: 0,
            userItem: null,
            quota: -1,
            quotaUnit: 'MB',
            quotaOptions: [
                {
                    value: 'MB'
                },
                {
                    value: 'GB'
                }
            ],
            userInfo: {
                username: '',
                password: ''
            }
        }
    },
    computed: {
        ...mapState(['dialogWidth', 'isAdmin']),
        commonTitle: function() {
            let text = ''
            if (this.commonType === 2) {
                text = '新增trojan用户'
            } else if (this.commonType === 3) {
                text = '修改用户 ' + this.userItem.Username + ' 的用户名和密码'
            } else if (this.commonType === 0) {
                if (this.patchButton) {
                    text = '确定批量删除以下用户?'
                } else if (this.userItem !== null) {
                    text = '确定删除用户 ' + this.userItem.Username + ' ?'
                }
            } else if (this.commonType === 1) {
                if (this.patchButton) {
                    text = '确定重置以下用户流量?'
                } else if (this.userItem !== null) {
                    text = '确定重置用户 ' + this.userItem.Username + ' 的流量?'
                }
            }
            return text
        },
        editUser: function() {
            if (this.patchButton) {
                let result = ''
                for (let i = 0; i < this.copySelection.length; i++) {
                    result += ', ' + this.copySelection[i].Username
                }
                return result.substring(1)
            } else {
                return ''
            }
        },
        quotaText: function() {
            if (this.userItem !== null) {
                return `确定限制用户 ${this.userItem.Username} 的流量?`
            } else {
                return ''
            }
        }
    },
    created() {
        this.refresh()
        this.clientHeight = document.body.clientHeight - 100
    },
    methods: {
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        passwordFormatter(row, column) {
            return atob(row.Password)
        },
        quotaFormatter(row, column) {
            return row.Quota === -1 ? '无' : readablizeBytes(row.Quota)
        },
        uploadFormatter(row, column) {
            return readablizeBytes(row.Upload)
        },
        downloadFormatter(row, column) {
            return readablizeBytes(row.Download)
        },
        totalFormatter(row, column) {
            return readablizeBytes(row.Download + row.Upload)
        },
        uploadSort(a, b) {
            return a.Upload - b.Upload
        },
        downloadSort(a, b) {
            return a.Download - b.Download
        },
        totalSort(a, b) {
            return (a.Download + a.Upload) - (b.Download + b.Upload)
        },
        handleShare() {
            this.shareLink = `trojan://${atob(this.userItem.Password)}@${this.domain}:443`
            this.$nextTick(() => {
                this.createQRCode()
            })
            this.qrcodeVisible = true
        },
        handelEditUser() {
            this.userInfo.username = this.userItem.Username
            this.userInfo.password = atob(this.userItem.Password)
            this.commonType = 3
            this.userVisible = true
        },
        createQRCode() {
            // eslint-disable-next-line
            new QRCode('qrcode', {
                width: 200,
                height: 200,
                text: this.shareLink
            })
        },
        closeQRCode() {
            this.$refs.qrcode.innerHTML = ''
        },
        async handleSetQuota() {
            if (this.quota === -1) {
            } else if (this.quotaUnit === 'MB') {
                this.quota = this.quota * 1024 * 1024
            } else if (this.quotaUnit === 'GB') {
                this.quota = this.quota * 1024 * 1024 * 1024
            }
            const formData = new FormData()
            formData.set('id', this.userItem.ID)
            formData.set('quota', this.quota)
            const result = await setQuota(formData)
            if (result.Msg === 'success') {
                this.$message({
                    message: `设置用户${this.userItem.Username}流量限制成功!`,
                    type: 'success'
                })
                this.userItem = null
            } else {
                this.$message.error(result.Msg)
            }
            this.quota = 0
            this.refresh()
        },
        async handlePatchOpera() {
            let successText = ''
            let result = null
            for (let i = 0; i < this.copySelection.length; i++) {
                this.userItem = this.copySelection[i]
                if (this.commonType === 0) {
                    result = await delUser(this.userItem.ID)
                    successText = `删除用户${this.userItem.Username}成功!`
                } else if (this.commonType === 1) {
                    result = await cleanData(this.userItem.ID)
                    successText = `重置用户${this.userItem.Username}流量成功!`
                }
                if (result.Msg === 'success') {
                    this.$message({
                        message: successText,
                        type: 'success'
                    })
                    this.userItem = null
                } else {
                    this.$message.error(result.Msg)
                }
            }
            this.refresh()
        },
        async handleOpera() {
            let successText = ''
            let result = null
            if (this.commonType === 0) {
                result = await delUser(this.userItem.ID)
                successText = `删除用户${this.userItem.Username}成功!`
            } else if (this.commonType === 1) {
                result = await cleanData(this.userItem.ID)
                successText = `重置用户${this.userItem.Username}流量成功!`
            }
            if (result.Msg === 'success') {
                this.$message({
                    message: successText,
                    type: 'success'
                })
            } else {
                this.$message.error(result.Msg)
            }
            this.refresh()
        },
        async handleUpdateUser() {
            if (this.userInfo.username === '' || this.userInfo.password === '') {
                this.$message.error('用户名或密码不能为空!')
                return
            }
            if (this.userInfo.username === 'admin') {
                this.$message.error('不能创建用户名为admin的用户!')
                return
            }
            const formData = new FormData()
            formData.set('id', this.userItem.ID)
            formData.set('username', this.userInfo.username)
            formData.set('password', btoa(this.userInfo.password))
            const result = await updateUser(formData)
            if (result.Msg === 'success') {
                this.$message({
                    message: `修改用户${this.userInfo.username}成功!`,
                    type: 'success'
                })
                this.userInfo.username = ''
                this.userInfo.password = ''
            } else {
                this.$message.error(result.Msg)
            }
            this.userVisible = false
            this.refresh()
        },
        async handleAddUser() {
            if (this.userInfo.username === '' || this.userInfo.password === '') {
                this.$message.error('用户名或密码不能为空!')
                return
            }
            if (this.userInfo.username === 'admin') {
                this.$message.error('不能创建用户名为admin的用户!')
                return
            }
            const formData = new FormData()
            formData.set('username', this.userInfo.username)
            formData.set('password', btoa(this.userInfo.password))
            const result = await addUser(formData)
            if (result.Msg === 'success') {
                this.$message({
                    message: `新增用户${this.userInfo.username}成功!`,
                    type: 'success'
                })
                this.userInfo.username = ''
                this.userInfo.password = ''
            } else {
                this.$message.error(result.Msg)
            }
            this.userVisible = false
            this.refresh()
        },
        refresh() {
            this.dataList = []
            this.domain = ''
            this.getUserList()
        },
        async getUserList() {
            const result = await userList()
            if (result.Msg === 'success') {
                this.dataList = result.Data.userList
                if (result.Data.domain !== '') {
                    this.domain = result.Data.domain
                } else {
                    const hostname = window.location.hostname
                    if (!isValidIP(hostname)) {
                        this.domain = hostname
                    }
                }
            } else {
                this.$message.error(result.Msg)
            }
        }
    }
}
</script>

<style lang="scss">
.qrcodeCenter {
    margin: 0 auto;
    width: 200px;
}
</style>
