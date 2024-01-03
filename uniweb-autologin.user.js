// ==UserScript==
// @name        unipd-autologin
// @namespace   github.com/diegostafa/userscripts
// @match       https://shibidp.cca.unipd.it/idp/profile/SAML2/Redirect/SSO
// @version     1
// @author      Diego <dstafa.dev@gmail.com> (github.com/diegostafa)
// @description unipd autologin
// @run-at      document-end
// ==/UserScript==

const username = "";
const password = "";

// normal login
if(document.querySelector("#user-login-form")) {
  let username_inp = document.querySelector("#j_username_js");
  let password_inp = document.querySelector("#password");
  let student_email = document.querySelector("#radio2");
  let login_btn = document.querySelector("#login_button_js");

  username_inp.value = username;
  password_inp.value = password;
  student_email.checked = true;
  login_btn.click();
}

// password (almost) expired
else if (document.querySelector("#change_password_anchor")){
  let continue_link = document.querySelector("ul + p > strong > a")
  continue_link.click();
}
