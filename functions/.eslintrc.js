module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    "ecmaVersion": 2018,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
    "quotes": ["error", "double", {"allowTemplateLiterals": true}],
    "no-html-link-for-pages": "off", // 🔥 Désactiver cette règle
    "no-unused-vars": "warn", // 🔥 Éviter les erreurs bloquantes
    "max-len": ["error", {"code": 120}],
  },
};
