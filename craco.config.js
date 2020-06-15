const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': '#d09800',
              '@heading-color': '#fff',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
