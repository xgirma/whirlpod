const request = require('request');
const parser = require('node-podcast-parser');
const moment = require('moment');

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
			link = data.link;
			if(data.description){
				if(data.description.short){
					description = data.description.short
				} else if(data.description.long){
					description = data.description.long
				}
			}
			if(data.image){
				image = data.image;
			}
			if(data.owner){
				if(data.owner.name){
					owner_name = data.owner.name;
				}
				if(data.owner.email){
					owner_email = data.owner.email
				}
			}
			
			for (let i = 0; i < data.episodes.length; i += 1) {
				displayText = data.episodes[i].title;
				published = moment(data.episodes[i].published).format("MMM Do YY");
				if(data.episodes[i].duration){
					duration = data.episodes[i].duration;
				}
				
				if(data.episodes[i].enclosure){
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

module.exports = insertPods;