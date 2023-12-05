// ==UserScript==
// @name        twitter-hide-reposts
// @namespace   github.com/diegostafa/userscripts
// @match       https://twitter.com/home
// @grant       none
// @version     2
// @author      Diego <dstafa.dev@gmail.com> (github.com/diegostafa)
// @description hide reposts in the home feed
// @run-at      document-end
// ==/UserScript==

const hideRepost = (post) => {
  if (post.querySelector("div.css-1dbjc4n.r-1iusvr4.r-16y2uox.r-19urhcx a"))
    post.style.display = "none";
};

const observeFeed = () => {
  let feed = document.querySelector('[aria-label="Timeline: Your Home Timeline"]');

  if (!feed) return;

  Array
    .from(feed.firstElementChild.children)
    .forEach(hideRepost);
};

const docObserver = new MutationObserver(observeFeed);
docObserver.observe(document, { attributes: false, childList: true, subtree: true });
