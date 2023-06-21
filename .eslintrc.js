module.exports = {
  extends: ['plugin:react/recommended', 'plugin:react-hooks/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint','prettier', 'jest'],
  rules: {
    'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
    'react-hooks/exhaustive-deps': 'error', // Checks effect dependencies
    '@typescript-eslint/no-unused-vars': 1,
    '@typescript-eslint/consistent-type-imports': [
      1,
      {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports',
      },
    ], // import type
  },
};
