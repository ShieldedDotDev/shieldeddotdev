const path = require('path');

module.exports = {
  entry: './ts/main.ts',
//   optimization: {
// 	// We no not want to minimize our code.
// 	minimize: false
//   },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    libraryTarget: 'amd',
    library: 'shielded',
    filename: 'main.js',
    path: path.resolve(__dirname, 'static'),
  },
};