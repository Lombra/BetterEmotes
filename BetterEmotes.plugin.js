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
		
		let emotesTw = emotesT.filter(e => e.source == 'twitch').sort((a, b) => a.id - b.id)
		let emotesBt = emotesT.filter(e => e.source == 'bttv').sort((a, b) => a.id - b.id)
		
		emotes = emotes.concat(emotesBt.filter(e => !(e.active || e.pinned)))
		emotes = emotes.concat(emotesTw.filter(e => !(e.active || e.pinned)))
		
		emotes = emotes.concat(emotesBt.filter(e => e.active))
		emotes = emotes.concat(emotesTw.filter(e => e.active))
		
		emotes = emotes.concat(emotesBt.filter(e => e.pinned))
		emotes = emotes.concat(emotesTw.filter(e => e.pinned))
	}))
	emotes = emotes.filter(e => (!(e.code in bdEmotes.BetterEmotes)))
	
	for (let emote of emotes) {
		bdEmotes.BetterEmotes[emote.code] = `https://emotes.lombra.net/emotes/${emote.source}/1x/${emote.id}`
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
