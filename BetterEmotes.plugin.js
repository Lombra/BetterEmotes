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
	MutationObserver = window.MutationObserver || window.WebKitMutationObserver
	var observer = new MutationObserver(function(mutations, observer) {
		// if (BetterEmotes.isReady) BetterEmotes.process()
	})
	// var start_try = setInterval(function() {
		// if (BetterEmotes.isReady) clearInterval(start_try)
		// else return
		
		// var chat_tries = 0;
		// var chat_retry = setInterval(function() {
			// chat_tries++
			// $(".chat").each (function() {
				// console.log("[BetterEmotes] Chat listener attached after " +chat_tries+ " tries")
				// clearInterval(chat_retry)
				// observer.observe (this, {childList: true, characterData: true, attributes: false, subtree: true})
			// })
		// }, 100)
		// BetterEmotes.emote_list_construct()
		
		// console.log("[BetterEmotes] Started.")
	// }, 100)
}

BetterEmotes.prototype.observer = function() {
	// MutationObserver = window.MutationObserver || window.WebKitMutationObserver
	// var observer = new MutationObserver(function(mutations, observer) {
		if (BetterEmotes.isReady) BetterEmotes.process()
		// ...
	// })
	// var start_try = setInterval(function() {
		// if (BetterEmotes.isReady) clearInterval(start_try)
		// else return
		
		// var chat_tries = 0;
		// var chat_retry = setInterval(function() {
			// chat_tries++
			// $(".chat").each (function() {
				// console.log("[BetterEmotes] Chat listener attached after " +chat_tries+ " tries")
				// clearInterval(chat_retry)
				// observer.observe (this, {childList: true, characterData: true, attributes: false, subtree: true})
			// })
		// }, 100)
		// BetterEmotes.emote_list_construct()
		
		// console.log("[BetterEmotes] Started.")
	// }, 100)
}

BetterEmotes.emote_list_construct = function() {
	var quick_tries = 0
	var quick_retry = setInterval(function() {
		quick_tries++
		var quick_tabs = $(".emote-menu-tab")
		if (quick_tabs.length > 1) {
			console.log("[BetterEmotes] Quick tab inserted after " +quick_tries+ " tries")
			clearInterval(quick_retry)
			$("#emote-menu>.scroller-wrap>.scroller").append(
				$("<div/>", {
					id: "s_emo_pane",
				}).hide()
			)
		}
	}, 100)
}

BetterEmotes.emote_list_deconstruct = function() {
	// Used to remove the Plugin Tab from the Quick Emote Menu.
	$("#s_emo_pane").remove()
	// $("#s_emo_qtab").remove()
}

var modifiers = ["flip", "spin", "pulse", "spin2", "spin3", "1spin", "2spin", "3spin", "tr", "bl", "br", "shake", "shake2", "shake3", "flap"]

BetterEmotes.process = function() {
	$(".message-content > span:not(.s_emos_scanned), .comment .markup:not(.s_emos_scanned), .comment .markup > span:not(.s_emos_scanned)").each(function() {
		var textnode = $(this).contents().filter(function() {return this.nodeType === 3})
		var jtextnode = $(textnode)
		if (!jtextnode.html()) {
			var oldHeight = this.parentElement.offsetHeight
			jtextnode.replaceWith(function() {
				var html = this.nodeValue
				$.each(BetterEmotes.emotelist, function(key, emote) {
					html = html.replace(new RegExp("(^|\\s)" +key.replace(/[\^\\\(\)]/g, "\\$&")+ "(?=$|\\s)", 'g'), "$1<img class='emote s_emo' alt='"+key+"' src='" + "https://cdn.rawgit.com/Lombra/BetterEmotes/master/emotes/" +emote+"'>")
					for (var i = 0; i < modifiers.length; i++) {
						html = html.replace(new RegExp("(^|\\s)" +key.replace(/[\^\\\(\)]/g, "\\$&")+ ":(" +modifiers[i]+ ")(?=$|\\s)", 'g'), "$1<img class='emote emote$2 s_emo' alt='"+key+"' src='" + "https://cdn.rawgit.com/Lombra/BetterEmotes/master/emotes/" +emote+"'>")
					}
				})
				return html
			})
			var newHeight = this.parentElement.offsetHeight

			//Scrollfix
			var scrollPane = $(".scroller.messages").first()
			scrollPane.scrollTop(scrollPane.scrollTop() + (newHeight - oldHeight))
		}
	}).addClass("s_emos_scanned")
}

BetterEmotes.prototype.stop = function() {
	$(".s_emo").replaceWith(function() {return "<span>" +$(this).prop("alt")+ "</span>"})
	//End of Info to remove the Plugin things from the Quick Emote Window. Yes this reizes it just so that all of the emotes are seen like before.
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
	return "Early Access"
};

BetterEmotes.prototype.getAuthor = function() {
	return "Lombra"
};
