const { join } = require('path');
const fs = require('fs-extra');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const scenarioNames = fs.readdirSync(join('./src/scenarios')).filter(name => !name.startsWith('.'));
const { version } = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

module.exports = ({ onGetWebpackConfig }) => {
  onGetWebpackConfig((config) => {
    config.resolve.plugin('tsconfigpaths').use(TsconfigPathsPlugin, [
      {
        configFile: './tsconfig.json',
      },
    ]);

    config.merge({
      node: {
        fs: 'empty',
      },
    });

    config.merge({
        entry: {
          index: require.resolve('./src/index.ts'),
          preview: require.resolve('./src/preview.tsx'),
          home: require.resolve('./src/home.tsx'),
          workbench: require.resolve('./src/workbench.tsx'),
          workbenchDesign: require.resolve('./src/workbenchDesign.tsx'),
          login: require.resolve('./src/login.tsx'),
          formRender: require.resolve('./src/formRender.tsx'),
          formRenderDesign: require.resolve('./src/formRenderDesign.tsx'),
          xflow: require.resolve('./src/xflow.tsx'),
          process: require.resolve('./src/process.tsx'),
          processDesign: require.resolve('./src/processDesign.tsx'),
          formProcess: require.resolve("./src/formProcess.tsx")
        },
      });
      config
        .plugin('index')
        .use(HtmlWebpackPlugin, [
          {
            inject: false,
            minify: false,
            templateParameters: {
              scenario: 'index',
              version,
            },
            template: require.resolve('./public/index.ejs'),
            filename: 'index.html',
          },
        ]);
      

    config
      .plugin('preview')
      .use(HtmlWebpackPlugin, [
        {
          inject: false,
          templateParameters: {
          },
          template: require.resolve('./public/preview.html'),
          filename: 'preview.html',
        },
      ]);

    config
      .plugin('home')
      .use(HtmlWebpackPlugin, [
        {
          inject: false,
          templateParameters: {
          },
          template: require.resolve('./public/home.html'),
          filename: 'home.html',
        },
      ]);
    config
      .plugin('workbench')
      .use(HtmlWebpackPlugin, [
        {
          inject: false,
          templateParameters: {
          },
          template: require.resolve('./public/workbench.html'),
          filename: 'workbench.html',
        },
      ]);
    config
      .plugin('workbenchDesign')
      .use(HtmlWebpackPlugin, [
        {
          inject: false,
          templateParameters: {
          },
          template: require.resolve('./public/workbenchDesign.html'),
          filename: 'workbenchDesign.html',
        },
      ]);
    config
      .plugin('login')
      .use(HtmlWebpackPlugin, [
        {
          inject: false,
          templateParameters: {
          },
          template: require.resolve('./public/login.html'),
          filename: 'login.html',
        },
      ]);
    config
      .plugin('formRender')
      .use(HtmlWebpackPlugin, [
        {
          inject: false,
          templateParameters: {
          },
          template: require.resolve('./public/formRender.html'),
          filename: 'formRender.html',
        },
      ]);
    config
      .plugin('formRenderDesign')
      .use(HtmlWebpackPlugin, [
        {
          inject: false,
          templateParameters: {
          },
          template: require.resolve('./public/formRenderDesign.html'),
          filename: 'formRenderDesign.html',
        },
      ]);
    config
      .plugin('xflow')
      .use(HtmlWebpackPlugin, [
        {
          inject: false,
          templateParameters: {
          },
          template: require.resolve('./public/xflow.html'),
          filename: 'xflow.html',
        },
      ]);
    config
      .plugin('process')
      .use(HtmlWebpackPlugin, [
        {
          inject: false,
          templateParameters: {
          },
          template: require.resolve('./public/process.html'),
          filename: 'process.html',
        },
      ]);
    config
      .plugin('processDesign')
      .use(HtmlWebpackPlugin, [
        {
          inject: false,
          templateParameters: {
          },
          template: require.resolve('./public/processDesign.html'),
          filename: 'processDesign.html',
        },
      ]);
    config
      .plugin('formProcess')
      .use(HtmlWebpackPlugin, [
        {
          inject: false,
          templateParameters: {
          },
          template: require.resolve('./public/formProcess.html'),
          filename: 'formProcess.html',
        },
      ]);

    config.plugins.delete('hot');
    config.devServer.hot(false);

    config.module // fixes https://github.com/graphql/graphql-js/issues/1272
      .rule('mjs$')
      .test(/\.mjs$/)
      .include
        .add(/node_modules/)
        .end()
      .type('javascript/auto');
  });
};
