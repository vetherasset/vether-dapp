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
              '@font-size-base': '',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
