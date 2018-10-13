//META{"name":"BetterEmotes"}*//
function BetterEmotes() {}

BetterEmotes.emotelist = {}
BetterEmotes.isReady = false

BetterEmotes.prototype.load = function() {
	function preloadImages() {
		if (!preloadImages.list) {
			preloadImages.list = []
		}
		for (var emote in BetterEmotes.emotelist) {
			var img = new Image()
			img.onload = function() {
				var index = preloadImages.list.indexOf(this);
				if (index !== -1) {
					// remove image from the array once it's loaded
					// for memory consumption reasons
					preloadImages.list.splice(index, 1)
					if (preloadImages.list.length == 0) {
						console.log("[BetterEmotes] Emotes Preloaded")
					}
				}
			}
			preloadImages.list.push(img)
			img.src = BetterEmotes.emotelist[emote].url
		}
		console.log("[BetterEmotes] Preloading " +preloadImages.list.length+ " emote(s)")
	}
	$.getJSON("https://raw.githubusercontent.com/Lombra/BetterEmotes/master/emotes.json?t=" +(new Date().getTime()), function(list) {
		BetterEmotes.emotelist = list
		emoteModule.categories.splice(0, 0, "BetterEmotes")
		settingsCookie["bda-es-betteremotes"] = true
		bdEmoteSettingIDs.BetterEmotes = "bda-es-betteremotes"
		bdEmotes.BetterEmotes = {}
		for (let [emote, file] of Object.entries(list)) {
			file = encodeURI(file)
			bdEmotes.BetterEmotes[emote] = "https://cdn.rawgit.com/Lombra/BetterEmotes/master/emotes/" + file
		}
		BetterEmotes.isReady = true
		preloadImages()
		console.log("[BetterEmotes] Ready")
	}).fail(function(xhr, status, error) {
		console.log("[BetterEmotes] Error Loading emotelist '" +status+ ":" +error+ "'. Using fallback")
		BetterEmotes.isReady = true
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
