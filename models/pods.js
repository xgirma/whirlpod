const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const assert = require('assert');
const url = process.env.MONGO_URL || null;
const url_channels = process.env.SECCH_URL || null;
const updatePod = require('./insert').insertPods;
const insertChannels = require('./insert').insertChannels;

/* return all pods */
const pods = function (cb) {
	MongoClient.connect(url, function (err, client) {
		assert.equal(null, err);
		console.info('Connected to db to get all pods.');
		
		const db = client.db('securitypodcasts');
		const collection = db.collection('pods');
		
		collection
			.find()
			.sort({'published': -1})
			.toArray(function (err, pods) {
				assert.equal(null, err);
				client.close();
				cb(err, pods);
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
			.sort({'published': -1})
			.limit(10)
			.toArray(function (err, pods) {
				assert.equal(null, err);
				client.close();
				cb(err, pods);
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
			.toArray(function (err, pods) {
				assert.equal(null, err);
				client.close();
				cb(err, pods);
			});
	});
};

/* return all pods from a title */
const title = function (title, type, cb) {
	MongoClient.connect(url, function (err, client) {
		assert.equal(null, err);
		console.info('Connected to db to get all pods of a title.');
		
		const db = client.db('securitypodcasts');
		const collection = db.collection('pods');
		let sort = {published: -1};
		if (type && type === 'liked') {
			sort = {likes: -1};
		}
		
		collection
			.find({title: title})
			.sort(sort)
			.toArray(function (err, pods) {
				assert.equal(null, err);
				client.close();
				cb(err, pods);
			});
	});
};

/* return ten pods from a title */
const tenByTitle = function (title, type, cb) {
	MongoClient.connect(url, function (err, client) {
		assert.equal(null, err);
		console.info('Connected to db to get 10 pods of a title.');
		
		const db = client.db('securitypodcasts');
		const collection = db.collection('pods');
		let sort = {published: -1};
		if (type && type === 'liked') {
			sort = {likes: -1};
		}
		
		collection
			.find({title: title})
			.sort(sort)
			.limit(10)
			.toArray(function (err, pods) {
				assert.equal(null, err);
				client.close();
				cb(err, pods);
			});
	});
};

/* increment like count */
const like = function (id, cb) {
	MongoClient.connect(url, function (err, client) {
		assert.equal(null, err);
		console.log(`Connected to db to increment like for ${id}`);
		
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
	});
};

/* insert new pods */
const insertPods = function (feed, cb) {
	MongoClient.connect(url, function (err, client) {
		assert.equal(null, err);
		console.info('Connected to db to insert pods.');
		
		const db = client.db('securitypodcasts');
		updatePod(feed, db, function (data) {
			client.close();
			console.info('Posted: ', data);
			cb(err, {status: 'ok'});
		});
	});
};

const insertChannel = function (feed, cb) {
	MongoClient.connect(url_channels, function (err, client) {
		assert.equal(null, err);
		console.info('Connected to db to insert channels.');
		
		const db = client.db('sec-channels');
		insertChannels(feed, db, function (data) {
			client.close();
			console.info('Posted: ', data);
			cb(err, {status: 'ok'});
		});
	});
};

module.exports = {
	pods,
	tenRecent,
	tenLiked,
	title,
	like,
	insertPods,
	insertChannel,
	tenByTitle,
};