import path, { resolve } from 'path'
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import viteSvgIcons from 'vite-plugin-svg-icons'
import externalGlobals from 'rollup-plugin-external-globals'

export default defineConfig(({ command }) => {

    const proxyTarget = 'http://xxooo.online'

    let vueI18n = {}

    if (command === "serve") {
        vueI18n["vue-i18n"] = "vue-i18n/dist/vue-i18n.cjs.js" //解决dev运行警告You are running the esm-bundler build of vue-i18n.
    }

    return {
        base: "./",
        define: {
            'process.platform': null,
            'process.version': null
        },
        plugins: [
            vue(),
            viteSvgIcons({
                // 指定需要缓存的图标文件夹（可以配置多个）
                iconDirs: [path.resolve(process.cwd(), 'src/icons/svg')],
                // 指定symbolId格式
                symbolId: 'icon-[name]'
            })
        ],
        resolve: {
            alias: {
                '~': resolve(__dirname, './'),
                '@': resolve(__dirname, 'src'),
                ...vueI18n
            },
            extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.vue', '.mjs']
        },
        server: {
            host: "127.0.0.1",
            port: 5173,
            open: true,
            // 反向代理
            proxy: {
                "/api": {
                    target: proxyTarget,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, "")
                },
                "/ws": {
                    target: proxyTarget,
                    changeOrigin: true,
                    ws: true,
                    rewrite: (path) => path.replace(/^\/ws/, "")
                },
            }
        },
        build: {
            assetsDir: 'static',
            minify: 'terser',
            terserOptions: {
                compress: {
                    drop_console: true,
                    drop_debugger: true
                }
            },
            rollupOptions:{
                external: ['vue', 'vuex', 'vue-i18n', 'vue-router', 'element-plus',
                'axios', 'crypto-js', 'dayjs', 'easyqrcodejs', 'nprogress'],
                plugins: [
                    externalGlobals({
                        vue: 'Vue',
                        vuex: 'Vuex',
                        'vue-i18n': 'VueI18n',
                        'vue-router': 'VueRouter',
                        axios: 'axios',
                        'crypto-js': 'CryptoJS',
                        'dayjs': 'dayjs',
                        'easyqrcodejs': 'QRCode',
                        'nprogress': 'NProgress',
                        'element-plus': 'ElementPlus'
                    }),
                ]
            }
        }
    }
})