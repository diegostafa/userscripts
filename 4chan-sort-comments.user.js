// ==UserScript==
// @name        4chan-sort-comments
// @namespace   github.com/diegostafa/userscripts
// @match       https://boards.4chan.org/*/thread/*
// @match       https://boards.4channel.org/*/thread/*
// @version     4
// @author      Diego <dstafa.dev@gmail.com> (github.com/diegostafa)
// @description sort comments with differnt criterias (placed under the thread watcher)
// @run-at      document-end
// ==/UserScript==

// --- regex

const isVideoRegex = /.*(webm|gif)$/;
const isUrlRegex = /.*:(\/\/|\?).*/gi;
const isOpReplyRegex = /.* \(OP\)$/;

const sortComments = (sortingRule) => {
  let thread = document.querySelector(".thread");
  let comments = [...thread.children];

  comments.shift(); // ignore OP
  comments.sort(sortingRule);
  comments.forEach((comment) => {
    thread.appendChild(comment);
  });
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
  return (fileB && !isVideoRegex.test(fileB)) -
    (fileA && !isVideoRegex.test(fileA));
};

const byVideosFirst = (a, b) => {
  const fileA = a.querySelector(".fileThumb");
  const fileB = b.querySelector(".fileThumb");
  return (fileB && isVideoRegex.test(fileB)) -
    (fileA && isVideoRegex.test(fileA));
};

const byLinksFirst = (a, b) => {
  const textA = a.querySelector(".postMessage").innerText;
  const textB = b.querySelector(".postMessage").innerText;
  return isUrlRegex.test(textB) - isUrlRegex.test(textA);
};

const byDeadLinkFirst = (a, b) => {
  const deadlinkA = a.querySelector(".deadlink");
  const deadlinkB = b.querySelector(".deadlink");
  return deadlinkB - deadlinkA;
};

const byOpRepliesFirst = (a, b) => {
  const quoteA = a.querySelector(".postMessage .quotelink")?.innerText || "";
  const quoteB = b.querySelector(".postMessage .quotelink")?.innerText || "";
  return isOpReplyRegex.test(quoteB) - isOpReplyRegex.test(quoteA);
};

const createSortButton = (text, sortMethod) => {
  let button = document.createElement("div");
  button.addEventListener("click", () => sortComments(sortMethod));
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
  div.style.gridTemplateColumns = "auto auto auto";
  div.style.gridGap = "2px";
  return div;
};

const setupUiWhenTWReady = () => {
  let threadWatcher = document.getElementById("threadWatcher");
  if (threadWatcher) {
    threadWatcher.appendChild(btnContainer);
    docObserver.disconnect();
  }
};

let btnContainer = createBtnContainer();
btnContainer.appendChild(createSortButton("by replies", byRepliesDesc));
btnContainer.appendChild(createSortButton("by time", byTimeDesc));
btnContainer.appendChild(createSortButton("images first", byImagesFirst));
btnContainer.appendChild(createSortButton("videos first", byVideosFirst));
btnContainer.appendChild(createSortButton("links first", byLinksFirst));
btnContainer.appendChild(createSortButton("deadlinks first", byDeadLinkFirst));
btnContainer.appendChild(
  createSortButton("op replies first", byOpRepliesFirst),
);

let docObserver = new MutationObserver(setupUiWhenTWReady);
docObserver.observe(document, {
  attributes: false,
  childList: true,
  subtree: true,
});
