// ==UserScript==
// @name        uniweb-autologin
// @namespace   github.com/diegostafa/userscripts
// @match       https://stem.elearning.unipd.it/login/index.php
// @match       https://shibidp.cca.unipd.it/idp/profile/SAML2/Redirect/SSO
// @match       https://uniweb.unipd.it/password/index.php/it/utenti/cambia_password/*
// @version     2
// @author      Diego <dstafa.dev@gmail.com> (github.com/diegostafa)
// @description autologin into uniweb
// @run-at      document-end
// ==/UserScript==

const username = "";
const password = "";

const urlUnipdLogin = "stem.elearning.unipd.it";
const urlUnipdSSO = "shibidp.cca.unipd.it";
const urlChangePw = "uniweb.unipd.it";
const domain = window.location.hostname;

const main = () => {
    if (domain === urlUnipdLogin) {
        let ssoLink = document.querySelector('.potentialidp > a');
        ssoLink.click();
    }
    else if (domain === urlUnipdSSO) {
        let change_pw_link = document.querySelector('#change_password_anchor');
        if (document.querySelector('#change_password_anchor')) {
            change_pw_link.click();
        }
        else if (document.querySelector("#user-login-form")) {
            let username_inp = document.querySelector("#j_username_js");
            let password_inp = document.querySelector("#password");
            let student_email = document.querySelector("#radio2");
            let login_btn = document.querySelector("#login_button_js");
            username_inp.value = username;
            password_inp.value = password;
            student_email.checked = true;
            login_btn.click();
        }
        else if (document.querySelector("#change_password_anchor")) {
            let continue_link = document.querySelector("ul + p > strong > a")
            continue_link.click();
        }
    }
    else if (domain === urlChangePw) {
        let old_pw_inp = document.querySelector('#utenti_old_password');
        old_pw_inp.value = password;
    }
};

main();

