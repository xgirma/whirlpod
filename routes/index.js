const express = require('express');
const router = express.Router({strict: true});
const mongoClient = require('../models/pods');

/* GET / */
router.all('/', function (req, res, next) {
	res.sendStatus(200);
});

/* GET ping */
router.get('/pods', function (req, res, next) {
	mongoClient.pods(function (err, pods) {
		if (err) {
			console.error(err);
		}
		res.json(pods);
	});
});

/* GET 10 recent or top 10 liked pods */
router.get('/pods/ten/:type', function (req, res, next) {
	if (req.params.type === 'recent') {
		mongoClient.tenRecent(function (err, pods) {
			if (err) {
				console.error(err);
			}
			res.json(pods);
		});
	} else if (req.params.type === 'liked') {
		mongoClient.tenLiked(function (err, pods) {
			if (err) {
				console.error(err);
			}
			res.json(pods);
		});
	} else {
		res.sendStatus(404);
	}
});

/* GET all pods by title and sort by recent or liked */
router.get('/pods/:title/:type', function (req, res, next) {
	const title = req.params.title;
	const type = req.params.type;
	mongoClient.title(title, type, function (err, pods) {
		if (err) {
			console.error(err);
		}
		res.json(pods);
	});
});

/* POST increment like count */
router.post('/pods/:id', function (req, res, next) {
	const id = req.params.id;
	mongoClient.like(id, function (err, likedPod) {
		if (err) {
			console.error(err);
		}
		res.json(likedPod);
	});
});

/* POST podcasts */
router.post('/pods', function (req, res, next) {
	const feed = 'http://dhenage.libsyn.com/rss'; // TODO remove this
	mongoClient.insertPods(feed, function (err, cb) {
		if (err) {
			console.error(err);
		}
		res.status(200).json(cb);
	});
});

module.exports = router;
