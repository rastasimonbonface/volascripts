// ==UserScript==
// @name        Vola IP Tools
// @namespace   volafile.ip.hider
// @description Hides ip addresses for mods.
// @include     https://volafile.io/r/*
// @include     https://volafile.org/r/*
// @version     12
// @grant       none
// @require     https://rawgit.com/RealDolos/volascripts/db222e0a836c6da9d5593c7fc93941c0e7a9d2a1/dry.js
// @run-at      document-start
// ==/UserScript==

dry.once("dom", () => {
    "use strict";
    console.log("running", GM_info.script.name, GM_info.script.version, dry.version);

    const style = document.createElement("style");
    style.textContent = `
body[noipspls] a.username > span:not(.ban),
body[noipspls] .tag_key_ip {
  display: none;
}
.username.ban {
  display: inline-block;
  vertical-align: top;
  color: white !important;
  font-size: 50%;
  padding: 0;
  opacity: 0.4;
}
.username.ban:hover {
  opacity: 1;
}
.username.ban icon-hammer {
  padding: 0;
}
`;
    document.body.appendChild(style);
    let state = localStorage.getItem("noipspls") !== "false";
    if (state !== false) {
        state = true;
    }
    const update = () => {
        if (state) {
            document.body.setAttribute("noipspls", "true");
        }
        else {
            document.body.removeAttribute("noipspls");
        }
        localStorage.setItem("noipspls", state.toString());
        if (dry.exts) {
            dry.exts.chat.scrollState.bottom();
        }
    };
    const toggle = () => {
        state = !state;
        update();
    };
    update();

    let btn = document.createElement("a");
    btn.textContent = "IP";
    btn.style.padding = "0 1ex";
    let uc = document.querySelector("#user_count_icon");
    uc.parentElement.insertBefore(btn, uc.nextSibling);
    btn.addEventListener("click", toggle);

    dry.replaceEarly("chat", "showMessage", function(orig, nick, message, options, data, ...args) {
        try {
            if (nick === "Report" && options.staff) {
                if (typeof(message) == "string") {
                    message = {type: "text", value: message};
                }
                if (!message.forEach) {
                    message = [message];
                }
                let newmsg = new dry.unsafeWindow.Array();
                message.forEach(m => {
                    if (m && m.type === "text") {
                        const pieces = m.value.match(/^(.+)( \(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})\))(.+)$/);
                        if (!pieces) {
                            newmsg.push(m);
                            return;
                        }
                        newmsg.push({type: "text", value: pieces[1] + pieces[4]});
                        if (!data) {
                            data = new dry.unsafeWindow.Object();
                            data.ip = pieces[3];
                        }
                        return;
                    }
                    newmsg.push(m);
                });
                message = newmsg;
            }
        }
        catch (ex) {
            console.error(ex);
        }
        const msg = orig(...[nick, message, options, data].concat(args));
        try {
            if (msg.ip_elem) {
                msg.ban_elem = document.createElement("span");
                const hammer = document.createElement("i");
                hammer.setAttribute("class", "chat_message_icon icon-hammer");
                msg.ban_elem.appendChild(hammer);
                msg.ban_elem.setAttribute("class", "username clickable ban");
                msg.ban_elem.addEventListener("click", msg.showBanWindow.bind(msg));
                msg.nick_elem.insertBefore(msg.ban_elem, msg.nick_elem.lastChild);
            }
        }
        catch (ex) {
            console.error(ex);
        }
        return msg;
    });

    new class extends dry.Commands {
        ip(e) {
            toggle();
            return true;
        }
    }();
});
