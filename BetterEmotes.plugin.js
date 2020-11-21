/**
 * @name BetterEmotes
 * @version 1.0.0
 * @description Custom emotes
**/

class BetterEmotes {
	emotes = []
	
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
		
		await Promise.all(channels.map(async e => {
			let res = await fetch(`https://emotes.lombra.net/api/emotes/${e.id}`)
			let emotesT = await res.json()
			
			let emotesTw = emotesT.filter(e => e.source == 'twitch').sort((a, b) => a.id - b.id)
			let emotesBt = emotesT.filter(e => e.source == 'bttv').sort((a, b) => a.id - b.id)
			
			this.emotes = this.emotes.concat(emotesBt.filter(e => !(e.active || e.pinned)))
			this.emotes = this.emotes.concat(emotesTw.filter(e => !(e.active || e.pinned)))
			
			this.emotes = this.emotes.concat(emotesBt.filter(e => e.active))
			this.emotes = this.emotes.concat(emotesTw.filter(e => e.active))
			
			this.emotes = this.emotes.concat(emotesBt.filter(e => e.pinned))
			this.emotes = this.emotes.concat(emotesTw.filter(e => e.pinned))
		}))
		
		res = await fetch(`https://emotes.lombra.net/api/emotes/VAULT`)
		let emotesT = await res.json()
		this.emotes = this.emotes.concat(emotesT)
		
		for (let emote of this.emotes) {
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

	async start() {
		console.log("[BetterEmotes] Started.")
	}

	stop() {
		console.log("[BetterEmotes] Stopped.")
	}

	update() {
		console.log("[BetterEmotes] Updated")
	}
}
