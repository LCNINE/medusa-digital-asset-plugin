const { defineConfig } = require("@medusajs/framework/utils");

module.exports = defineConfig({
  modules: [
    {
      resolve: "./src/modules/digital-asset",
    },
  ],
});
