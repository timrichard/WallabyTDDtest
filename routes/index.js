const express = require('express');
const router = express.Router();

const deps = {};

const bookController = require('../controllers/bookController')(deps);

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.route('/book')
    .get(bookController.get)
    .post(bookController.post);

module.exports = router;
