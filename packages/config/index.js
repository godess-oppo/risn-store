module.exports = {
  extends: [
    'turbo',
    'prettier',
    'eslint:recommended',
    '@typescript-eslint/recommended',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    'react-hooks/exhaustive-deps': 'error',
  },
  ignorePatterns: ['*.d.ts', '*.config.js', '*.config.ts', 'dist/**', 'build/**'],
};
