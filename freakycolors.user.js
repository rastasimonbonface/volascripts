// ==UserScript==
// @name         Freaky Names
// @namespace    http://jew.dance/
// @version      0.8
// @description  ...and shit
// @author       RealDolos
// @match        https://volafile.io/r/*
// @match        https://volafile.org/r/*
// @grant        none
// @require      https://rawgit.com/RealDolos/volascripts/db222e0a836c6da9d5593c7fc93941c0e7a9d2a1/dry.js
// @run-at       document-start
// ==/UserScript==

(function() {
    "use strict";

    const colors = {
        "rastaSimon": "#01f3c9",
        "getddosed": "blue",
        "thejidf|jewmobile|mrshlomo": "pink",
        "auxo": "yellow",
        "dongmaster|doc": "#7aa2ff",
        "31337h4x0r|vagfacetrm|robocuck|(?:Red|Dong|Immor|lg188)dolos": "white",
        "RealDolos": "#fa7aff",
        "^kreg$": "hotpink",
        "^robo": "dodgerblue",
        "^lain$": "gold",
        "^apha$": "lightcoral",
        "^red$": "indianred",
        "Counselor": "#7cff9a",
        "Wombot": "#ffa534",
        "Liquid": "#35eefd",
        "Hakenkreuz": "red",
        "TheJIDF": "#ffadad",
        "Bread": "#fdc479",
        "Vinyage": "#a4fda4",
        "V4444": "#ffb3e8"
    };
    const r_colors = [];
    for (let name in colors) {
        r_colors.push([new RegExp(name, "i"), colors[name]]);
    }

    console.log("running", GM_info.script.name, GM_info.script.version, dry.version);
    dry.once("dom", () => {
        new class extends dry.MessageFilter {
            addMessage(orig, m) {
                for (let r of r_colors) {
                    if (m.options.user && r[0].test(m.nick)) {
                        for (let n = m.nick_elem; n; n = n.previousSibling) {
                            n.style.color = r[1];
                        }
                        return;
                    }
                }
            }
        }();
    });
})();
