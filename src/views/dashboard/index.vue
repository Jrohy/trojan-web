<template>
   <div>
    <el-row v-if="isAdmin">
        <el-col :span='24'>
            <el-card shadow="hover">
                <el-row>
                    <el-col :sm="24" :md="12">
                        <el-row>
                            <el-col :span="12" style="text-align: center">
                                <el-progress type="dashboard" :percentage="cpu.percentage" :color="cpu.color"></el-progress>
                                <div>CPU</div>
                            </el-col>
                            <el-col :span="12" style="text-align: center">
                                <el-progress type="dashboard" :percentage="memory.percentage" :color="memory.color"></el-progress>
                                <div>{{ $t('dashboard.memory') }}: {{memory.used}}/{{memory.total}}</div>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :sm="24" :md="12">
                        <el-row>
                            <el-col :span="12" style="text-align: center">
                                <el-progress type="dashboard" :percentage="swap.percentage" :color="swap.color"></el-progress>
                                <div>swap: {{swap.used}}/{{swap.total}}</div>
                            </el-col>
                            <el-col :span="12" style="text-align: center">
                                <el-progress type="dashboard" :percentage="disk.percentage" :color="disk.color"></el-progress>
                                <div>{{ $t('dashboard.disk') }}: {{disk.used}}/{{disk.total}}</div>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </el-card>
        </el-col>
    </el-row>
    <el-row>
        <el-col :sm="24" :md="12">
            <el-card class="home-card" shadow="hover">
                <el-row>
                    <el-col :span="10">
                        <b>{{ $t('dashboard.trojanVersion') }}: </b>
                    </el-col>
                    <el-col :span="12" style="padding-top:1px">
                        {{ trojanVersion }}
                    </el-col>
                </el-row>
            </el-card>
        </el-col>
        <el-col :sm="24" :md="12">
            <el-card class="home-card" shadow="hover">
                <el-row>
                    <el-col :span="10">
                        <b>{{ $t('dashboard.trojanUser') }}:</b>
                    </el-col>
                    <el-col :span="12" style="padding-top:1px">
                        <el-link type='primary' @click.native="navigate('/user')">{{ userList.length }}</el-link>
                    </el-col>
                </el-row>
            </el-card>
        </el-col>
    </el-row>
    <el-row>
        <el-col :sm="24" :md="12">
            <el-card class="home-card" shadow="hover">
                <el-row>
                    <el-col :span="10">
                        <b>{{ $t('dashboard.trojanRuntime') }}:</b>
                    </el-col>
                    <el-col :span="12"  style="padding-top:1px">
                        {{ trojanRuntime }}
                    </el-col>
                </el-row>
            </el-card>
        </el-col>
        <el-col :sm="24" :md="12" v-if="isAdmin">
            <el-card class="home-card" shadow="hover">
                <el-row>
                    <el-col :span="10">
                        <b>{{ $t('dashboard.load') }}:</b>
                    </el-col>
                    <el-tooltip class="item" effect="dark" content="load1, load5, load15" placement="left-end">
                        <el-col :span="12" style="padding-top:1px">
                            {{ load }}
                        </el-col>
                    </el-tooltip>
                </el-row>
            </el-card>
        </el-col>
    </el-row>
    <el-row style="margin-top:10px">
        <el-col :span='7'>
            <el-card shadow="hover">
                <i v-if="iconShow" :class="uploadIcon" class="home-icon"></i>
                {{ $t('dashboard.upload') }}:
                <el-tag effect="dark" size="mini" type="success">{{ uploadData }}</el-tag>
            </el-card>
        </el-col>
        <el-col :span='7' :offset='1'>
            <el-card shadow="hover">
                <i v-if="iconShow" :class="downloadIcon" class="home-icon"></i>
                {{ $t('dashboard.download') }}:
                <el-tag effect="dark" size="mini" type="success">{{ downloadData }}</el-tag>
            </el-card>
        </el-col>
        <el-col :span='7' :offset='1'>
            <el-card shadow="hover">
                <i v-if="iconShow" :class="totalIcon" class="home-icon"></i>
                {{ $t('dashboard.total') }}:
                <el-tag effect="dark" size="mini" type="success">{{ totalData }}</el-tag>
            </el-card>
        </el-col>
    </el-row>
   </div>
</template>

<script>
import { version, serverInfo } from '@/api/common'
import { userList } from '@/api/user'
import { readablizeBytes } from '@/utils/common'
import { mapState } from 'vuex'

export default {
    data() {
        return {
            timer: null,
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
            ],
            cpu: { percentage: 0, color: '' },
            memory: { percentage: 0, used: 0, total: 0, color: '' },
            swap: { percentage: 0, used: 0, total: 0, color: '' },
            disk: { percentage: 0, used: 0, total: 0, color: '' },
            load: ''
        }
    },
    computed: {
        ...mapState(['isAdmin'])
    },
    created() {
        this.setOffset()
        this.getVersion()
        this.getUserList()
        this.randomIcon()
    },
    mounted() {
        this.$store.commit('SET_NPROGRESS', false)
        if (this.isAdmin) {
            this.getServerInfo()
        }
        this.timer = setInterval(() => {
            if (this.isAdmin) {
                this.getServerInfo()
            }
            this.getVersion()
            this.getUserList()
        }, 6000)
        window.onresize = () => {
            return (() => {
                this.setOffset()
            })()
        }
    },
    destroyed() {
        this.$store.commit('SET_NPROGRESS', true)
        clearInterval(this.timer)
    },
    methods: {
        randomIcon() {
            const size = this.foodIcon.length
            this.downloadIcon = 'el-icon-' + this.foodIcon[Math.floor(Math.random() * size)]
            this.uploadIcon = 'el-icon-' + this.foodIcon[Math.floor(Math.random() * size)]
            this.totalIcon = 'el-icon-' + this.foodIcon[Math.floor(Math.random() * size)]
        },
        setOffset() {
            const clientWith = document.body.clientWidth
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
        getServerInfo() {
            serverInfo().then((res) => {
                const data = res.Data
                this.cpu.percentage = parseFloat(data.cpu[0].toFixed(2))
                this.cpu.color = this.computeColor(this.cpu.percentage)
                this.memory = this.computePercent(data.memory)
                this.swap = this.computePercent(data.swap)
                this.disk = this.computePercent(data.disk)
                this.load = data.load.load1 + ', ' + data.load.load5 + ', ' + data.load.load15
            })
        },
        computePercent(data) {
            const percent = parseFloat(data.usedPercent.toFixed(2))
            return {
                percentage: percent,
                used: readablizeBytes(data.used),
                total: readablizeBytes(data.total),
                color: this.computeColor(percent)
            }
        },
        computeColor(percent) {
            if (percent < 80) {
                return '#67C23A'
            } else if (percent < 90) {
                return '#E6A23C'
            } else {
                return '#F56C6C'
            }
        },
        async getUserList() {
            const result = await userList()
            if (result.Msg === 'success') {
                const data = result.Data
                this.userList = data.userList
                let download = 0; let upload = 0
                for (let i = 0; i < this.userList.length; i++) {
                    download += this.userList[i].Download
                    upload += this.userList[i].Upload
                }
                this.downloadData = readablizeBytes(download)
                this.uploadData = readablizeBytes(upload)
                this.totalData = readablizeBytes(download + upload)
            } else {
                this.$message.error(result.Msg)
            }
        },
        async getVersion() {
            const result = await version()
            const data = result.Data
            this.trojanVersion = data.trojanVersion
            this.trojanRuntime = this.parseRuntime(data.trojanRuntime)
        },
        parseRuntime(runtime) {
            let result = ''
            if (runtime.indexOf('-') !== -1) {
                const splitInfo = runtime.split('-')
                result += splitInfo[0] + `${this.$t('dashboard.day')} `
                const timeInfo = splitInfo[1].split(':')
                result += timeInfo[0] + `${this.$t('dashboard.hour')} `
                result += timeInfo[1] + `${this.$t('dashboard.minute')} `
                result += timeInfo[2] + `${this.$t('dashboard.second')} `
            } else {
                const splitInfo = runtime.split(':')
                if (splitInfo.length === 3) {
                    result += splitInfo[0] + `${this.$t('dashboard.hour')} `
                    result += splitInfo[1] + `${this.$t('dashboard.minute')} `
                    result += splitInfo[2] + `${this.$t('dashboard.second')} `
                } else if (splitInfo.length === 2) {
                    result += splitInfo[0] + `${this.$t('dashboard.minute')} `
                    result += splitInfo[1] + `${this.$t('dashboard.second')} `
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
.home-card {
    // margin-top:10px;
    padding:3px;
}
</style>
