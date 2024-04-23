const path = require("path");

module.exports = {
  i18n: {
    defaultLocale: "at-en",
    locales: ["at-en", "at-de"],
  },
  localePath: path.resolve("./public/locales"),
};
