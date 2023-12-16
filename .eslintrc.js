module.exports = {
  root: true,
  ignorePatterns: ['projects/**/*', '.eslintrc.js'],
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
    tsconfigRootDir: __dirname
  },
  settings: {
    'import/resolver': {
      typescript: {}
    }
  },
  plugins: ['simple-import-sort'],
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error'
  },
  overrides: [
    {
      files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
      rules: {
        'simple-import-sort/imports': [
          'error',
          {
            groups: [
              ['^angular', '^@?\\w'],
              ['^rxjs', '^@?\\w']
            ]
          }
        ]
      }
    },
    {
      files: ['*.ts'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@angular-eslint/recommended',
        'plugin:@angular-eslint/template/process-inline-templates',
        'prettier',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:prettier/recommended'
      ],
      plugins: ['import'],
      rules: {
        '@angular-eslint/directive-selector': [
          'error',
          {
            type: 'attribute',
            prefix: 'app',
            style: 'camelCase'
          }
        ],
        '@angular-eslint/component-selector': [
          'error',
          {
            type: 'element',
            prefix: 'app',
            style: 'kebab-case'
          }
        ],
        '@typescript-eslint/no-explicit-any': 'off'
      }
    },
    {
      files: ['*.html'],
      extends: ['plugin:@angular-eslint/template/recommended', 'plugin:@angular-eslint/template/accessibility'],
      rules: {
        'import/order': [
          1,
          {
            groups: ['external', 'builtin', 'internal', 'sibling', 'parent', 'index']
          }
        ]
      }
    }
  ]
};
