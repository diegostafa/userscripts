// ==UserScript==
// @name        4chan sort comments
// @namespace   github.com/diegostafa/userscripts
// @match       https://boards.4chan.org/*/thread/*
// @match       https://boards.4channel.org/*/thread/*
// @grant       none
// @version     1.0
// @author      Diego <dstafa.dev@gmail.com> (github.com/diegostafa)
// @description Buttons to sort 4chan comments (placed under the thread watcher)
// @run-at      document-end
// ==/UserScript==

const sortComments = (sortPolicy) => {
  var thread = document.querySelector(".thread");
  var comments = [...thread.children];
  comments.shift() // ignore OP
  comments.sort(sortPolicy);
  comments.forEach(comment => {
    thread.appendChild(comment);
  });
}

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

const isImage = (file) => {
  return !file.endsWith(".webm") && !file.endsWith(".gif");
}

const byImageFirst = (a, b) => {
  const fileA = a.querySelector(".fileThumb");
  const fileB = b.querySelector(".fileThumb");

  if (fileB !== null && isImage(fileB.getAttribute("href")))
    return 1;
  if (fileA !== null && isImage(fileA.getAttribute("href")))
    return -1;
  return 0;
};

const byVideoFirst = (a, b) => {
  const fileA = a.querySelector(".fileThumb");
  const fileB = b.querySelector(".fileThumb");

  if (fileB !== null && !isImage(fileB.getAttribute("href")))
    return 1;
  if (fileA !== null && !isImage(fileA.getAttribute("href")))
    return -1;
  return 0;
};

const createSortButton = (text, sortPolicy) => {
  var button = document.createElement("div");
  button.addEventListener("click", () => { sortComments(sortPolicy); });
  button.innerHTML = text;
  button.style.backgroundColor = "#444444";
  button.style.color = "white";
  button.style.textAlign = "center";
  button.style.border = "none";
  button.style.padding = "2px";
  button.style.cursor = "pointer";
  return button;
}

const createBtnContainer = () => {
  var div = document.createElement("div");
  div.style.display = "grid";
  div.style.gridTemplateColumns = "repeat(2, 1fr)";
  div.style.gridGap = "2px";
  return div;
}

var threadWatcher = document.getElementById("threadWatcher");
var btnContainer = createBtnContainer();

btnContainer.appendChild(createSortButton("sort by replies", byRepliesDesc));
btnContainer.appendChild(createSortButton("sort by time", byTimeDesc));
btnContainer.appendChild(createSortButton("sort by images", byImageFirst));
btnContainer.appendChild(createSortButton("sort by videos", byVideoFirst));
threadWatcher.appendChild(btnContainer);