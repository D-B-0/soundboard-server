const socket = io();

socket.on('connect', () => {
  console.log("Connceted");
});

socket.on('reciveSound', (data) => {
  if (data.roomId == roomId) {
    console.log("Playing sound with id:", data.soundId);
    playAudio(data.soundId);
  }
});

const main = document.getElementById("main");
const roomIdInput = document.getElementById("roomId");
roomIdInput.addEventListener('change', () => {
  localStorage.setItem('roomId', roomIdInput.value);
  roomId = roomIdInput.value;
});
let roomId;


(async () => {
  const audioInfo = await (await fetch("/audio-info.json")).json();

  if (localStorage.getItem('roomId') != "") {
    roomIdInput.value = localStorage.getItem('roomId');
    roomId = localStorage.getItem('roomId');
  }

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
      // playAudio(soundId);
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
  console.log(nOfButtonsPerRow);
  main.style.gridTemplateColumns = "10rem ".repeat(nOfButtonsPerRow).trim();
}

function playAudio(id) {
  let audio = document.getElementById(id);
  audio.currentTime = 0;
  audio.play();
}
