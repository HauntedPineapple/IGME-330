const lorem = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia vitae adipisci atque, sapiente ullam dolorem.";
const sentence = "The quick brown fox jumped over the lazy dog.";

const fontSections = document.querySelectorAll(".sample");
const nunito = document.querySelector("#nunito");
const proza = document.querySelector("#proza");
const pt = document.querySelector("#pt");

window.onload = () => {
    console.log(fontSections);

    for (let section of fontSections) {
        // headers
        for (let i = 1; i < 7; i++) {
            let heading = document.createElement("h" + i);
            heading.innerHTML = `H${i}: ${sentence}`;
            section.appendChild(heading);
        }
        // paragraph
        let sample = document.createElement("p");
        sample.innerHTML = "p: " + sentence + " " + lorem;
        section.appendChild(sample);
        // bold and italic
        let bold = document.createElement("div");
        bold.innerHTML = "<b>b: " + sentence + "</b>";
        section.appendChild(bold);
        let italic = document.createElement("div");
        italic.innerHTML = "<i>i: " + sentence + "</i>";
        section.appendChild(italic);
    }
}