module.exports = function () {
    return {
        files: [
            './**/*.js',
            '!./**/*.spec.js'
        ],
        tests: [
            './**/*.spec.js'
        ],
        testFramework: 'mocha',
        env: {
            type: 'node'
        }
    }
};
