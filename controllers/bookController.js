'use strict';

module.exports = bookController;

/*
    In more sophisticated modules, dependencies would be
    injected like
    function bookController({knex, oracle, redis})
 */
function bookController(deps) {
    return {
        hello,
        get,
        post,
        libCallbackCallerString,
        libCallbackCallerJSON
    };

    function hello (req, res) {
        console.log('Hello called');
        res.sendStatus(418);
    }

    function get (req, res) {
        res.sendStatus(okStatus());
        // To see how the test can verify that it can't reach private
        // methods that are not exposed through the revealing module pattern
        function okStatus() {
            return 200;
        }
    }

    function post(req, res) {
        if (!req.body.requiredField) {
            return res.sendStatus(400);
        }

        if (req.body.requiredField === 'bingo') {
            return res.json({
                hello: 'world'
            });
        }

        return res.sendStatus(200);
    }

    function libCallbackCallerString(callback) {
        if (!callback) {
            throw new Error('Callback required');
        }
        callback('hello');
    }

    function libCallbackCallerJSON(callback) {
        if (!callback) {
            throw new Error('Callback required');
        }
        callback({
            a: 'b',
            c: 'd'
        });
    }
}
