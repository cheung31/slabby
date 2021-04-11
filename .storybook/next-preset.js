const path = require("path");

module.exports = {
  webpackFinal: async (baseConfig, options) => {
    const { module = {} } = baseConfig;

    const newConfig = {
      ...baseConfig,
      module: {
        ...module,
        rules: [...(module.rules || [])],
      },
    };

    // TypeScript with Next.js
    newConfig.module.rules.push({
      test: /\.(ts|tsx)$/,
      include: [path.resolve(__dirname, "../components")],
      use: [
        {
          loader: "babel-loader",
          options: {
            presets: ["next/babel", require.resolve("babel-preset-react-app")],
            plugins: ["react-docgen"],
          },
        },
      ],
    });
    newConfig.resolve.extensions.push(".ts", ".tsx");


    // CSS preset for Storybook
    // Allow css override
    const cssRules = newConfig.module.rules.filter(rule => rule.test.toString().indexOf('css') > -1);
    cssRules.forEach(r => r.exclude = /\.css$/);
    newConfig.module.rules.push(
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: false,
            },
          },
        ],
      },
      {
        test: /\.module\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: "[name]__[local]--[hash:base64:5]"
              }
            },
          },
        ],
      }
    );

    return newConfig;
  },
};
