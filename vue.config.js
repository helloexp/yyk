const path = require('path');
module.exports = {
    publicPath: './',
    devServer: {
    proxy: {
      '/api': {
              target: 'https://event.uniqlo.cn/uniqlo_new_cms', // target host
              ws: true, // proxy websockets 
              changeOrigin: true, // needed for virtual hosted sites
              pathRewrite: {
                  '^/api': '' // rewrite path
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
        loaderOptions: {
          css: {},
          postcss: {
            plugins: [
              require('postcss-px2rem')({ // px单位转为rem单位，移动端等比缩放适配
                remUnit: 37.5
              })
            ]
          }
        }
      }
}