// ==UserScript==
// @name        4chan-restore-deadlinks
// @namespace   github.com/diegostafa/userscripts
// @match       https://boards.4chan.org/*/thread/*
// @match       https://boards.4channel.org/*/thread/*
// @version     4
// @author      Diego <dstafa.dev@gmail.com> (github.com/diegostafa)
// @description restore and point deadlinks and removed files to their respective archives
// @run-at      document-end
// ==/UserScript==

const turnObjectInsideOut = (obj) => Object.fromEntries(Object.entries(obj).flatMap(([k, vs]) => vs.map((v) => [v, k])));

const archives = turnObjectInsideOut({
    "desuarchive.org": ["a", "aco", "an", "c", "cgl", "co", "d", "fit", "g", "his", "int", "k", "m", "mlp", "mu", "q", "qa", "r9k", "tg", "trash", "vr", "wsg"],
    "archive.4plebs.org": ["adv", "f", "hr", "o", "pol", "s4s", "sp", "tg", "trv", "tv", "x"],
    "archived.moe": ["3", "a", "aco", "adv", "an", "asp", "b", "bant", "biz", "c", "can", "cgl", "ck", "cm", "co", "cock", "con", "d", "diy", "e", "f", "fa", "fap", "fit", "fitlit", "g", "gd", "gif", "h", "hc", "his", "hm", "hr", "i", "ic", "int", "jp", "k", "lgbt", "lit", "m", "mlp", "mlpol", "mo", "mtv", "mu", "n", "news", "o", "out", "outsoc", "p", "po", "pol", "pw", "q", "qa", "qb", "qst", "r", "r9k", "s", "s4s", "sci", "soc", "sp", "spa", "t", "tg", "toy", "trash", "trv", "tv", "u", "v", "vg", "vint", "vip", "vm", "vmg", "vp", "vr", "vrpg", "vst", "vt", "w", "wg", "wsg", "wsr", "x", "xs", "y"],
    "warosu.org": ["3", "biz", "cgl", "ck", "diy", "fa", "ic", "jp", "lit", "sci", "vr", "vt"]
});

const urlParts = window.location.pathname.split("/").filter((s) => s !== "");
const boardId = urlParts[0];
const threadId = urlParts[2];
const archive = archives[boardId];

const getArchiveLink = (quoteId) => {
    if (archive === "warosu.org")
        return `https://${archive}/${boardId}/thread/${quoteId}`;
    else
        return `https://${archive}/${boardId}/thread/${threadId}/#q${quoteId}`;
};

const createLinkToArchive = (text, archiveLink) => {
    let link = document.createElement('a');
    link.textContent = text;
    link.href = archiveLink;
    link.classList.add("quotelink");
    link.setAttribute("target", "_blank");
    return link;
};

const restoreDeadlink = (deadlink) => {
    let quoteId = deadlink.textContent.split(">>").pop();
    let text = deadlink.textContent + " (DEAD)";
    deadlink.textContent = "";
    deadlink.appendChild(createLinkToArchive(text, getArchiveLink(quoteId)));
};

const restoreDeadfile = (deadfile) => {
    let quoteId = deadfile.parentNode.parentNode.parentNode.id.split("p").pop();
    let parent = deadfile.parentNode;
    parent.removeChild(deadfile);
    parent.classList.add("deadlink");
    parent.appendChild(createLinkToArchive("FILE REMOVED", getArchiveLink(quoteId)));
};


const main = () => {
    Array
        .from(document.querySelectorAll(".thread .deadlink"))
        .forEach(restoreDeadlink);

    Array
        .from(document.querySelectorAll(".fileDeletedRes"))
        .forEach(restoreDeadfile);
};

main();
