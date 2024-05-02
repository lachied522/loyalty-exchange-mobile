module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    plugins: [
      [
        "module:react-native-dotenv",
        {
          envName: "APP_ENV",
          moduleName: "@env",
          path: ".env"
        }
      ],
      [
        require.resolve('babel-plugin-module-resolver'),
        {
          root: ["."],
          alias: {
            "@/context": "./app/context",
            "@/constants": "./app/constants",
            "@/types": "./app/types",
            "@/utils": "./app/utils",
            "@/lib": "./app/lib",
          }
        }
      ],
    ]
  };
};
