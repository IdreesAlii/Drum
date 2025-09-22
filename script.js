/* calling stuff needed */
const display = document.getElementById('display');
const drumPad = document.querySelectorAll('.drum-pad');
const volumeSlider = document.getElementById('volume');

/* creating volume control for beats */
volumeSlider.addEventListener('input', () => {
  document.querySelectorAll("audio").forEach(audio => {
    audio.volume = volumeSlider.value; // set volume for all sounds
  });
});

/* function for playing beats and flashing pad */
const triggerPad = (key) => {
  const audio = document.getElementById(key); // get audio by key

  if (audio) {
    audio.currentTime = 0; // rewind to start
    audio.play(); // play the sound

    const pad = audio.parentElement; // get the pad element

    /* reset glow before re-adding to fix animation glitch */
    pad.classList.remove(`flash-${key}`);
    void pad.offsetWidth; // force reflow to restart animation
    pad.classList.add(`flash-${key}`);

    /* remove glow after short timeout */
    setTimeout(() => {
      pad.classList.remove(`flash-${key}`);
    }, 200);

    /* update display with current sound name */
    display.innerText = pad.id;
  }
};

/* event listeners for click for each pad */
drumPad.forEach(pad => {
  pad.addEventListener('click', () => {
    const key = pad.innerText.trim(); // get key label
    triggerPad(key); // play sound and flash
  });

  /* touchstart event for mobile hold loop */
  pad.addEventListener('touchstart', () => {
    const key = pad.innerText.trim();
    const audio = document.getElementById(key);

    if (audio) {
      pad.dataset.touchHeld = "true"; // mark as held

      const loopTouch = () => {
        if (pad.dataset.touchHeld === "true") {
          triggerPad(key); // play sound and flash
          audio.onended = () => {
            loopTouch(); // replay only after sound ends
          };
        }
      };

      loopTouch(); // start loop
    }
  });

  /* touchend and touchcancel to stop loop */
  pad.addEventListener('touchend', () => {
    pad.dataset.touchHeld = "false";
  });

  pad.addEventListener('touchcancel', () => {
    pad.dataset.touchHeld = "false";
  });

  pad.addEventListener('touchmove', () => {
    pad.dataset.touchHeld = "false"; // optional: stop if finger moves
  });
});

/* keyboard loop playback while key is held */
const keyHeld = {}; // track held keys

document.addEventListener('keydown', (e) => {
  const key = e.key.toUpperCase(); // get uppercase key
  if ("QWEASDZXC".includes(key) && !keyHeld[key]) {
    keyHeld[key] = true; // mark key as held

    const loopKey = () => {
      if (keyHeld[key]) {
        triggerPad(key); // play sound and flash
        const audio = document.getElementById(key);
        if (audio) {
          audio.onended = () => {
            loopKey(); // replay only after sound ends
          };
        }
      }
    };

    loopKey(); // start loop
  }
});

document.addEventListener('keyup', (e) => {
  const key = e.key.toUpperCase();
  keyHeld[key] = false; // stop loop when key is released
});