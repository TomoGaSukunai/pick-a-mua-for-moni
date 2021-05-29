//jsx support
module.exports = {
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        targets: {
          electron: '6.0',
        },
        loose: true,
      },
    ],
    require.resolve('@babel/preset-react'),
  ],
  plugins: [
  ].concat(
    [
    ].map((plugin) => require.resolve(plugin)),
  ),
  ignore: [],
  only: [/\.(jsx)$/],
  babelrc: false,
}
