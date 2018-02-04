const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const assert = require('assert');
const url = process.env.MONGO_URL || null;

/* return all pods */
const pods = function (cb) {
	MongoClient.connect(url, function (err, client) {
		assert.equal(null, err);
		console.info('Connected to db to get pods.');
		
		const db = client.db('securitypodcasts');
		const collection = db.collection('pods');
		
		collection
			.find()
			.sort({'date': -1})
			.toArray(function (err, docs) {
				assert.equal(null, err);
				
				client.close();
				cb(err, docs);
			});
	});
};

/* returns recent 10 pods */
const tenRecent = function (cb) {
	MongoClient.connect(url, function (err, client) {
		assert.equal(null, err);
		console.info('Connected to db to get 10 recent pods.');
		
		const db = client.db('securitypodcasts');
		const collection = db.collection('pods');
		
		collection
			.find()
			.sort({'date': -1})
			.limit(10)
			.toArray(function (err, docs) {
				assert.equal(null, err);
				
				client.close();
				cb(err, docs);
			});
	});
};

/* returns 10 most liked pods */
const tenLiked = function (cb) {
	MongoClient.connect(url, function (err, client) {
		assert.equal(null, err);
		console.info('Connected to db to get top 10 liked pods.');
		
		const db = client.db('securitypodcasts');
		const collection = db.collection('pods');
		
		collection
			.find()
			.sort({'likes': -1})
			.limit(10)
			.toArray(function (err, docs) {
				assert.equal(null, err);
				
				client.close();
				cb(err, docs);
			});
	});
};

/* increment like count */
const like = function (id, cb) {
	MongoClient.connect(url, function (err, client) {
		assert.equal(null, err);
		console.log(`Connected to db to update like for `);
		
		const db = client.db('securitypodcasts');
		const collection = db.collection('pods');
		
		collection.findOneAndUpdate(
			{_id: ObjectId(id)},
			{$inc: {likes: 1}},
			{maxTimeMS: 5}, function (err, likedPod) {
				assert.equal(null, err);
				assert.equal(id, likedPod.value._id);
				
				client.close();
				cb(err, likedPod);
			}
		);
	})
};

module.exports = {
	pods,
	tenRecent,
	tenLiked,
	like,
};