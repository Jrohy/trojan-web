const path = require('path')

function resolve(dir) {
    return path.join(__dirname, dir)
}
const proxyTargetMap = {
    prod: 'https://xxx.xxx.com/',
    dev: 'https://xxoox.club'
}
const proxyTarget = proxyTargetMap[process.env.API_TYPE] || proxyTargetMap.prod
const wsTarget = proxyTarget.replace('http', 'ws')
const publicPath = process.env.NODE_ENV === 'production' ? '/' : '/'
module.exports = {
    publicPath: publicPath,
    outputDir: 'dist',

    // 放置静态资源的地方 (js/css/img/font/...)
    assetsDir: 'static',

    // 是否在保存的时候使用 `eslint-loader` 进行检查。
    // 有效的值：`ture` | `false` | `"error"`
    // 当设置为 `"error"` 时，检查出的错误会触发编译失败。
    lintOnSave: true,

    // 使用带有浏览器内编译器的完整构建版本
    // 查阅 https://cn.vuejs.org/v2/guide/installation.html#运行时-编译器-vs-只包含运行时
    // compiler: false,

    // babel-loader 默认会跳过 node_modules 依赖。
    // 通过这个选项可以显式转译一个依赖。
    transpileDependencies: [
        /* string or regex */
    ],

    // 是否为生产环境构建生成 source map？
    productionSourceMap: false,

    // 调整内部的 webpack 配置。
    // 查阅 https://github.com/vuejs/vue-docs-zh-cn/blob/master/vue-cli/webpack.md
    chainWebpack: config => {
        // 移除 prefetch 插件,解决组件懒加载失效的问题
        config.plugins.delete('prefetch')
        // 用cdn方式引入
        config.externals({
            vue: 'Vue',
            vuex: 'Vuex',
            'vue-i18n': 'VueI18n',
            'vue-router': 'VueRouter',
            axios: 'axios',
            'crypto-js': 'CryptoJS',
            'dayjs': 'dayjs',
            'qrcodejs2': 'QRCode',
            'nprogress': 'NProgress',
            'element-ui': 'ELEMENT',
            en: 'ELEMENT.lang.en',
            'zh-cn': 'ELEMENT.lang.zhCN'
        })
        // 添加新的svg-sprite-loader处理svgIcon
        config.module
            .rule('svgIcon')
            .test(/\.svg$/)
            .include.add(resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .tap(options => {
                options = {
                    symbolId: 'icon-[name]'
                }
                return options
            })

        // 原有的svg图像处理loader添加exclude
        config.module
            .rule('svg')
            .exclude.add(resolve('src/icons'))
            .end()
    },

    // 在生产环境下为 Babel 和 TypeScript 使用 `thread-loader`
    // 在多核机器下会默认开启。
    parallel: require('os').cpus().length > 1,

    // PWA 插件的选项。
    // 查阅 https://github.com/vuejs/vue-docs-zh-cn/blob/master/vue-cli-plugin-pwa/README.md
    pwa: {},

    // 配置 webpack-dev-server 行为。
    devServer: {
        disableHostCheck: false,
        open: process.platform === 'darwin',
        host: 'localhost',
        port: 8324,
        https: false,
        hotOnly: false,
        // eslint-disable-next-line no-dupe-keys
        open: true,
        // 查阅 https://github.com/vuejs/vue-docs-zh-cn/blob/master/vue-cli/cli-service.md#配置代理
        proxy: {
            '/api': {
                target: proxyTarget,
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            },
            '/ws': {
                target: wsTarget,
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/ws': ''
                }
            }
        },
        before: app => {}
    },
    // eslint-disable-next-line no-dupe-keys
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            // 为生产环境修改配置...
            // 去除console.log、debugger等调试代码
            config.optimization.minimizer[0].options.terserOptions.compress.warnings = false
            config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
            config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true
            config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = ['console.log']
        } else {
            // 为开发环境修改配置...
        }
    },

    // 第三方插件的选项
    pluginOptions: {}
}
