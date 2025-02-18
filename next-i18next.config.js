const path = require("path");

module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: [
      "en",
      "ca-en",
      "ee-en",
      "fi-en",
      "cz-en",
      "pt-en",
      "hr-en",
      "lt-en",
      "zz-en",
      "ee-ru",
      "ee-et",
      "fi-fi",
      "cz-cs",
      "ca-fr",
      "pt-pt",
    ],
    lowerCaseLng: true,
  },
  localePath: path.resolve("./public/locales"),
};
