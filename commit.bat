@echo off
node make-json.js
svn add -q --force emotes\*
svn commit -m "Update emotes"