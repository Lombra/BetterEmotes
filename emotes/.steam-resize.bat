convert -crop 54x54+4+4 -resize 28x28 %1 %~n1-1%~x1
convert -crop 54x54+4+4 -adaptive-resize 28x28 %1 %~n1-2%~x1
del %1