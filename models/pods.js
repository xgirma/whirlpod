const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
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

module.exports = {
	pods,
};