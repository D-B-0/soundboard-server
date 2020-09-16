const socket = io();

socket.on('connect', () => {
  console.log(socket.connected); // true
});

socket.on('disconnect', () => {
  console.log(socket.connected); // false
});

const main = document.getElementById("main");

(async () => {
  const audioInfo = await (await fetch("/audio-info.json")).json();

  for (const soundId in audioInfo) {
    let div = document.createElement("div");
    let button = document.createElement("button");
    let audio = document.createElement("audio");
    let source = document.createElement("source");
    
    source.src = audioInfo[soundId].src;
    
    audio.appendChild(source);
    audio.id = soundId;

    button.innerText = audioInfo[soundId].name;
    button.addEventListener('click', () => {
      playAudio(soundId);
    });
    
    div.classList.add("sound");
    div.appendChild(button);
    div.appendChild(audio);

    
    main.appendChild(div);
  }
})();

function playAudio(id) {
  let audio = document.getElementById(id);
  audio.currentTime = 0;
  audio.play();
}
