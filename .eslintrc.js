module.exports = {
    env: {
        "browser": true,
        "es6": true,
        "node": true
    },
    globals: {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    parser: "babel-eslint",
    parserOptions: {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    rules: {
        "no-use-before-define": ["error", { "functions": true, "classes": true, "variables": true }],
        "no-unused-vars": ["error", { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }]
    }
};