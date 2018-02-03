const fs = require("fs")

const magic = {
	["{col}"]: ":",
	["{fsl}"]: "/",
	["{bsl}"]: "\\",
	["{pip}"]: "|",
}

function escape(e) {
	return magic[e] || e
}

let emotes = {}

for (file of fs.readdirSync("emotes")) {
	if (file != ".steam-resize.bat") {
		let [keyword] = file.match(/[^\.]+/)
		emotes[keyword.replace(/{.+?}/g, escape)] = file
	}
}

fs.writeFile("emotes.json", JSON.stringify(emotes))
