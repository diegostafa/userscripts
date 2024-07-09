// ==UserScript==
// @name        4chan-preview-catalog-images
// @namespace   github.com/diegostafa/userscripts
// @match       https://boards.4chan.org/*/catalog
// @match       https://boards.4channel.org/*/catalog
// @version     1
// @author      Diego <dstafa.dev@gmail.com> (github.com/diegostafa)
// @description hover on catalog images to preview them
// @run-at      document-end
// ==/UserScript==

var hovering_preview = false;
var mouseX = 0;
const previewClass = "catalogImgPreview";
const on_left_half = () => mouseX < window.innerWidth / 2;
document.onmousemove = (event) => {
  mouseX = event.clientX;
};

const create_preview = (e) => {
  e.className = previewClass;
  e.style.position = "fixed";
  e.style.top = "0";
  on_left_half() ? e.style.right = "0" : e.style.left = "0";
  e.style.width = "auto";
  e.style.height = "auto";
  e.style.maxWidth = "49%";
  e.style.maxHeight = "100%";
  e.style.zIndex = "1000000";
  e.onerror = () => document.body.removeChild(e);
  e.onmouseleave = () => document.body.removeChild(e);
  document.body.appendChild(e);
};

const on_mouse_in = (img) => () => {
  let url = img.src.replace("i.", "is2.").replace("4cdn", "4chan").replace(
    "s.",
    ".",
  );

  let jpg = document.createElement("img");
  jpg.src = url;
  create_preview(jpg);

  let png = document.createElement("img");
  png.src = url.replace("jpg", "png");
  create_preview(png);

  let gif = document.createElement("img");
  gif.src = url.replace("jpg", "gif");
  create_preview(gif);

  let webm = document.createElement("video");
  webm.src = url.replace("jpg", "webm");
  webm.autoplay = true;
  webm.loop = true;
  create_preview(webm);
};

const on_mouse_out = (img) => () => {
  document.querySelectorAll("." + previewClass).forEach((e) =>
    document.body.removeChild(e)
  );
};

const images = document.querySelectorAll("img.thumb");
images.forEach((img) => {
  img.onmouseenter = on_mouse_in(img);
  img.onmouseleave = on_mouse_out(img);
});
