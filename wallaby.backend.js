module.exports = function (wallaby) {
    return {
        files: [
            'lib/**/*.js',
            'routes/**/*.spec.js',
            'controllers/**/*.js',
            '!controllers/**/*.spec.js',
        ],
        tests: [
            'test/**/*.js',
            'controllers/**/*.spec.js'
        ],
        testFramework: 'mocha',
        env: {
            type: 'node',
            runner: '/Users/tim/.nvm/versions/node/v8.2.1/bin/node'
        }
    }
};
