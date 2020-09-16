const main = document.getElementById("main");
let sounds = [
  'fart',
  'win',
  'lose',
  'correct',
  'wrong',
];

for (let sound of sounds) {
  let div = document.createElement("div");
  let button = document.createElement("button");
  
  
  div.classList.add("sound");
  button.innerText = sound;
  div.appendChild(button);

  
  main.appendChild(div);
}
