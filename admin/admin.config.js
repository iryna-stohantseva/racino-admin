module.exports = {
  webpack: (config, webpack) => {
    // Add your variable using the DefinePlugin
    config.plugins.push(
      new webpack.DefinePlugin({
        //All your custom ENVs that you want to use in frontend
        ENVOIRMENT_VARIABLES: {
          url: JSON.stringify(process.env.URL),
          ENV: JSON.stringify(process.env.ENV),
          wallet:JSON.stringify(process.env.WALLET)
        },
      })
    );
    // Important: return the modified config
    return config;
  },
};
