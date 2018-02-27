const request = require('request');
const parser = require('node-podcast-parser');

function insertPods(feed, db, cb) {
	const collection = db.collection('pods');
	let title = undefined;
	let link = undefined;
	let description = undefined;
	let image = undefined;
	let owner_name = undefined;
	let owner_email = undefined;
	let displayText = undefined; // episode_title
	let published = undefined;
	let duration = undefined;
	let url = undefined; // audio/video source url
	let media_type = undefined;
	let likes = 0;
	
	request(feed, function (err, resp, data) {
		if (err) {
			console.error(err);
			return;
		}
		parser(data, function (err, data) {
			if (err) {
				console.error(err);
				return;
			}
			
			title = data.title;
			title.replace('/', '-');
			link = data.link;
			if (data.description) {
				if (data.description.short) {
					description = data.description.short
				} else if (data.description.long) {
					description = data.description.long
				}
			}
			if (data.image) {
				image = data.image;
			}
			if (data.owner) {
				if (data.owner.name) {
					owner_name = data.owner.name;
				}
				if (data.owner.email) {
					owner_email = data.owner.email
				}
			}
			
			for (let i = 0; i < data.episodes.length; i += 1) {
				displayText = data.episodes[i].title;
				published = data.episodes[i].published;
				if (data.episodes[i].duration) {
					duration = data.episodes[i].duration;
				}
				
				if (data.episodes[i].enclosure) {
					media_type = data.episodes[i].enclosure.type;
					url = data.episodes[i].enclosure.url;
				}
				
				collection.update(
					{
						url: url
					},
					{
						title: title,
						link: link,
						description: description,
						image: image,
						owner_name: owner_name,
						owner_email: owner_email,
						displayText: displayText,
						published: published,
						duration: duration,
						url: url,
						media_type: media_type,
						likes: likes
					},
					{
						upsert: true
					}
				);
			}
			cb(title);
		});
	});
}

function insertChannels(feed, db, cb) {
	console.log('feed', feed);
	const collection = db.collection('channels');
	let title = undefined;
	let link = undefined;
	let description_short = undefined;
	let description_long = undefined;
	let image = undefined;
	let owner_name = undefined;
	let owner_email = undefined;
	
	request(feed, function (err, resp, data) {
		if (err) {
			console.error(err);
			return;
		}
		parser(data, function (err, data) {
			if (err) {
				console.error(err);
				return;
			}
			
			const temp = data.title;
			title = temp.replace('/', '-');
			link = data.link;
			
			if(data.description.short){
				description_short = data.description.short;
			}
			
			if(data.description.long){
				description_long = data.description.long;
			}
			
			if (data.image) {
				image = data.image;
			}
			
			if (data.owner) {
				if (data.owner.name) {
					owner_name = data.owner.name;
				}
				if (data.owner.email) {
					owner_email = data.owner.email
				}
			}
			
			if (data.owner) {
				if (data.owner.name) {
					owner_name = data.owner.name;
				}
				if (data.owner.email) {
					owner_email = data.owner.email
				}
			}
			
			collection.update(
				{
					title: title
				},
				{
					title: title,
					link: link,
					description_short: description_short,
					description_long: description_long,
					image: image,
					owner_name: owner_name,
					owner_email: owner_email
				},
				{
					upsert: true
				}
			);
			
			cb(title);
		});
	});
}

module.exports = {
	insertPods,
	insertChannels
};