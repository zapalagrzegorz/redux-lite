const TerserPlugin = require('terser-webpack-plugin');

const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

/* wyłączamy wszystkie komentarze */
const terser = new TerserPlugin({
  terserOptions: { output: { comments: false } },
  extractComments: false,
});

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [terser],
  },
});
