const path = require("path");

module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "de", "zz-en"],
  },
  localePath: path.resolve("./public/locales"),
};
