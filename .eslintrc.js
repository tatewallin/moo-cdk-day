module.exports = {
    root: true,
    env: {
      browser: true,
      node: true,
      es6: true,
      jest: true
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      ecmaFeatures: {
        modules: true
      },
      project: "tsconfig.json"
    },
    extends: [
      "plugin:@typescript-eslint/recommended",
      "eslint:recommended",
      "prettier",
      "prettier/@typescript-eslint",
      "plugin:promise/recommended",
      "plugin:jsdoc/recommended"
    ],
    plugins: [
      '@typescript-eslint',
      "prettier",
      "simple-import-sort",
      "promise",
      "jsdoc",
    ],
    settings: {
      "import/resolver": {
        typescript: {
          "alwaysTryTypes": true
        }
      },
      "jsdoc": {
        mode: "typescript"
      }
    },
    // add your custom rules here
    rules: {
      "prettier/prettier": ["error", {
        printWidth: 120,
        "trailingComma": "none",
        "arrowParens": "always"
      }],
      "simple-import-sort/sort": "error",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/no-empty-interface": "off",
      "jsdoc/require-param": 2,
      "jsdoc/require-description": ["error", {
        contexts: ["any", "TSInterfaceDeclaration"]
      }],
      "jsdoc/newline-after-description": 2,
      "jsdoc/require-param-name": 2,
      "jsdoc/require-param-type": 2,
      "jsdoc/require-returns": 2,
      "jsdoc/require-returns-check": 2,
      "jsdoc/require-returns-description": 2,
      "jsdoc/require-returns-type": 2,
      "jsdoc/require-jsdoc": ["error", {
        publicOnly: true,
        require: {
          FunctionDeclaration: true,
          MethodDefinition: false,
          ClassDeclaration: true,
          ArrowFunctionExpression: false,
          FunctionExpression: false
        },
        contexts: [
          "any",
        ]
      }],
      "no-console": "off",
      "curly": "error",
      "object-shorthand": ["error", "always"],
      "no-warning-comments": [
        "warn",
        {
          terms: [
            "todo",
            "fixme",
            "to do",
            "fix me",
            "TODO",
            "Todo",
            "FIXME",
            "Need to",
            "remember"
          ],
          location: "anywhere"
        }
      ],
      "max-depth": [
        "error",
        {
          max: 3
        }
      ]
    },
    overrides: [
      {
        files: ["**/*.test.*"],
        rules: {
          "no-magic-numbers": "off",
        }
      },
      {
        files: ["**/*.js"],
        rules: {
          "@typescript-eslint/no-var-requires": "off",
        }
      }
    ]
  };