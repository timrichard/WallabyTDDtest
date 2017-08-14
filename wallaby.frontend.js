module.exports = function () {
    return {
        files: [
            'public/**/*.js',
            '!public/**/*.spec.js'
        ],
        tests: [
            'public/**/*.spec.js'
        ],
        testFramework: 'mocha',
        env: {
            type: 'node'
        }
    }
};
