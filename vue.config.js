const path = require('path');
module.exports = {
  // 设置打包文件相对路径
  publicPath: './',
  devServer: {
    proxy: {
      '/api': {
        target: 'https://test-event.uniqlo.cn/uniqlo_uat_cms',
        ws: true,  
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/imgapi': {
        target: 'https://uatpic.uniqlo.cn/uniqlo',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/imgapi': ''
        }
      },
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src/'), // 路径重写
        '@@': path.resolve(__dirname, './src/assets/')
      }
    }
  },
  css: {
    // css预设器配置项
    loaderOptions: {
      css: {},
      postcss: {
        plugins: [
          require('postcss-px2rem')({ // px单位转为rem单位，移动端等比缩放适配
            remUnit: 37.5
          })
        ]
      }
    },
    // 启用 CSS modules for all css / pre-processor files.
    modules: false,
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // 开启 CSS source maps?
    sourceMap: false
  },
  // 生产环境生产sm文件
  productionSourceMap: true,
  chainWebpack:config => {
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type))) // 全局引用less文件
  },
}
// 全局导入less基础样式
function addStyleResource (rule) {
  rule
    .use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        // 需要全局导入的less
        path.resolve(__dirname, './src/assets/less/base.less')
      ]
    })
}