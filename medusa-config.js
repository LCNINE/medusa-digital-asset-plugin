const { defineConfig } = require("@medusajs/framework/utils");

module.exports = defineConfig({
  modules: [
    {
      resolve: "./src/modules/digital-asset",
    },
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-s3",
            id: "s3",
            options: {
              file_url: process.env.S3_FILE_URL,
              access_key_id: process.env.S3_ACCESS_KEY_ID,
              secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
              region: process.env.S3_REGION,
              bucket: process.env.S3_BUCKET,
              ...(process.env.S3_ENDPOINT && { endpoint: process.env.S3_ENDPOINT }),
              // other options...
            },
          },
        ],
      },
    },
  ],
});
