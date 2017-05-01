// ==UserScript==
// @name         Freaky Names
// @namespace    http://jew.dance/
// @version      0.7
// @description  ...and shit
// @author       RealDolos
// @match        https://volafile.io/r/*
// @grant        none
// @require      https://rawgit.com/RealDolos/volascripts/064d22df5566bda12d222822584b87dcc6a43d45/dry.js
// @run-at       document-start
// ==/UserScript==

(function() {
    "use strict";

    const colors = {
        "getddosed": "blue",
        "thejidf|jewmobile|mrshlomo": "pink",
        "auxo": "yellow",
        "dongmaster|doc": "#7aa2ff",
        "31337h4x0r|realdolos|vagfacetrm|robocuck|(?:Red|Dong|Immor|lg188)dolos": "white",
        "realdolos": "#fa7aff",
        "^kreg$": "hotpink",
        "^robo": "dodgerblue",
        "^lain$": "gold",
        "^apha$": "lightcoral",
        "^red$": "indianred",
        "Counselor": "#7cff9a",
        "Wombot": "#ffa534",
        "Liquid": "#35eefd",
        "Hakenkreuz": "red"
    };
    const r_colors = [];
    for (let name in colors) {
        r_colors.push([new RegExp(name, "i"), colors[name]]);
    }

    console.log("running", GM_info.script.name, GM_info.script.version);
    dry.once("dom", () => {
        dry.replaceEarly("chat", "addMessage", (orig, m, ...args) => {
            try {
                for (let r of r_colors) {
                    if (m.options.user && r[0].test(m.nick)) {
                        for (let n = m.nick_elem; n; n = n.previousSibling) {
                            n.style.color = r[1];
                        }
                    }
                }
            }
            catch (ex) {
                console.error(m, ex);
            }
            return orig(...[m].concat(args));
        });
    });
})();
