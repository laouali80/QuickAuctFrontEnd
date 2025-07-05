module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      [
        "babel-preset-expo",
        {
          jsxImportSource: "nativewind",
        },
      ],
      "nativewind/babel",
    ],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@": "./",
            "tailwind.config": "./tailwind.config.js",
            // "react-native-svg": "react-native-svg-web",
          },
        },
      ],
      'react-native-reanimated/plugin', // Always keep this plugin LAST
    ],
  };
};
// plugins: [],