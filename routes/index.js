var express = require('express');
var router = express.Router({strict: true});

/* GET / */
router.all('/', function(req, res, next) {
	res.sendStatus(200);
});

/* GET ping */
router.get('/pods', function(req, res, next) {
	res.send('pong');
});

module.exports = router;
