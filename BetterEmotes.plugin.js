//META{"name":"BetterEmotes"}*//
function BetterEmotes() {}

BetterEmotes.prototype.load = async function() {
	settingsCookie["bda-es-betteremotes"] = true
	bdEmotes.BetterEmotes = {}
	let settingIDs = {BetterEmotes: "bda-es-betteremotes"}
	for (let category in bdEmoteSettingIDs) {
		settingIDs[category] = bdEmoteSettingIDs[category]
	}
	bdEmoteSettingIDs = settingIDs
	
	let res = await fetch('https://emotes.lombra.net/api/channels')
	let channels = await res.json()
	
	res = await fetch('https://raw.githubusercontent.com/Lombra/BetterEmotes/master/emotes.json?t=' +(new Date().getTime()))
	let list = await res.json()
	for (let [emote, file] of Object.entries(list)) {
		file = encodeURI(file)
		bdEmotes.BetterEmotes[emote] = "https://cdn.rawgit.com/Lombra/BetterEmotes/master/emotes/" + file
	}
	
	let emotes = []
	await Promise.all(channels.map(async e => {
		let res = await fetch(`https://emotes.lombra.net/api/emotes/${e.id}`)
		let emotesT = await res.json()
		emotesT = emotesT.sort((a, b) => a.id - b.id)
		emotes = emotes.concat(emotesT.filter(e => e.source == 'twitch' && !(e.active || e.pinned)))
		emotes = emotes.concat(emotesT.filter(e => e.source == 'twitch' && e.active))
		emotes = emotes.concat(emotesT.filter(e => e.source == 'twitch' && e.pinned))
	}))
	emotes = emotes.filter(e => (!(e.code in bdEmotes.BetterEmotes)))
	
	channels = await Promise.all(channels.map(e => fetch(`https://api.betterttv.net/2/channels/${e.name}`).then(res => res.json())))
	let emotes2 = [].concat(...(channels.map(e => e.emotes)))
	emotes2 = emotes2.filter(e => (!(e.code in bdEmotes.BetterEmotes)))
	
	for (let emote of emotes2) {
		bdEmotes.BetterEmotes[emote.code] = `https://cdn.betterttv.net/emote/${emote.id}/1x`
	}
	for (let emote of emotes) {
		bdEmotes.BetterEmotes[emote.code] = `https://emotes.lombra.net/emotes/twitch/1x/${emote.id}`
	}
	
	console.log("[BetterEmotes] Ready")
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
