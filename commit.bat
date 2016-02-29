@echo off
lua make-json.lua
svn add -q emotes\*
svn commit -m "Update emotes"