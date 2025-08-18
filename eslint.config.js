import config from "@koddsson/eslint-config";

export default [
  ...config,
  {
    // TODO: Enable these again when possible and it makes sense
    rules: {
      "unicorn/no-anonymous-default-export": "off",
      "unicorn/prefer-top-level-await": "off",
      "unicorn/prevent-abbreviations": "off",
      "unicorn/no-object-as-default-parameter": "off",
      "unicorn/no-null": "off",
      "unicorn/prefer-number-properties": "off",
    },
  },
];
