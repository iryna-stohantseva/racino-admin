module.exports = ({ env }) => ({
  upload: {
    provider: "multi-folder-s3",
    providerOptions: {
      accessKeyId: env("AWS_ACCESS_KEY_ID"),
      secretAccessKey: env("AWS_ACCESS_SECRET"),
      region: env("AWS_REGION"),
      params: {
        Bucket: env("AWS_BUCKET"),
      },
      logger: console,
    },
    breakpoints: {},
  },
  config: {
    providerOptions: {
      sizeLimit: 250 * 1024 * 1024 // 256mb in bytes
    }
  }
});
