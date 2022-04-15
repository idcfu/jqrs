import HTMLWebpackPlugin from 'html-webpack-plugin';
import MiniCSSExtractPlugin from 'mini-css-extract-plugin';
import { resolve } from 'path';
import { Chunk, Configuration } from 'webpack';
import 'webpack-dev-server';

const isProduction = process.argv.includes('production');
const contenthash = isProduction ? '.[contenthash:5]' : '';
const devtool = isProduction ? false : 'source-map';

const configuration: Configuration = {
  entry: {
    plugin: './src/plugin',
    demo: './src/demo',
  },

  output: {
    path: resolve(__dirname, 'dist'),
    filename: `js/[name]${contenthash}.js`,
    clean: true,
  },

  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: ({ name }: Chunk) => name !== 'plugin',
        },
      },
    },
  },

  plugins: [
    new HTMLWebpackPlugin({
      template: 'src/demo/index.pug',
    }),

    new MiniCSSExtractPlugin({
      filename: `css/[name]${contenthash}.css`,
    }),
  ],

  module: {
    rules: [
      {
        test: /.pug$/,
        loader: 'pug-loader',
      },

      {
        test: /.scss$/,
        use: [
          MiniCSSExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },

      {
        test: /.ts$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },

  devtool,
  devServer: {
    hot: false,
    open: true,
  },

  resolve: {
    extensions: ['.js', '.ts'],
  },
};

export default configuration;
