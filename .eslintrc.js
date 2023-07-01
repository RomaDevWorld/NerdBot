module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'no-var-requires': [0],
    'no-unused-vars': ['warn'],
    'linebreak-style': ['error', 'unix'],
    indent: ['error', 2, { SwitchCase: 1 }],
    semi: ['warn', 'never'],
    'no-multiple-empty-lines': ['warn', { max: 1 }],
  },
}
