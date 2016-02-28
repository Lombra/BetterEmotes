local lfs = require("lfs")
local json = require("json")

local magic = {
	["{col}"] = ":",
	["{fsl}"] = "/",
	["{bsl}"] = "\\",
}

local emotes = {}

for obj in lfs.dir("emotes") do
	if lfs.attributes("emotes\\"..obj, "mode") == "file" then
		emotes[obj:match("^([^%.]+)"):gsub("%b{}", magic)] = obj
	end
end

local file = io.open("emotes.json", "w")
file:write(json.encode(emotes))
file:close()
