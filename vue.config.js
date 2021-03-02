const autoprefixer = require('autoprefixer');
const path = require('path');

require('./plugins/write-version');
const spritesmithPlugin = require('./plugins/spritesmith');

module.exports = {
  configureWebpack: config => {
    const plugins = []
    plugins.push(spritesmithPlugin)

    if (process.env.npm_config_report) {
      plugins.push(new BundleAnalyzerPlugin());
    }

    config.plugins = [...config.plugins, ...plugins]
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          /**
           * 浏览器前缀处理工具
           */
          autoprefixer({
            overrideBrowserslist: ['> 1%', 'last 2 versions']
          })
        ]
      }
    }
  },
  pluginOptions: {
    /**
     * 全局 scss 变量配置
     * @param {string | string[]} patterns 你想要全局注册的 scss 变量
     */
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.resolve(__dirname, 'src/assets/styles/variables/*.scss'),
        path.resolve(__dirname, 'src/assets/styles/mixins/*.scss')
      ]
    }
  }
};
