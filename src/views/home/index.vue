<template>
   <div>
    <el-row>
        <el-col :span='24'>
            <el-card>
                <el-row>
                    <el-col :span="7" :offset="keyOffset">
                        <b>trojan 版本</b>
                    </el-col>
                    <el-col :span="10" :offset="valueOffset">
                        {{ trojanVersion }}
                    </el-col>
                </el-row>
                <el-divider></el-divider>
                <el-row>
                    <el-col :span="7" :offset="keyOffset">
                        <b>trojan 用户数</b>
                    </el-col>
                    <el-col :span="10" :offset="valueOffset">
                        <el-link type='primary' @click.native="navigate('/user')">{{ userList.length }}</el-link>
                    </el-col>
                </el-row>
                <el-divider></el-divider>
                <el-row>
                    <el-col :span="7" :offset="keyOffset">
                        <b>trojan 已运行</b>
                    </el-col>
                    <el-col :span="10" :offset="valueOffset">
                        {{ trojanRuntime }}
                    </el-col>
                </el-row>
            </el-card>
        </el-col>
    </el-row>
    <el-row style="margin-top:10px">
        <el-col :span='7'>
            <el-card shadow="hover">
                <i v-if="iconShow" :class="uploadIcon" class="home-icon"></i>
                上传:
                <el-tag effect="dark" size="mini">{{ uploadData }}</el-tag>
            </el-card>
        </el-col>
        <el-col :span='7' :offset='1'>
            <el-card shadow="hover">
                <i v-if="iconShow" :class="downloadIcon" class="home-icon"></i>
                下载:
                <el-tag effect="dark" size="mini">{{ downloadData }}</el-tag>
            </el-card>
        </el-col>
        <el-col :span='7' :offset='1'>
            <el-card shadow="hover">
                <i v-if="iconShow" :class="totalIcon" class="home-icon"></i>
                总流量:
                <el-tag effect="dark" size="mini">{{ totalData }}</el-tag>
            </el-card>
        </el-col>
    </el-row>
   </div>
</template>

<script>
import { version } from '@/api/common'
import { userList } from '@/api/user'
import { readablizeBytes } from '@/utils/common'

export default {
    data() {
        return {
            iconShow: true,
            trojanVersion: '',
            trojanRuntime: '',
            keyOffset: 0,
            valueOffset: 0,
            userList: [],
            downloadIcon: '',
            uploadIcon: '',
            totalIcon: '',
            downloadData: 0,
            uploadData: 0,
            totalData: 0,
            foodIcon: [
                'food',
                'chicken',
                'ice-cream',
                'dessert',
                'sugar',
                'tableware',
                'burger',
                'coffee-cup',
                'cold-drink',
                'goblet-full',
                'grape',
                'watermelon',
                'cherry',
                'apple',
                'pear',
                'orange',
                'coffee',
                'ice-tea',
                'ice-drink',
                'milk-tea',
                'potato-strips',
                'lollipop',
                'ice-cream-square',
                'ice-cream-round'
            ]
        }
    },
    created() {
        this.setOffset()
        this.getVersion()
        this.getUserList()
        this.randomIcon()
    },
    mounted() {
        window.onresize = () => {
            return (() => {
                this.setOffset()
            })()
        }
    },
    methods: {
        randomIcon() {
            let size = this.foodIcon.length
            this.downloadIcon = 'el-icon-' + this.foodIcon[Math.floor(Math.random() * size)]
            this.uploadIcon = 'el-icon-' + this.foodIcon[Math.floor(Math.random() * size)]
            this.totalIcon = 'el-icon-' + this.foodIcon[Math.floor(Math.random() * size)]
        },
        setOffset() {
            let clientWith = document.body.clientWidth
            if (clientWith < 1000) {
                this.keyOffset = 1
                this.valueOffset = 2
                this.iconShow = false
            } else {
                this.keyOffset = 0
                this.valueOffset = 0
                this.iconShow = true
            }
        },
        navigate(path) {
            this.$router.push({ path: path })
        },
        async getUserList() {
            let result = await userList()
            let data = result.Data
            this.userList = data.userList
            let download = 0; let upload = 0
            for (let i = 0; i < this.userList.length; i++) {
                download += this.userList[i].Download
                upload += this.userList[i].Upload
            }
            this.downloadData = readablizeBytes(download)
            this.uploadData = readablizeBytes(upload)
            this.totalData = readablizeBytes(download + upload)
        },
        async getVersion() {
            let result = await version()
            let data = result.Data
            this.trojanVersion = data.trojanVersion
            this.trojanRuntime = this.parseRuntime(data.trojanRuntime)
        },
        parseRuntime(runtime) {
            let result = ''
            if (runtime.indexOf('-') !== -1) {
                let splitInfo = runtime.split('-')
                result += splitInfo[0] + '天 '
                let timeInfo = splitInfo[1].split(':')
                result += timeInfo[0] + '时 '
                result += timeInfo[1] + '分 '
                result += timeInfo[2] + '秒'
            } else {
                let splitInfo = runtime.split(':')
                if (splitInfo.length === 3) {
                    result += splitInfo[0] + '时 '
                    result += splitInfo[1] + '分 '
                    result += splitInfo[2] + '秒'
                } else if (splitInfo.length === 2) {
                    result += splitInfo[0] + '分 '
                    result += splitInfo[1] + '秒'
                }
            }
            return result
        }
    }
}
</script>

<style lang="scss" scoped>
.home-icon {
    font-size: 32px;
    padding: 0;
}
</style>
