local lfs = require("lfs")
local json = require("json")

local magic = {
	["{col}"] = ":",
	["{fsl}"] = "/",
	["{bsl}"] = "\\",
	["{pip}"] = "|",
}

local emotes = {}

lfs.chdir("emotes")

for obj in lfs.dir(".") do
	if lfs.attributes(obj, "mode") == "file" and obj ~= ".steam-resize.bat" then
		emotes[obj:match("^([^%.]+)"):gsub("%b{}", magic)] = obj
	end
end

lfs.chdir("..")

local file = io.open("emotes.json", "w")
file:write(json.encode(emotes))
file:close()
