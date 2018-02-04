const request = require('request');
const parser = require('node-podcast-parser');

function insertPods(feed, db, cb) {
	const collection = db.collection('pods');
	let title;
	let link;
	let description;
	let image;
	let owner_name;
	let owner_email;
	let episode_title;
	let published;
	let duration;
	let audio;
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
			
			title = data.title || 'Title not found.';
			link = data.link || 'Link not found.';
			description = data.description.short || 'Description not found.';
			image = data.image || 'Image not found.';
			owner_name = data.owner.name || 'Owner name not found.';
			owner_email = data.owner.email || 'Owner email not found.';
			
			for (let i = 0; i < data.episodes.length; i += 1) {
				episode_title = data.episodes[i].title || 'Episode title not found.';
				published = data.episodes[i].published || 'Published date info not found.';
				duration = data.episodes[i].duration || 'Duration data not found.';
				audio = data.episodes[i].enclosure.url || 'Audio url not found.';
				
				collection.update(
					{
						audio: audio
					},
					{
						title: title,
						link: link,
						description: description,
						image: image,
						owner_name: owner_name,
						owner_email: owner_email,
						episode_title: episode_title,
						published: published,
						duration: duration,
						audio: audio,
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