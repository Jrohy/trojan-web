<template>
  <div>
    <el-form :inline="true" label-width="80px" style="height: 29px;">
    <el-form-item size="mini">
        <el-button-group>
            <el-button type="primary" icon="el-icon-refresh" @click.native="refresh()">刷新</el-button>
            <el-button type="primary" icon="el-icon-plus" @click.native="addUserVisible=true">添加</el-button>
            <el-button type="primary" icon="el-icon-refresh-left" @click.native="handlePatchRestart()">重置流量</el-button>
            <el-button type="danger" icon="el-icon-delete" @click.native="patchButton=true;deleteVisible=true">删除</el-button>
        </el-button-group>
    </el-form-item>
    </el-form>
    <el-table
    :data="dataList" style="width: 100%" :height="clientHeight" @selection-change="handleSelectionChange">
        <el-table-column
        type="selection"
        width="55">
        </el-table-column>
        <el-table-column
        label="用户名"
        prop="Username"
        >
        </el-table-column>
        <el-table-column
        label="密码"
        prop="Password">
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
        fixed="right"
        label="操作"
        width="140">
        <template slot-scope="scope">
            <el-dropdown  size="mini" split-button type="text">
                编辑
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="userItem=scope.row; quotaVisible=true">限制流量</el-dropdown-item>
                    <el-dropdown-item>重置流量</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-button
            size="mini"
            type="text"
            >分享</el-button>
            <el-button
            size="mini"
            type="text"
            @click.native="userItem=scope.row;deleteVisible=true"
            >删除</el-button>
        </template>
        </el-table-column>
    </el-table>
    <el-dialog title="新增trojan用户" :visible.sync="addUserVisible" :width="dialogWidth">
        <el-input type="text" v-model="addUser.username" placeholder="输入用户名"/>
        <el-input type="text" v-model="addUser.password" placeholder="输入密码"/>
        <div slot="footer" class="dialog-footer">
            <el-button @click="addUserVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleAddUser()">确 定</el-button>
        </div>
    </el-dialog>
    <el-dialog :title="deleteText" :visible.sync="deleteVisible" :width="dialogWidth">
        {{ deleteUser }}
        <div slot="footer" class="dialog-footer">
            <el-button @click="deleteVisible = false">取 消</el-button>
            <el-button type="primary" @click="deleteVisible = false; patchButton ? handlePatchDelete(): handleDelete()">确 定</el-button>
        </div>
    </el-dialog>
    <el-dialog :title="quotaText" :visible.sync="quotaVisible" :width="dialogWidth">
        <el-input-number v-model="quota" :min="0" :precision="0" size="mini"></el-input-number>
        <el-select v-model="quotaUnit" placeholder="请选择" size="mini" style="margin-left: 5px; width:80px">
            <el-option
            v-for="item in quotaOptions"
            :key="item.value"
            :label="item.value"
            :value="item.value">
            </el-option>
        </el-select>
        <div slot="footer" class="dialog-footer">
            <el-button @click="quotaVisible = false">取 消</el-button>
            <el-button type="primary" @click="quotaVisible = false; handleSetQuota()">确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import { userList, addUser, delUser } from '@/api/user'
import { setQuota } from '@/api/data'
import { readablizeBytes } from '@/utils/common'
import { mapState } from 'vuex'
export default {
    data() {
        return {
            domain: '',
            dataList: [],
            multipleSelection: [],
            clientHeight: 0,
            addUserVisible: false,
            deleteVisible: false,
            quotaVisible: false,
            patchButton: false,
            userItem: null,
            quota: 0,
            quotaUnit: 'MB',
            quotaOptions: [
                {
                    value: 'MB'
                },
                {
                    value: 'GB'
                }
            ],
            addUser: {
                username: '',
                password: ''
            }
        }
    },
    computed: {
        ...mapState(['dialogWidth']),
        deleteText: function() {
            if (this.patchButton) {
                return '确定批量删除以下用户?'
            } else if (this.userItem !== null) {
                return '确定删除用户 ' + this.userItem.Username + ' ?'
            } else {
                return ''
            }
        },
        deleteUser: function() {
            if (this.patchButton) {
                let result = ''
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    result += ', ' + this.multipleSelection[i].Username
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
        this.clientHeight = document.body.clientHeight - 90
    },
    methods: {
        handleSelectionChange(val) {
            this.multipleSelection = val
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
        async handleSetQuota() {
            if (this.quotaUnit === 'MB') {
                this.quota = this.quota * 1024 * 1024
            } else if (this.quotaUnit === 'GB') {
                this.quota = this.quota * 1024 * 1024 * 1024
            }
            let formData = new FormData()
            formData.set('id', this.userItem.ID)
            formData.set('quota', this.quota)
            let result = await setQuota(formData)
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
        async handlePatchDelete() {
            for (let i = 0; i < this.multipleSelection.length; i++) {
                this.userItem = this.multipleSelection[i]
                let result = await delUser(this.userItem.ID)
                if (result.Msg === 'success') {
                    this.$message({
                        message: `删除用户${this.userItem.Username}成功!`,
                        type: 'success'
                    })
                    this.userItem = null
                } else {
                    this.$message.error(result.Msg)
                }
            }
            this.patchButton = false
            this.refresh()
        },
        async handleDelete() {
            let result = await delUser(this.userItem.ID)
            if (result.Msg === 'success') {
                this.$message({
                    message: `删除用户${this.userItem.Username}成功!`,
                    type: 'success'
                })
            } else {
                this.$message.error(result.Msg)
            }
            this.refresh()
        },
        async handleAddUser() {
            if (this.addUser.username === '' || this.addUser.password === '') {
                this.$message.error('用户名或密码不能为空!')
                return
            }
            let formData = new FormData()
            formData.set('username', this.addUser.username)
            formData.set('password', btoa(this.addUser.password))
            let result = await addUser(formData)
            if (result.Msg === 'success') {
                this.$message({
                    message: `新增用户${this.addUser.username}成功!`,
                    type: 'success'
                })
                this.addUser.username = ''
                this.addUser.password = ''
            } else {
                this.$message.error(result.Msg)
            }
            this.addUserVisible = false
            this.refresh()
        },
        refresh() {
            this.dataList = []
            this.domain = ''
            this.getUserList()
        },
        async getUserList() {
            let result = await userList()
            this.dataList = result.Data.userList
            this.domain = result.Data.domain
        }
    }
}
</script>

<style>
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
