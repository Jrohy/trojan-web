<template>
  <div :style="mainStyle">
    <el-form :inline="true" style="padding:15px 0 0 0;">
        <el-form-item  size="small">
            <el-button-group>
                <el-button type="primary" icon="el-icon-refresh" @click="update()">更新</el-button>
                <el-button type="primary" icon="el-icon-video-play" @click="start()">启动</el-button>
                <el-button type="primary" icon="el-icon-video-pause" @click="stop()">停止</el-button>
                <el-button type="primary" icon="el-icon-refresh-right" @click="restart()">重启</el-button>
            </el-button-group>
        </el-form-item>
        <el-form-item  size="small" label="日志等级">
            <el-select size="mini" v-model="loglevel" placeholder="请选择" filterable @change="setLoglevel()" style="width: 120px;">
            <el-option
                v-for="item in loglevelOptions"
                :key="item.label"
                :label="item.label"
                :value="item.value">
            </el-option>
            </el-select>
        </el-form-item>
        <el-form-item  size="small" label="初始行数">
            <el-select size="mini" v-model="line" placeholder="请选择" filterable @change="getLog()" style="width: 120px;">
            <el-option
                v-for="item in logLineOptions"
                :key="item.label"
                :label="item.label"
                :value="item.value">
            </el-option>
            </el-select>
        </el-form-item>
        <el-form-item  size="small" label="最新日志">
            <el-switch v-model="isFollow"></el-switch>
        </el-form-item>
    </el-form>
    <textarea id="logshow" readonly="readonly" style="width:100%; height:100%; background-color: black; color:white;" class="el-textarea__inner"></textarea>
  </div>
</template>

<script>
import store from '@/store/index.js'
import { mapState } from 'vuex'
import { start, stop, restart, update, getLoglevel, setLoglevel } from '@/api/trojan'
export default {
    data() {
        return {
            queue: [],
            timer: null,
            isFollow: true,
            ws: null,
            scrollHeight: 0,
            mainStyle: {
                height: 0
            },
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
                    label: '所有',
                    value: -1
                }
            ]
        }
    },
    mounted() {
        this.$store.commit('SET_NOERROR', true)
        this.mainStyle.height = (document.body.clientHeight - 130) + 'px'
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
    },
    computed: {
        ...mapState(['line', 'loglevel']),
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
        }
    },
    destroyed() {
        this.$store.commit('SET_NOERROR', false)
        clearInterval(this.timer)
        this.timer = null
        this.ws.close()
    },
    methods: {
        async setLoglevel() {
            try {
                let formData = new FormData()
                formData.set('level', this.loglevel)
                let result = await setLoglevel(formData)
                if (result.Msg === 'success') {
                    this.$message({
                        message: `设置日志等级成功!`,
                        type: 'success'
                    })
                }
            } catch (e) {
                this.getLog()
            }
        },
        async getLoglevel() {
            let result = await getLoglevel()
            if (result.Msg === 'success') {
                this.loglevel = result.Data.loglevel
            } else {
                this.$message.error(result.Msg)
            }
        },
        async start() {
            try {
                let result = await start()
                if (result.Msg === 'success') {
                    this.$message({
                        message: `启动trojan成功!`,
                        type: 'success'
                    })
                }
            } catch (e) {
                this.getLog()
            }
        },
        async stop() {
            let result = await stop()
            if (result.Msg === 'success') {
                this.$message({
                    message: `停止trojan成功!`,
                    type: 'success'
                })
            }
        },
        async restart() {
            try {
                let result = await restart()
                if (result.Msg === 'success') {
                    this.$message({
                        message: `重启trojan成功!`,
                        type: 'success'
                    })
                }
            } catch (e) {
                this.getLog()
            }
        },
        async update() {
            try {
                let result = await update()
                if (result.Msg === 'success') {
                    this.$message({
                        message: `更新trojan成功!`,
                        type: 'success'
                    })
                }
            } catch (e) {
                this.getLog()
            }
        },
        getLog() {
            this.isFollow = true
            let self = this
            if (this.ws != null) {
                this.ws.close()
                clearInterval(this.timer)
                this.timer = null
                this.queue = []
            }
            const textarea = document.getElementById('logshow')
            textarea.innerText = ''
            let prefix = process.env.NODE_ENV === 'production' ? '/' : '/ws'
            let protocol = document.location.protocol === 'http:' ? 'ws' : 'wss'
            this.ws = new WebSocket(`${protocol}://${location.host}${prefix}/trojan/log?line=${this.line}&token=${store.state.UserToken}`)
            this.ws.onopen = function () {
                console.log('ws connected!')
            }
            this.ws.onmessage = function(e) {
                self.queue.push(e.data)
            }
            this.ws.onerror = function(e) {
                console.log('ws error: ' + e)
            }
            this.ws.onclose = function(e) {
                console.log('ws closed')
            }
            let firstRun = true
            this.timer = setInterval(() => {
                let message = ''
                while (this.queue.length > 0) {
                    message = message + this.queue.shift()
                }
                textarea.append(message)
                if (firstRun) {
                    textarea.scrollTop = textarea.scrollHeight
                    this.scrollHeight = textarea.scrollTop
                    firstRun = !firstRun
                }
                if (this.isFollow) {
                    textarea.scrollTop = textarea.scrollHeight
                    this.scrollHeight = textarea.scrollTop
                }
            }, 1000)
        }
    }
}
</script>
