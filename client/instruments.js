var play = function(socket, sound, params) {
  var sound = {
    sound: sound,
    timestamp: new Date().getTime()
  };
  sound = Object.assign(sound, params);
  console.log('sending', JSON.stringify(sound));
  socket.emit('sound-request', JSON.stringify(sound));
};

var modes = {
  SYNTH: function(socket) {
    var oscFreqMin = 100;
    var oscFreqMax = 1000;
    var filterFreqMin = 0;
    var filterFreqMax = 10000;
    var distortionMin = 0;
    var distortionMax = 800;

    var kaossilator = document.getElementById('kaossilator');
    var cursor = document.getElementById('cursor');

    // TODO: Recalculate when orientation changes
    var elementWidth = kaossilator.offsetWidth;
    var elementHeight = kaossilator.offsetHeight;

    var isPlaying = false;
    var oscFreq, filterFreq, distortion;

    var mc = new Hammer(kaossilator);
    mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });

    mc.on('panleft panright panup pandown tap press', function(ev) {
      isPlaying = true;

      cursor.classList.remove('hidden');
      cursor.style.left = ev.center.x - 100 + 'px';
      cursor.style.top = ev.center.y - 100 + 'px';

      oscFreq = Math.floor(oscFreqMin + ev.center.x / elementWidth * (oscFreqMax - oscFreqMin));
      filterFreq = Math.floor(filterFreqMin + ev.center.y / elementHeight * (filterFreqMax - filterFreqMin));
      distortion = Math.floor(distortionMin + ev.center.y / elementHeight * (distortionMax - distortionMin));
    });

    mc.on('panend tap press', function() {
      isPlaying = false;
      cursor.classList.add('hidden');
    });

    var update = setInterval(function() {
      if (isPlaying) {
        play(socket, 'SYNTH', { oscFreq, filterFreq, distortion });
      }
    }, 20);
  },

  DRUMS: function(socket) {
    var pad1 = new Hammer(document.getElementById('pad1'));
    var pad2 = new Hammer(document.getElementById('pad2'));

    pad1.on('tap press', function() {
      play(socket, 'DRUM', { sample: 'KICK' });
    });
    pad2.on('tap press', function() {
      play(socket, 'DRUM', { sample: 'SNARE' });
    });
  }
};

module.exports = modes;