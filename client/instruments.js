const play = (socket, name, params) => {
  const sound = Object.assign({}, {
    sound: name,
    timestamp: new Date().getTime()
  }, params);
  console.log('sending', JSON.stringify(sound));
  socket.emit('sound-request', JSON.stringify(sound));
};

const modes = {
  SYNTH(socket) {
    const oscFreqMin = 100;
    const oscFreqMax = 1000;
    const filterFreqMin = 0;
    const filterFreqMax = 10000;
    const distortionMin = 0;
    const distortionMax = 800;

    const cursor = document.querySelector('#cursor');

    // TODO: Recalculate when orientation changes
    const elementWidth = kaossilator.offsetWidth;
    const elementHeight = kaossilator.offsetHeight;

    let isPlaying = false;
    let oscFreq, filterFreq, distortion;

    const touchpad = new Hammer(document.querySelector('#kaossilator'));
    touchpad.get('pan').set({ direction: Hammer.DIRECTION_ALL });

    touchpad.on('panleft panright panup pandown tap press', ev => {
      isPlaying = true;

      cursor.classList.remove('hidden');
      cursor.style.left = ev.center.x - 100 + 'px';
      cursor.style.top = ev.center.y - 100 + 'px';

      oscFreq = Math.floor(oscFreqMin + ev.center.x / elementWidth * (oscFreqMax - oscFreqMin));
      filterFreq = Math.floor(filterFreqMin + ev.center.y / elementHeight * (filterFreqMax - filterFreqMin));
      distortion = Math.floor(distortionMin + ev.center.y / elementHeight * (distortionMax - distortionMin));
    });

    touchpad.on('panend tap press', () => {
      isPlaying = false;
      cursor.classList.add('hidden');
    });

    const update = setInterval(() => {
      if (isPlaying) {
        play(socket, 'SYNTH', { oscFreq, filterFreq, distortion });
      }
    }, 20);
  },

  DRUMS(socket) {
    const pad1 = new Hammer(document.querySelector('#pad1'));
    const pad2 = new Hammer(document.querySelector('#pad2'));
    pad1.on('tap press', () => play(socket, 'DRUM', { sample: 'KICK' }));
    pad2.on('tap press', () => play(socket, 'DRUM', { sample: 'SNARE' }));
  }
};

module.exports = modes;