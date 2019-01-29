
submit:
	cd panelScroll@sun.wxg@gmail.com/ && zip -r ~/panelScroll.zip *

install:
	rm -rf ~/.local/share/gnome-shell/extensions/panelScroll@sun.wxg@gmail.com
	cp -r panelScroll@sun.wxg@gmail.com ~/.local/share/gnome-shell/extensions/

