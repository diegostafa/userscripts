// ==UserScript==
// @name        4chan-sort-comments
// @namespace   github.com/diegostafa/userscripts
// @match       https://boards.4chan.org/*/thread/*
// @match       https://boards.4channel.org/*/thread/*
// @version     3
// @author      Diego <dstafa.dev@gmail.com> (github.com/diegostafa)
// @description sort comments with differnt criterias (placed under the thread watcher)
// @run-at      document-end
// ==/UserScript==

const sortComments = (sortingRule) => {
    let thread = document.querySelector(".thread");
    let comments = [...thread.children];

    comments.shift(); // ignore OP
    comments.sort(sortingRule);
    comments.forEach(comment => {
        thread.appendChild(comment);
    });
};

const urlRegex = /.*:(\/\/|\?).*/gi;

const isImage = (file) => {
    return !file.endsWith(".webm") && !file.endsWith(".gif");
};

const byRepliesDesc = (a, b) => {
    const repliesA = a.querySelectorAll(".backlink > span").length;
    const repliesB = b.querySelectorAll(".backlink > span").length;
    return repliesB - repliesA;
};

const byTimeDesc = (a, b) => {
    const timeA = a.querySelector(".dateTime").getAttribute("data-utc");
    const timeB = b.querySelector(".dateTime").getAttribute("data-utc");
    return timeA - timeB;
};

const byImagesFirst = (a, b) => {
    const fileA = a.querySelector(".fileThumb");
    const fileB = b.querySelector(".fileThumb");

    if (fileB && isImage(fileB.getAttribute("href")))
        return 1;
    if (fileA && isImage(fileA.getAttribute("href")))
        return -1;
    return 0;
};

const byVideosFirst = (a, b) => {
    const fileA = a.querySelector(".fileThumb");
    const fileB = b.querySelector(".fileThumb");

    if (fileB && !isImage(fileB.getAttribute("href")))
        return 1;
    if (fileA && !isImage(fileA.getAttribute("href")))
        return -1;
    return 0;
};

const byLinksFirst = (a, b) => {
    const textA = a.querySelector(".postMessage").innerText;
    const textB = b.querySelector(".postMessage").innerText;

    return urlRegex.test(textB) - urlRegex.test(textA);
};

const byDeadLinkFirst = (a, b) => {
    const deadlinkA = a.querySelector(".deadlink");
    const deadlinkB = b.querySelector(".deadlink");

    if (deadlinkB)
        return 1;
    if (deadlinkA)
        return -1;
    return 0;
};

const createSortButton = (text, action) => {
    let button = document.createElement("div");
    button.addEventListener("click", action);
    button.innerHTML = text;
    button.style.backgroundColor = "#444444";
    button.style.color = "white";
    button.style.textAlign = "center";
    button.style.border = "none";
    button.style.padding = "2px";
    button.style.cursor = "pointer";
    return button;
};

const createBtnContainer = () => {
    let div = document.createElement("div");
    div.style.display = "grid";
    div.style.gridTemplateColumns = "repeat(2, 1fr)";
    div.style.gridGap = "2px";
    return div;
};

const onThreadWatcherReady = () => {
    let threadWatcher = document.getElementById("threadWatcher");

    if (!threadWatcher) return;

    threadWatcher.appendChild(btnContainer);
    docObserver.disconnect();
};

let btnContainer = createBtnContainer();
btnContainer.appendChild(createSortButton("by replies", () => { sortComments(byRepliesDesc); }));
btnContainer.appendChild(createSortButton("by time", () => { sortComments(byTimeDesc); }));
btnContainer.appendChild(createSortButton("images first", () => { sortComments(byImagesFirst); }));
btnContainer.appendChild(createSortButton("videos first", () => { sortComments(byVideosFirst); }));
btnContainer.appendChild(createSortButton("links first", () => { sortComments(byLinksFirst); }));
btnContainer.appendChild(createSortButton("deadlinks first", () => { sortComments(byDeadLinkFirst); }));

const docObserver = new MutationObserver(onThreadWatcherReady);
docObserver.observe(document, { attributes: false, childList: true, subtree: true });
