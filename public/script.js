const socket = io();

const main = document.getElementById("main");
const roomIdElement = document.getElementById("roomIdElement");
const roomIdDisplay = document.getElementById("roomIdDisplay");
const roomIdInput = document.getElementById("roomId");
let roomId;

const urlSearch = new URLSearchParams(window.location.search);
roomIdElement.style.display = roomIdDisplay.checked ? "initial" : "none";
roomIdInput.type = roomIdDisplay.checked ? "text" : "password";
if (urlSearch.get('roomId')) {
  roomIdElement.innerText += urlSearch.get('roomId');
} else {
  roomIdElement.innerText = "You are currently in the public room";
}

roomIdDisplay.addEventListener('change', () => {
  roomIdElement.style.display = roomIdDisplay.checked ? "initial" : "none";
  roomIdInput.type = roomIdDisplay.checked ? "text" : "password";
});

roomId = urlSearch.get('roomId');

socket.on('connect', () => {
  console.log("Conncted");
});

socket.emit('connect-to-room', roomId);

socket.on('reciveSound', (data) => {
  console.log("Playing sound with id:", data.id);
  playAudio(data.id);
});

(async () => {
  const audioInfo = await (await fetch("/api/sounds")).json();

  for (const sound of audioInfo) {
    let div = document.createElement("div");
    let button = document.createElement("button");
    let audio = document.createElement("audio");
    let source = document.createElement("source");

    source.src = sound.url;

    audio.appendChild(source);
    audio.id = sound._id;

    button.innerText = sound.name;
    button.addEventListener('click', () => {
      socket.emit('sendSound', {
        id: sound._id
      });
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
  let nOfButtonsPerRow = Math.floor((window.innerWidth - 70) / (main.firstChild.clientWidth + 50));
  // console.log(nOfButtonsPerRow);
  main.style.gridTemplateColumns = "10rem ".repeat(nOfButtonsPerRow).trim();
}

function playAudio(id) {
  let audio = document.getElementById(id);
  audio.currentTime = 0;
  audio.play();
}