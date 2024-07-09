// ==UserScript==
// @name        4chan-auto-watcher
// @namespace   github.com/diegostafa/userscripts
// @match       https://boards.4chan.org/*/catalog
// @match       https://boards.4channel.org/*/catalog
// @version     3
// @author      Diego <dstafa.dev@gmail.com> (github.com/diegostafa)
// @description automatically watch threads matching a pattern
// @run-at      document-end
// ==/UserScript==

const currentBoard = window.location.pathname.split("/").filter((s) => s !== "")[0];

let boardsAndFilters = [
    ["", /^[^a-z]*$/],
];

const buildUi = () => {

    const createButton = (text) => {
        let button = document.createElement("div");
        button.innerHTML = text;
        button.style.backgroundColor = "#444444";
        button.style.color = "white";
        button.style.textAlign = "center";
        button.style.border = "none";
        button.style.padding = "2px";
        button.style.cursor = "pointer";
        return button;
    };

    const createAutowatchButton = () => {
        let button = createButton("autowatch");
        button.addEventListener("click", () => { autoWatch(); });
        return button;
    };

    const createConfigButton = () => {
        let button = createButton("config");

        button.addEventListener("click", () => {
            var win = window.open("", "Autowatch config", "toolbar=no");
            win.document.body.innerHTML = `TODO`;

        });

        return button;
    };

    let threadWatcher = document.getElementById("threadWatcher");
    let btnContainer = document.createElement("div");

    btnContainer.style.display = "grid";
    btnContainer.style.gridTemplateColumns = "100%";
    btnContainer.style.gridGap = "2px";
    //btnContainer.appendChild(createConfigButton());
    btnContainer.appendChild(createAutowatchButton());

    threadWatcher.appendChild(btnContainer);
};

const isThreadMatching = (filters) => (thread) => {
    const teaser = thread.querySelector('.teaser');
    if (!teaser) return false;

    for (const [board, filter] of filters)
        if (filter.test(teaser.textContent) && (board === "" || currentBoard === board))
            return true;
};

const autoWatch = () => {
    let threads = Array.from(document.querySelectorAll('#threads .thread'));

    threads
        .filter(isThreadMatching(boardsAndFilters))
        .map((thread) => thread.querySelector('span.watchIcon'))
        .filter((watchIcon) => watchIcon !== null)
        .forEach((watchIcon) => watchIcon.click());
};

buildUi();
