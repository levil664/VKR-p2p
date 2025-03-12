module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:prettier/recommended',
    ],
    parser: 'babel-eslint',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
    rules: {
        'no-console': 'off',
        'no-unused-vars': 'warn',
        'react/prop-types': 'off',
        'react/jsx-filename-extension': [1, { extensions: ['.jsx', '.js'] }],
        'arrow-body-style': ['warn', 'as-needed'],
        'quotes': ['warn', 'single', { avoidEscape: true }],
        'semi': ['warn', 'always'],
        'space-in-parens': ['warn', 'never'],
        'comma-spacing': ['warn', { before: false, after: true }],
    },
};
