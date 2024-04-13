// ==UserScript==
// @name        4chan-auto-update-thread
// @namespace   github.com/diegostafa/userscripts
// @match       https://boards.4chan.org/*/thread/*
// @match       https://boards.4channel.org/*/thread/*
// @version     2
// @author      Diego <dstafa.dev@gmail.com> (github.com/diegostafa)
// @description checkbox to automatically update the current thread every 5 seconds
// @run-at      document-end
// ==/UserScript==

let thread = document.querySelector(".thread");
let replies = thread.children.length;

let observer = new MutationObserver(() => {
  let newReplies = thread.children.length;
  if (replies == newReplies) return;
  replies = newReplies;

  document
    .querySelector(".thread > :last-child")
    .scrollIntoView({ behavior: "smooth", block: "start" });
});

const startObserving = () =>
  observer.observe(thread, {
    attributes: false,
    childList: true,
    subtree: true,
  });
const stopObserving = () => observer.disconnect();
const toggleObserver = (cb) => () =>
  cb.checked ? startObserving() : stopObserving();

const buildUi = () => {
  let cb = document.createElement("input");
  cb.type = "checkbox";
  cb.id = "autoUpdateThread";
  cb.name = "autoUpdateThread";
  cb.addEventListener("change", toggleObserver(cb));

  let lb = document.createElement("label");
  lb.htmlFor = "autoUpdateThread";
  lb.appendChild(document.createTextNode("auto update thread"));

  let botNavLinks = document.querySelector(".navLinks.navLinksBot");
  botNavLinks.appendChild(cb);
  botNavLinks.appendChild(lb);

  return cb;
};

const autoUpdate = () => {
  let cb = buildUi();
  let updateBtn = document.querySelector('a[data-cmd="update"]');
  setInterval(() => {
    if (cb.checked) updateBtn.click();
  }, 5000);
};

autoUpdate();
