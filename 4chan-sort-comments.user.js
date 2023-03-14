// ==UserScript==
// @name        4chan sort comments
// @namespace   github.com/diegostafa/userscripts
// @match       https://boards.4chan(nel)?.org/*/thread/*
// @grant       none
// @version     1.0
// @author      Diego <dstafa.dev@gmail.com> (github.com/diegostafa)
// @description Buttons to sort 4chan comments by number of replies or time (placed under the thread watcher)
// ==/UserScript==

const sortComments = (sortPolicy) => {
  var thread = document.querySelector(".thread");
  var comments = [...thread.children];
  comments.shift()
  comments.sort(sortPolicy);
  comments.forEach(comment => {
    thread.appendChild(comment);
  });
}

const byReplies = (a, b) => {
    const repliesA = a.querySelectorAll(".backlink > span").length;
    const repliesB = b.querySelectorAll(".backlink > span").length;
    return repliesB - repliesA;
  };

const byTime = (a, b) => {
    const timeA = a.querySelector(".dateTime").getAttribute("data-utc");
    const timeB = b.querySelector(".dateTime").getAttribute("data-utc");
    return timeA - timeB;
  };

const createSortButton = (text, sortPolicy) => {
  var button = document.createElement("div");
  button.addEventListener("click", () => { sortComments(sortPolicy); });
  button.innerHTML = text;
  button.style.width = "100%";
  button.style.backgroundColor = "#444444";
  button.style.color = "white";
  button.style.textAlign = "center";
  button.style.marginTop = "2px";
  button.style.border = "none";
  button.style.cursor = "pointer";
  return button;
}

var threadWatcher = document.getElementById("threadWatcher");
threadWatcher.appendChild(createSortButton("sort by replies", byReplies));
threadWatcher.appendChild(createSortButton("sort by time", byTime));
