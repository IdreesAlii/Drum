/* calling stuff needed */
const display = document.getElementById('display');
const drumPad = document.querySelectorAll('.drum-pad');
const volumeSlider = document.getElementById('volume');

  /* creating volume control for beats */
volumeSlider.addEventListener('input', () => {
  document.querySelectorAll("audio").forEach(audio => {
    audio.volume = volumeSlider.value;
  })
});


/* function for playing beats */
const triggerPad = (key) => {
  const audio = document.getElementById(key);

  if(audio) {
    audio.currentTime = 0;
    audio.play();
    const pad = audio.parentElement;
    /* flash effect and its timeout */
    pad.classList.add(`flash-${key}`);
   setTimeout(() => {
    pad.classList.remove(`flash-${key}`);
   }, 200);
    display.innerText = pad.id;
  }
}

/* event listeners for click for each key */

drumPad.forEach(pad => {
  pad.addEventListener('click', () => {
    const key = pad.innerText.trim();
    triggerPad(key);
  })});
/* event listener for keyboard keys */
  document.addEventListener('keydown', (e) => {
    const key = e.key.toUpperCase();
    if("QWEASDZXC".includes(key)) {
      triggerPad(key);
    }
  })
