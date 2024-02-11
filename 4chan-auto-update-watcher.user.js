// ==UserScript==
// @name        4chan-auto-update-watcher
// @namespace   github.com/diegostafa/userscripts
// @match       https://boards.4chan.org/*/*
// @match       https://boards.4channel.org/*/*
// @version     2
// @author      Diego <dstafa.dev@gmail.com> (github.com/diegostafa)
// @description automatically update the thread watcher and the current thread every 5 seconds
// @run-at      document-end
// ==/UserScript==

const autoUpdateWatcher = () => {
    let refreshIcon = document.querySelector("#twPrune");
    let clickEvent = document.createEvent("MouseEvents");
    clickEvent.initEvent("mouseup", true, true);
    refreshIcon.dispatchEvent(clickEvent);

    setInterval(() => {
        refreshIcon.dispatchEvent(clickEvent);
    }, 5000);
};

const onThreadWatcherReady = () => {
    if (!document.getElementById("threadWatcher")) return;

    docObserver.disconnect();
    autoUpdateWatcher();
};

const docObserver = new MutationObserver(onThreadWatcherReady);
docObserver.observe(document, { attributes: false, childList: true, subtree: true });
