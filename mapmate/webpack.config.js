module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      "process.env.KAKAO_API": JSON.stringify(process.env.KAKAO_API),
    }),
  ],
};
