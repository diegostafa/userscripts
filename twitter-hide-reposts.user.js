// ==UserScript==
// @name        twitter hide reposts
// @namespace   github.com/diegostafa/userscripts
// @match       https://twitter.com/home
// @grant       none
// @version     1.0
// @author      Diego <dstafa.dev@gmail.com> (github.com/diegostafa)
// @description hide twitter reposts in the home feed
// @run-at      document-end
// ==/UserScript==

var feed = null;

const hideRepost = (post) => {
  const minRepostDepth = 8;
  var repostHeader = post;

  for (let i = 0; i < minRepostDepth; i++) {
    if(repostHeader.firstChild)
      repostHeader = repostHeader.firstChild;
    else
      return;
  }

  if(repostHeader.firstChild)
    post.style.display = "none";
};

const onFeedReady = (muts, observer) => {
  feed = document.querySelector('[aria-label="Timeline: Your Home Timeline"]');

  if(feed !== null){
    observer.disconnect();
    const feedObserver = new MutationObserver(onFeedUpdate);
    feedObserver.observe(feed, { attributes: false, childList: true, subtree: true });
  }
};

const onFeedUpdate = (muts, observer) => {
  var postList = [...feed.children][0];
  var posts = [...postList.children];
  posts.forEach(hideRepost);
};

const docObserver = new MutationObserver(onFeedReady);
docObserver.observe(document, { attributes: false, childList: true, subtree: true });

