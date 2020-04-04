/**
 * @name BetterEmotes
 * @version 1.0.0
 * @description Custom emotes
**/

class BetterEmotes {
	getName() { return "BetterEmotes" }
	getDescription() { return "Custom emotes" }
	getVersion() { return "1.0" }
	getAuthor() { return "Lombra" }

	async load() {
		let res = await fetch('https://emotes.lombra.net/api/channels')
		let channels = await res.json()
		channels.push({ id: 0 })
		
		res = await fetch('https://emotes.lombra.net/filter.json')
		let filter = await res.json()
		for (let emote of filter.whitelist) bemotes.splice(bemotes.findIndex(e => e == emote), 1)
		bemotes.push(...filter.blacklist)
		
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
		
		for (let emote of emotes) {
			BdApi.emotes['TwitchSubscriber'][emote.code] = `https://emotes.lombra.net/emotes/${emote.source}/1x/${emote.id}`
		}
		
		res = await fetch('https://raw.githubusercontent.com/Lombra/BetterEmotes/master/emotes.json?t=' +(new Date().getTime()))
		let list = await res.json()
		for (let [emote, file] of Object.entries(list)) {
			file = encodeURI(file)
			BdApi.emotes['TwitchSubscriber'][emote] = "https://cdn.rawgit.com/Lombra/BetterEmotes/master/emotes/" + file
		}
		
		console.log("[BetterEmotes] Ready")
	}

	unload() { }

	start() { }

	stop() {
		console.log("[BetterEmotes] Stopped.")
	}

	update() {
		console.log("[BetterEmotes] Updated")
	}
}
