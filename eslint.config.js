import eslint from '@eslint/js'

import tsEslintPlugin from '@typescript-eslint/eslint-plugin'
import tsEslintParser from '@typescript-eslint/parser'

import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'

import babelParser from '@babel/eslint-parser'

import globals from 'globals'

const customTsFlatConfig = [
  {
    name: 'typescript-eslint/base',
    languageOptions: {
      parser: tsEslintParser,
      sourceType: 'module',
    },
    settings: {},
    // 允许 JSX 中出现未转义的引号
    files: ['**/*.{ts,tsx}'],
    rules: {
      ...tsEslintPlugin.configs.recommended.rules,
      '@typescript-eslint/no-confusing-non-null-assertion': 2,
      '@typescript-eslint/ban-ts-comment': 0, // 允许使用 @ts-nocheck 等注释
      'react/no-unescaped-entities': 0,
      // '@typescript-eslint/no-unused-vars': [
      //   1,
      //   { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      // ],
    },
    plugins: {
      // ts 语法特有的规则，例如泛型
      '@typescript-eslint': tsEslintPlugin,
    },
  },
]

const flatConfig = [
  // 全局生效的规则
  {
    name: 'global config',
    languageOptions: {
      globals: {
        ...globals.es2022,
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
    rules: {
      'no-dupe-class-members': 0,
      'no-redeclare': 0,
      'no-undef': 0,
      'no-unused-vars': [1, { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
  {
    name: 'react-eslint',
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    languageOptions: {
      ...reactPlugin.configs.recommended.languageOptions,
      // parserOptions: {
      //   ecmaFeatures: {
      //     jsx: true,
      //   },
      // },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 0,
    },
    settings: {
      react: {
        // 需要显示安装 react
        version: 'detect',
      },
    },
  },
  {
    name: 'babel-parser',
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        babelOptions: {
          babelrc: false,
          configFile: false,
          browserslistConfigFile: false,
          presets: ['@babel/preset-env'],
        },
        requireConfigFile: false,
      },
    },
  },
  {
    ignores: [
      'node_modules',
      'dist',
      'build',
      'public',
      '*.min.js',
      '*.bundle.js',
      'pnpm-lock.yaml',
    ],
  },
]

export default [
  eslint.configs.recommended,
  eslintPluginPrettierRecommended,
  ...flatConfig,
  ...customTsFlatConfig,
]
