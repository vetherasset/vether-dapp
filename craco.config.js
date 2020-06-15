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
              '@layout-header-background': '#110d01',
              '@component-background': '#110d01',
              '@layout-header-height': '64px',
              '@menu-horizontal-line-height': '64px'
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
