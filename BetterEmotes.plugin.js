/**
 * @name BetterEmotes
 * @version 1.0.0
 * @description Custom emotes
 * @author Lombra
 * @source https://github.com/Lombra/BetterEmotes
 * @updateUrl https://github.com/Lombra/BetterEmotes/raw/master/BetterEmotes.plugin.js
**/

class BetterEmotes {
	emotes = []
	
	async start() {
		this.loadEmotes()
		console.log("[BetterEmotes] Started")
	}

	stop() {
		console.log("[BetterEmotes] Stopped")
	}
	
	async loadEmotes() {
		let channels = await this.getChannels()
		
		let res = await fetch('https://emotes.lombra.net/filter.json')
		let filter = await res.json()
		for (let emote of filter.whitelist) bemotes.splice(bemotes.findIndex(e => e == emote), 1)
		bemotes.push(...filter.blacklist)
		
		let emotes = await Promise.all(channels.map(async e => {
			let res = await fetch(`https://emotes.lombra.net/api/emotes/${e.id}`)
			return res.json()
		}))
		
		this.emotes = this.emotes.concat(...emotes).sort((a, b) => {
			if (a.pinned != b.pinned)
				return a.pinned - b.pinned
			if (a.active != b.active)
				return a.active - b.active
			if (a.source != b.source)
				return a.source.localeCompare(b.source)
			return a.id - b.id
		})
		
		for (let emote of this.emotes) {
			BdApi.emotes['TwitchSubscriber'][emote.code] = `https://emotes.lombra.net/emotes/${emote.source}/1x/${emote.id}`
		}
		
		res = await fetch('https://raw.githubusercontent.com/Lombra/BetterEmotes/master/emotes.json?t=' +(new Date().getTime()))
		let list = await res.json()
		for (let [emote, file] of Object.entries(list)) {
			file = encodeURI(file)
			BdApi.emotes['TwitchSubscriber'][emote] = "https://cdn.rawgit.com/Lombra/BetterEmotes/master/emotes/" + file
		}
	}
	
	async getChannels() {
		let res = await fetch('https://emotes.lombra.net/api/channels')
		if (!res.ok) console.error("Unable to get channels")
		let channels = await res.json()
		channels.push({ id: 0 })
		channels.push({ id: 'VAULT' })
		return channels
	}
}
