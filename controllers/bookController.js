'use strict';

const bookController = (deps) => {

    return {
        get,
        post
    };

    function get(req, res) {
        res.sendStatus(okStatus());

        // To see how the test can verify that it can't reach private
        // methods that are not exposed through the revealing module pattern
        function okStatus() {
            return 200;
        }

    }

    function post(req, res) {
        if (!req.body.requiredField) {
            return res.sendStatus(401);
        }

        return res.sendStatus(200);
    }

};

module.exports = bookController;