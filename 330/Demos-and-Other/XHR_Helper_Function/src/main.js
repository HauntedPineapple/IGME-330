import { loadTextXHR } from "./utils.js";

document.querySelector("#button-1").onclick = () => loadTextXHR("data/taffy-facts.txt", (e) => updateCallback(e, "output-1"));
document.querySelector("#button-2").onclick = () => loadTextXHR("data/viking-facts.txt", (e) => updateCallback(e, "output-2"));

const updateCallback = (e, id) => document.querySelector("#" + id).innerHTML = e.target.responseText;

// document.querySelector("#button-1").onclick = () => loadTextXHR("data/taffy-facts.txt", displayTaffyFacts);
// document.querySelector("#button-2").onclick = () => loadTextXHR("data/viking-facts.txt", displayVikingFacts);
// const displayTaffyFacts = (e) => document.querySelector("#output-1").innerHTML = e.target.responseText;
// const displayVikingFacts = (e) => document.querySelector("#output-2").innerHTML = e.target.responseText;