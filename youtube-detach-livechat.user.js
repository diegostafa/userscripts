// ==UserScript==
// @name        youtube-detach-livechat
// @namespace   github.com/diegostafa/userscripts
// @match       https://www.youtube.com/*
// @version     1
// @author      Diego <dstafa.dev@gmail.com> (github.com/diegostafa)
// @description Add a toggle to detach and drag the livechat
// ==/UserScript==

let prevMousePos = { x: 0, y: 0 };
let dragging = false;

const attachedStyle = {
    position: "static",
    zIndex: "0",
};
const detachedStyle = {
    position: "fixed",
    zIndex: "10000",
};

const dragStart = (event) => {
    dragging = true;
    prevMousePos.x = event.clientX;
    prevMousePos.y = event.clientY;
};

const dragEnd = () => dragging = false;

const drag = (chat) => (event) => {
    if (!dragging) return;

    let top = chat.getBoundingClientRect().top;
    let left = chat.getBoundingClientRect().left;
    let dx = event.clientX - prevMousePos.x;
    let dy = event.clientY - prevMousePos.y;

    chat.style.left = (dx + left) + "px";
    chat.style.top = (dy + top) + "px";
};

const toggleLiveChat = (toggle, chat) => () =>
    toggle.checked
        ? Object.assign(chat.style, detachedStyle)
        : Object.assign(chat.style, attachedStyle);

const setToggle = () => {
    let frame = document.querySelector("#chatframe")?.contentDocument;
    if (!frame) return;

    if (frame.querySelector("#detachLiveChat")) return;

    let header = frame.querySelector("yt-live-chat-header-renderer");
    if (!header) return;

    let chat = document.querySelector("#chat-container");
    let toggle = document.createElement("input");
    toggle.type = "checkbox";
    toggle.checked = chat.style.position == "fixed";
    toggle.id = "detachLiveChat";
    toggle.addEventListener("change", toggleLiveChat(toggle, chat));

    header.prepend(toggle);
    header.addEventListener("mousedown", dragStart);
    header.addEventListener("mouseup", dragEnd);
    header.addEventListener("mousemove", drag(chat));
};

setInterval(setToggle, 2000);
