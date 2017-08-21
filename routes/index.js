module.exports = mainRoutes;

function mainRoutes({bookController}) {
    const express = require('express');
    const router = express.Router();

    /* GET home page. */
    router.get('/', function (req, res, next) {
        res.render('index', {title: 'Express'});
    });

    router.route('/hello')
        .get(bookController.hello);

    router.route('/book')
        .get(bookController.get)
        .post(bookController.post);

    return router;
}
