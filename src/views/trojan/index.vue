<template>
  <div :style="mainStyle">
    <el-form :inline="true" style="margin-top: 15px">
        <el-form-item>
            <el-button-group>
                <el-button type="primary" :icon="Refresh" @click="update()">{{ textShow($t('update')) }}</el-button>
                <el-button type="primary" :icon="VideoPlay" @click="start()">{{ textShow($t('start')) }}</el-button>
                <el-button type="primary" :icon="VideoPause" @click="stop()">{{ textShow($t('stop')) }}</el-button>
                <el-button type="primary" :icon="RefreshRight" @click="restart()">{{ textShow($t('restart')) }}</el-button>
            </el-button-group>
        </el-form-item>
        <el-form-item :label="$t('type')">
            <el-select v-model="type" :placeholder="$t('choice')" filterable @change="trojanSwitch()" style="width: 110px;">
            <el-option
                v-for="item in typeOptions"
                :key="item.label"
                :label="item.label"
                :value="item.label">
            </el-option>
            </el-select>
        </el-form-item>
        <el-form-item :label="$t('loglevel')">
            <el-select v-model="loglevel" :placeholder="$t('choice')" filterable @change="setLoglevel()" style="width: 110px;">
            <el-option
                v-for="item in loglevelOptions"
                :key="item.label"
                :label="item.label"
                :value="item.value">
            </el-option>
            </el-select>
        </el-form-item>
        <el-form-item :label="$t('line')">
            <el-select v-model="line" :placeholder="$t('choice')" filterable @change="getLog()" style="width: 110px;">
            <el-option
                v-for="item in logLineOptions"
                :key="item.label"
                :label="item.label"
                :value="item.value">
            </el-option>
            </el-select>
        </el-form-item>
        <el-form-item :label="$t('latest')">
            <el-switch v-model="isFollow"></el-switch>
        </el-form-item>
    </el-form>
    <textarea id="logshow" readonly="readonly" class="el-textarea__inner"></textarea>
  </div>
</template>

<script>
import store from '@/store/index.js'
import { mapState } from 'vuex'
import { version } from '@/api/common'
import { Refresh, VideoPlay, VideoPause, RefreshRight } from '@element-plus/icons-vue'
import { start, stop, restart, update, getLoglevel, setLoglevel, trojanSwitch } from '@/api/trojan'
export default {
    setup() {
        return {
            Refresh,
            VideoPlay,
            VideoPause,
            RefreshRight
        }
    },
    data() {
        return {
            timer: null,
            isFollow: true,
            ws: null,
            scrollHeight: 0,
            fontSize: 13,
            mainStyle: {
                height: 0
            },
            typeOptions: [
                {
                    label: 'trojan'
                },
                {
                    label: 'trojan-go'
                }
            ],
            loglevelOptions: [
                {
                    label: 'ALL',
                    value: 0
                },
                {
                    label: 'INFO',
                    value: 1
                },
                {
                    label: 'WARN',
                    value: 2
                },
                {
                    label: 'ERROR',
                    value: 3
                },
                {
                    label: 'FATAL',
                    value: 4
                },
                {
                    label: 'OFF',
                    value: 5
                }
            ],
            logLineOptions: [
                {
                    label: '100',
                    value: 100
                },
                {
                    label: '300',
                    value: 300
                },
                {
                    label: '1000',
                    value: 1000
                },
                {
                    label: '5000',
                    value: 5000
                },
                {
                    label: this.$t('all'),
                    value: -1
                }
            ]
        }
    },
    mounted() {
        this.$store.commit('SET_NOERROR', true)
        this.mainStyle.height = (document.body.clientHeight - 85) + 'px'
        window.onresize = () => {
            this.mainStyle.height = (document.body.clientHeight - 85) + 'px'
        }
        const textarea = document.getElementById('logshow')
        // 监听这个dom的scroll事件
        textarea.addEventListener('scroll', () => {
            if (textarea.scrollHeight > textarea.clientHeight && textarea.scrollTop < this.scrollHeight) {
                this.isFollow = false
            } else {
                this.isFollow = true
            }
        }, true)
        this.getLog()
        this.getLoglevel()
        this.getTrojanType()
    },
    computed: {
        ...mapState(['line', 'loglevel', 'type', 'dialogWidth']),
        line: {
            get() {
                return this.$store.state.line
            },
            set(val) {
                this.$store.commit('SET_LINE', val)
            }
        },
        loglevel: {
            get() {
                return this.$store.state.loglevel
            },
            set(val) {
                this.$store.commit('SET_LOGLEVEL', val)
            }
        },
        type: {
            get() {
                return this.$store.state.type
            },
            set(val) {
                this.$store.commit('SET_TYPE', val)
            }
        }
    },
    unmounted() {
        this.$store.commit('SET_NOERROR', false)
        clearInterval(this.timer)
        this.timer = null
        this.ws.close()
    },
    methods: {
        textShow(text) {
            if (this.dialogWidth === '80%') {
                return ''
            } else {
                return text
            }
        },
        async setLoglevel() {
            try {
                const formData = new FormData()
                formData.set('level', this.loglevel)
                const result = await setLoglevel(formData)
                if (result.Msg === 'success') {
                    this.$message({
                        message: this.$t('trojan.loglevelSuccess'),
                        type: 'success'
                    })
                }
            } catch (e) {
                this.getLog()
            }
        },
        async getLoglevel() {
            const result = await getLoglevel()
            if (result.Msg === 'success') {
                this.loglevel = result.Data.loglevel
            } else {
                this.$message.error(result.Msg)
            }
        },
        async getTrojanType() {
            const result = await version()
            if (result.Msg === 'success') {
                this.type = result.Data.trojanType
            } else {
                this.$message.error(result.Msg)
            }
        },
        async start() {
            try {
                const result = await start()
                if (result.Msg === 'success') {
                    this.$message({
                        message: this.$t('trojan.startSuccess'),
                        type: 'success'
                    })
                }
            } catch (e) {
                this.getLog()
            }
        },
        async stop() {
            const result = await stop()
            if (result.Msg === 'success') {
                this.$message({
                    message: this.$t('trojan.stopSuccess'),
                    type: 'success'
                })
            }
        },
        async restart() {
            try {
                const result = await restart()
                if (result.Msg === 'success') {
                    this.$message({
                        message: this.$t('trojan.restartSuccess'),
                        type: 'success'
                    })
                }
            } catch (e) {
                this.getLog()
            }
        },
        async update() {
            try {
                const result = await update()
                if (result.Msg === 'success') {
                    this.$message({
                        message: this.$t('trojan.updateSuccess'),
                        type: 'success'
                    })
                }
            } catch (e) {
                this.getLog()
            }
        },
        async trojanSwitch() {
            try {
                const formData = new FormData()
                formData.set('type', this.type)
                const result = await trojanSwitch(formData)
                if (result.Msg === 'success') {
                    this.$message({
                        message: this.$t('trojan.switchSuccess'),
                        type: 'success'
                    })
                } else {
                    this.$message.error(result.Msg)
                }
            } catch (e) {
                this.getLog()
                this.$message({
                    message: this.$t('trojan.switchSuccess'),
                    type: 'success'
                })
            }
        },
        getLog() {
            this.isFollow = true
            if (this.ws != null) {
                this.ws.close()
                clearInterval(this.timer)
                this.timer = null
            }
            const textarea = document.getElementById('logshow')
            textarea.innerText = ''
            const prefix = process.env.NODE_ENV === 'production' ? '' : '/ws'
            const protocol = document.location.protocol === 'http:' ? 'ws' : 'wss'
            this.ws = new WebSocket(`${protocol}://${location.host}${prefix}/trojan/log?line=${this.line}&token=${store.state.UserToken}`)
            this.ws.onopen = function () {
                console.log('ws connected!')
            }
            this.ws.onmessage = function(e) {
                textarea.append(e.data)
            }
            this.ws.onerror = function(e) {
                console.log('ws error: ' + e)
            }
            this.ws.onclose = function() {
                console.log('ws closed')
            }
            textarea.scrollTop = textarea.scrollHeight
            this.scrollHeight = textarea.scrollTop
            this.timer = setInterval(() => {
                if (this.isFollow) {
                    textarea.scrollTop = textarea.scrollHeight
                    this.scrollHeight = textarea.scrollTop
                }
            }, 1000)
            // detect available wheel event
            // 各个厂商的高版本浏览器都支持"wheel"
            // Webkit 和 IE一定支持"mousewheel"
            // "DOMMouseScroll" 用于低版本的firefox
            const wheelSupport = 'onwheel' in document.createElement('div') ? 'wheel' : document.onmousewheel !== undefined ? 'mousewheel' : 'DOMMouseScroll'
            const logshow = document.getElementById('logshow')
            logshow.addEventListener(wheelSupport, (e) => {
                if (e.ctrlKey) {
                    e.preventDefault()
                    if (e.deltaY < 0) {
                        logshow.style.fontSize = ++this.fontSize + 'px'
                    } else {
                        logshow.style.fontSize = --this.fontSize + 'px'
                    }
                }
            }, { passive: false })
        }
    }
}
</script>

<style lang="scss" scoped>
#logshow {
    width: 100%;
    height: 92%;
    padding: 10px;
    background-color: black;
    color:white;
    font-size: 13px;
    cursor: auto;
}
</style>