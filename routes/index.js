const express = require('express');
const router = express.Router({strict: true});
const mongoClient = require('../models/pods');

/* GET / */
router.all('/', function(req, res, next) {
	res.sendStatus(200);
});

/* GET ping */
router.get('/pods', function(req, res, next) {
	mongoClient.pods(function(err, pods){
		if(err){
			console.error(err);
		}
		res.json(pods);
	});
});

module.exports = router;
