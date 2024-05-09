const path = require("path");

module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "ca-en", "ee-en", "fi-en", "cz-en", "pt-en", "hr-en", "lt-en", "zz-en"],
  },
  localePath: path.resolve("./public/locales"),
};
