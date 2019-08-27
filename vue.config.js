const path = require('path');
const debug = process.env.NODE_ENV !== 'production'
module.exports = {
  // 设置打包文件相对路径
  publicPath: './',
  devServer: {
    proxy: {
      '/api': {
        target: 'https://event.uniqlo.cn/uniqlo_new_cms',
        ws: true,  
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/imgapi': {
        target: 'https://www.uniqlo.cn',
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
      },
    },
  },
  configureWebpack: config => {
    if (debug) {
      // 生产环境生产sm文件,会在source下面生成一个webpack文件里面src是vue源码
      config.devtool = 'source-map';
    } else {
      // 生产环境,抽离公共脚本，样式
      let optimization = {
        splitChunks: {
          cacheGroups: {
            vendor:{
              chunks:"all",
                  test: /node_modules/,
                  name:"vendor",
                  minChunks: 1,
                  maxInitialRequests: 5,
                  minSize: 0,
                  priority:100,
            },
            common: {
              chunks:"all",
              test:/[\\/]src[\\/]js[\\/]/,
              name: "common",
              minChunks: 2,
              maxInitialRequests: 5,
              minSize: 0,
              priority:60
            },
            styles: {
              name: 'styles',
              test: /\.(sa|sc|c|le)ss$/,
              chunks: 'all',
              enforce: true,
            },
            runtimeChunk: {
              name: 'manifest'
            }
          }
        }
      }
      Object.assign(config,{
        optimization
      });
    }
    Object.assign(config, {
      // 开发生产共同配置
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src/'), // 路径重写
          '@@': path.resolve(__dirname, './src/assets/')
        } // 别名配置
      }
    })
  },
  css: {
    // css预设器配置项
    loaderOptions: {
      postcss: {
        plugins: [
          // px单位转为rem单位，移动端等比缩放适配
          require('postcss-px2rem')({ 
            remUnit: 37.5
          })
        ]
      }
    },
    modules: false,
    // 是否使用css分离插件 ExtractTextPlugin,将样式和脚本分开
    extract: true,
    // 开启 CSS source maps,生成未被压缩的样式
    sourceMap: true
  },
  // 生产环境生产sm文件,会在source下面生成一个webpack文件里面src是vue源码
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