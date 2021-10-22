const path = require('path');
const nodeExternals = require('webpack-node-externals');

const commonSettings = {
  watch: true,
  watchOptions: {
    ignored: /node_modules\/(?!@anupheaus).*/,
  },
  output: {
    path: path.resolve(__dirname, './dist'),
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      loader: 'ts-loader',
      options: {
        onlyCompileBundledFiles: true,
        compilerOptions: {
          noEmit: false,
        },
      },
    }],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  stats: {
    assets: false,
    builtAt: true,
    cached: false,
    cachedAssets: false,
    children: false,
    chunks: false,
    chunkGroups: false,
    chunkModules: false,
    chunkOrigins: false,
    colors: true,
    depth: false,
    entrypoints: false,
    env: false,
    errors: true,
    errorDetails: true,
    hash: false,
    logging: 'error',
    modules: false,
    outputPath: false,
    performance: true,
    providedExports: false,
    publicPath: false,
    reasons: false,
    source: false,
    timings: true,
    usedExports: false,
    version: false,
    warnings: false,
  },
};

module.exports = [{
  ...commonSettings,
  entry: {
    server: './src/index.ts',
  },
  target: 'node',
  externals: [
    nodeExternals(),
  ],
}];
