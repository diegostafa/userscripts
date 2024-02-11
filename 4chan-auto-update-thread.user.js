// ==UserScript==
// @name        4chan-auto-update-thread
// @namespace   github.com/diegostafa/userscripts
// @match       https://boards.4chan.org/*/thread/*
// @match       https://boards.4channel.org/*/thread/*
// @version     1
// @author      Diego <dstafa.dev@gmail.com> (github.com/diegostafa)
// @description checkbox to automatically update the current thread every 5 seconds
// @run-at      document-end
// ==/UserScript==

let autoUpdateCb = document.createElement('input');
autoUpdateCb.type = 'checkbox';
autoUpdateCb.id = 'autoUpdateThread';
autoUpdateCb.name = 'autoUpdateThread';

let autoUpdateLb = document.createElement('label');
autoUpdateLb.htmlFor = 'autoUpdateThread';
autoUpdateLb.appendChild(document.createTextNode('auto update thread'));

let botNavLinks = document.querySelector('.navLinks.navLinksBot');
botNavLinks.appendChild(autoUpdateCb);
botNavLinks.appendChild(autoUpdateLb);

let updateLink = document.querySelector('a[data-cmd="update"]');
setInterval(() => {
    if (autoUpdateCb.checked)
        updateLink.click();
}, 5000);
