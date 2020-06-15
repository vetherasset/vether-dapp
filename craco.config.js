const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@heading-color': '#fff',
              '@shadow-color': 'red'
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
