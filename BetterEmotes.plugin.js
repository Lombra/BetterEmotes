//META{"name":"BetterEmotes"}*//
function BetterEmotes() {}

BetterEmotes.prototype.load = function() {
	settingsCookie["bda-es-betteremotes"] = true
	bdEmotes.BetterEmotes = {}
	let settingIDs = {BetterEmotes: "bda-es-betteremotes"}
	for (let category in bdEmoteSettingIDs) {
		settingIDs[category] = bdEmoteSettingIDs[category]
	}
	bdEmoteSettingIDs = settingIDs
	
	let channels = [
		"40972890",
		"26610234",
		"7236692",
		"58529158",
		"23161357",
		"92655587",
		"58999722",
	]
	
	let p = channels.map(e => fetch(`https://api.twitchemotes.com/api/v4/channels/${e}`).then(res => res.json()))
	
	$.getJSON("https://raw.githubusercontent.com/Lombra/BetterEmotes/master/emotes.json?t=" +(new Date().getTime()), function(list) {
		for (let [emote, file] of Object.entries(list)) {
			file = encodeURI(file)
			bdEmotes.BetterEmotes[emote] = "https://cdn.rawgit.com/Lombra/BetterEmotes/master/emotes/" + file
		}
		
		Promise.all(p)
		 .then(channels => {
			let emotes = [].concat(...(channels.map(e => e.emotes)))
			emotes = emotes.filter(e => (!(e.code in bdEmotes.BetterEmotes)))
			Promise.all(channels.map(e => fetch(`https://api.betterttv.net/2/channels/${e.channel_name}`).then(res => res.json())))
			 .then(channels => {
				let emotes2 = [].concat(...(channels.map(e => e.emotes)))
				emotes2 = emotes2.filter(e => (!(e.code in bdEmotes.BetterEmotes)))
				for (let emote of emotes2) {
					bdEmotes.BetterEmotes[emote.code] = `https://cdn.betterttv.net/emote/${emote.id}/1x`
				}
				for (let emote of emotes) {
					bdEmotes.BetterEmotes[emote.code] = `https://static-cdn.jtvnw.net/emoticons/v1/${emote.id}/1.0`
				}
			})
		})
		
		console.log("[BetterEmotes] Ready")
	}).fail(function(xhr, status, error) {
		console.log("[BetterEmotes] Error Loading emotelist '" +status+ ":" +error+ "'. Using fallback")
	})
}

BetterEmotes.prototype.unload = function() {
}

BetterEmotes.prototype.start = function() {
}

BetterEmotes.prototype.stop = function() {
	console.log("[BetterEmotes] Stopped.")
};

BetterEmotes.prototype.update = function() {
	console.log("[BetterEmotes] Updated")
};

BetterEmotes.prototype.getName = function() {
	return "BetterEmotes"
};

BetterEmotes.prototype.getDescription = function() {
	return "Custom emotes"
};

BetterEmotes.prototype.getVersion = function() {
	return "1.0"
};

BetterEmotes.prototype.getAuthor = function() {
	return "Lombra"
};
