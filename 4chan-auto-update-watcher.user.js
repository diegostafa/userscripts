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

const title = document.title;

const updateDocumentTitle = () => {
    let newReplies = document.querySelectorAll("#watchList .hasNewReplies");
    let newYous = document.querySelectorAll("#watchList .hasYouReplies");

    if (newReplies.length === 0) {
        document.title = title;
        return;
    }

    let youMark = "";
    if (newYous.length !== 0) youMark = "*";

    let newRepliesCount = Array
        .from(newReplies)
        .map((item) => item.innerHTML.split(" ")[0].slice(1, -1))
        .reduce((prev, curr) => Number(prev) + Number(curr));

    document.title = youMark + "(" + newRepliesCount + ")" + " " + title;
};

const autoUpdateWatcher = () => {
    let refreshIcon = document.querySelector("#twPrune");
    let clickEvent = document.createEvent("MouseEvents");
    clickEvent.initEvent("mouseup", true, true);
    refreshIcon.dispatchEvent(clickEvent);

    setInterval(() => {
        refreshIcon.dispatchEvent(clickEvent);
        updateDocumentTitle();
    }, 5000);
};

const onThreadWatcherReady = () => {
    if (!document.getElementById("threadWatcher")) return;
    docObserver.disconnect();
    autoUpdateWatcher();
};

const docObserver = new MutationObserver(onThreadWatcherReady);
docObserver.observe(document, {
    attributes: false,
    childList: true,
    subtree: true,
});
