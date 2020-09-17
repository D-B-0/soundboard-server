const socket = io();

const main = document.getElementById("main");
const roomIdElement = document.getElementById("roomId");
let roomId;

const urlSearch = new URLSearchParams(window.location.search);
if (urlSearch.get('roomId')) {
  roomIdElement.innerText += urlSearch.get('roomId');
} else {
  roomIdElement.innerText = "You are currently in the public room";
}
roomId = urlSearch.get('roomId');

socket.on('connect', () => {
  socket.join(roomId)
  console.log("Connceted");
});

socket.on('reciveSound', (data) => {
  if (data.roomId == roomId) {
    console.log("Playing sound with id:", data.soundId);
    playAudio(data.soundId);
  }
});

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
      socket.emit('sendSound', {soundId, roomId});
    });
    
    div.classList.add("sound");
    div.appendChild(button);
    div.appendChild(audio);

    
    main.appendChild(div);
  }
  setGridColumns();
})();

window.addEventListener('resize', setGridColumns);

function setGridColumns() {
  let nOfButtonsPerRow = Math.floor((window.innerWidth - 70)/(main.firstChild.clientWidth + 50));
  // console.log(nOfButtonsPerRow);
  main.style.gridTemplateColumns = "10rem ".repeat(nOfButtonsPerRow).trim();
}

function playAudio(id) {
  let audio = document.getElementById(id);
  audio.currentTime = 0;
  audio.play();
}
