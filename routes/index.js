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

/* GET 10 recent or top 10 liked pods */
router.get('/pods/ten/:type', function(req, res, next) {
	mongoClient.pods(function(err, pods){
		if(err){
			console.error(err);
		}
		if(req.params.type === "recent"){
			mongoClient.tenRecent(function(error, pods){
				if(error){
					console.error(error);
				}
				res.json(pods);
			})
		} else
		if(req.params.type === "liked"){
			mongoClient.tenLiked(function(error, pods){
				if(error){
					console.error(error);
				}
				res.json(pods);
			})
		}
	});
});

module.exports = router;
