module.exports = {
  options: {
    verbose: true,
    buildType: 'spa',
    enableBabelCache: false,
  },
  enableSourceMaps: true,
  modifyWebpackConfig(opts) {
    const config = opts.webpackConfig;

    // Ignore fs dependencies so we can use winston
    // if (opts.env.target === 'node' && !opts.env.dev) {
    config.node = { fs: 'empty' };
    // }

    return config;
  },
};
