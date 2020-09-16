(async () => {
  const main = document.getElementById("main");
  const audioInfo = await (await fetch("/audio-info.json")).json();

  for (const sound in audioInfo) {
    let div = document.createElement("div");
    let button = document.createElement("button");
    let audio = document.createElement("audio");
    let source = document.createElement("source");
    
    source.src = audioInfo[sound].src;
    
    audio.appendChild(source);

    button.innerText = sound;
    button.addEventListener('click', () => {
      audio.currenTime = 0;
      audio.play();
    });
    
    div.classList.add("sound");
    div.appendChild(button);
    div.appendChild(audio);

    
    main.appendChild(div);
  }
})();