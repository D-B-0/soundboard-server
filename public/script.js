const main = document.getElementById("main");
let sounds = [
  'win',
  'lose',
  'correct',
  'wrong',
];

for (let sound of sounds) {
  let div = document.createElement("div");
  let button = document.createElement("button");
  let audio = document.createElement("audio");
  let source = document.createElement("source");
  
  source.src = "/media/" + sound + ".mp3";
  
  audio.appendChild(source);

  button.innerText = sound;
  
  div.classList.add("sound");
  div.appendChild(button);
  div.appendChild(audio);

  
  main.appendChild(div);
}
