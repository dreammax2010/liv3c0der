// Generated by CoffeeScript 1.6.2
(function() {
  var AcidSynth, Delay, DrumSynth, NoiseHat, NoiseNode, Reverb, Sample, SampleList, SawSynth, SnareSynth, SpreadSynth, WubSynth,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.AE = {};

  AE.NOTES = [16.35, 17.32, 18.35, 19.45, 20.6, 21.83, 23.12, 24.5, 25.96, 27.5, 29.14, 30.87, 32.7, 34.65, 36.71, 38.89, 41.2, 43.65, 46.25, 49, 51.91, 55, 58.27, 61.74, 65.41, 69.3, 73.42, 77.78, 82.41, 87.31, 92.5, 98, 103.83, 110, 116.54, 123.47, 130.81, 138.59, 146.83, 155.56, 164.81, 174.61, 185, 196, 207.65, 220, 233.08, 246.94, 261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392, 415.3, 440, 466.16, 493.88, 523.25, 554.37, 587.33, 622.25, 659.26, 698.46, 739.99, 783.99, 830.61, 880, 932.33, 987.77, 1046.5, 1108.73, 1174.66, 1244.51, 1318.51, 1396.91, 1479.98, 1567.98, 1661.22, 1760, 1864.66, 1975.53, 2093, 2217.46, 2349.32, 2489.02, 2637.02, 2793.83, 2959.96, 3135.96, 3322.44, 3520, 3729.31, 3951.07, 4186.01, 4434.92, 4698.64, 4978];

  AE.LEnv = function(p, t, l, min, max, a, d, s, r) {
    if (s < 0 || s > 1) {
      return;
    }
    p.setValueAtTime(min, t);
    p.linearRampToValueAtTime(max, t + (a * l));
    p.linearRampToValueAtTime(min + ((max - min) * s), t + ((a + d) * l));
    p.setValueAtTime(min + ((max - min) * s), t + l - (l * r));
    return p.linearRampToValueAtTime(min, t + l);
  };

  NoiseNode = (function() {
    NoiseNode.makeBuffer = function(ac, length) {
      var array, i, word, _i, _len;

      if (length == null) {
        length = 1;
      }
      this.buffer = ac.createBuffer(1, 44100 * length, 44100);
      array = this.buffer.getChannelData(0);
      for (i = _i = 0, _len = array.length; _i < _len; i = ++_i) {
        word = array[i];
        array[i] = Math.random() * 2 - 1;
      }
      return this.buffer;
    };

    function NoiseNode(ac, buffer) {
      this.ac = ac;
      this.buffer = buffer;
      this.stop = __bind(this.stop, this);
      this.start = __bind(this.start, this);
      this.connect = __bind(this.connect, this);
      if (!this.buffer) {
        console.log("Making Buffer");
        this.buffer = NoiseNode.makeBuffer(this.ac, 1);
      }
      this.source = ac.createBufferSource();
      this.source.buffer = this.buffer;
    }

    NoiseNode.prototype.connect = function(dest) {
      return this.source.connect(dest);
    };

    NoiseNode.prototype.start = function(time) {
      return this.source.start(time);
    };

    NoiseNode.prototype.stop = function(time) {
      return this.source.stop(time);
    };

    return NoiseNode;

  })();

  NoiseHat = (function() {
    function NoiseHat(context, noise) {
      this.context = context;
      this.noise = noise;
      console.log(this.context, this.noise);
    }

    NoiseHat.prototype.play = function(output, time, volume, decay, freq, Q) {
      var amp, decayTime, filter, noise;

      if (volume == null) {
        volume = 0.1;
      }
      if (decay == null) {
        decay = 20;
      }
      if (freq == null) {
        freq = 6000;
      }
      if (Q == null) {
        Q = 5;
      }
      decayTime = time + (0.5 / decay);
      noise = new NoiseNode(this.context, this.noise);
      filter = this.context.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = freq;
      filter.Q.value = Q;
      amp = this.context.createGainNode();
      noise.connect(filter);
      filter.connect(amp);
      amp.connect(output);
      amp.gain.setValueAtTime(0, time);
      amp.gain.linearRampToValueAtTime(volume, time + 0.001);
      amp.gain.setValueAtTime(volume, time + 0.001);
      amp.gain.linearRampToValueAtTime(0, decayTime);
      noise.start(time);
      return noise.start(decayTime);
    };

    return NoiseHat;

  })();

  DrumSynth = (function() {
    function DrumSynth(context) {
      this.context = context;
    }

    DrumSynth.prototype.play = function(output, time, volume, fDecay, aDecay, start, end) {
      var aDecayTime, amp, fDecayTime, sine;

      if (volume == null) {
        volume = 0.5;
      }
      if (fDecay == null) {
        fDecay = 20;
      }
      if (aDecay == null) {
        aDecay = 20;
      }
      if (start == null) {
        start = 200;
      }
      if (end == null) {
        end = 50;
      }
      fDecayTime = time + (1 / fDecay);
      aDecayTime = time + (1 / aDecay);
      sine = this.context.createOscillator();
      amp = this.context.createGainNode();
      sine.connect(amp);
      amp.connect(output);
      sine.frequency.setValueAtTime(start, time);
      sine.frequency.exponentialRampToValueAtTime(end, fDecayTime);
      amp.gain.setValueAtTime(0, time);
      amp.gain.linearRampToValueAtTime(volume, time + 0.001);
      amp.gain.linearRampToValueAtTime(0, aDecayTime);
      sine.start(time);
      return sine.stop(aDecayTime);
    };

    return DrumSynth;

  })();

  SnareSynth = (function() {
    function SnareSynth(context, noise) {
      this.context = context;
      this.noise = noise;
      this.drumsyn = new DrumSynth(this.context);
      this.flt_f = 1000;
      this.flt_Q = 5;
    }

    SnareSynth.prototype.play = function(output, time, volume, fDecay, aDecay, start, end) {
      var aDecayTime, amp, filter, noise;

      if (volume == null) {
        volume = 0.5;
      }
      if (fDecay == null) {
        fDecay = 20;
      }
      if (aDecay == null) {
        aDecay = 20;
      }
      if (start == null) {
        start = 200;
      }
      if (end == null) {
        end = 50;
      }
      aDecayTime = time + (1 / aDecay);
      amp = this.context.createGainNode();
      amp.connect(output);
      noise = new NoiseNode(this.context, this.noise);
      filter = this.context.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = this.flt_f;
      filter.Q.value = this.flt_Q;
      noise.connect(filter);
      amp.gain.setValueAtTime(0, time);
      amp.gain.linearRampToValueAtTime(volume, time + 0.001);
      amp.gain.linearRampToValueAtTime(0, aDecayTime);
      filter.connect(amp);
      noise.start(time);
      noise.stop(aDecayTime);
      return this.drumsyn.play(output, time, volume, fDecay, aDecay, start, end);
    };

    return SnareSynth;

  })();

  WubSynth = (function() {
    function WubSynth(context) {
      this.context = context;
      this.osc_type = 'square';
      this.lfo_type = 'sine';
      this.decay = 0.9;
      this.flt_f = 200;
      this.flt_decay = 0.8;
      this.flt_mod = 500;
      this.flt_lfo_mod = 500;
      this.lfo_f = 200;
      this.flt_Q = 10;
    }

    WubSynth.prototype.play = function(destination, time, length, note, volume) {
      var amp, filter, lfo, lfoAmp, osc;

      if (volume == null) {
        volume = 0.2;
      }
      osc = this.context.createOscillator();
      lfo = this.context.createOscillator();
      filter = this.context.createBiquadFilter();
      osc.type = this.osc_type;
      lfo.type = this.lfo_type;
      amp = this.context.createGainNode();
      lfoAmp = this.context.createGainNode();
      lfo.connect(lfoAmp);
      lfoAmp.connect(filter.frequency);
      osc.frequency.value = AE.NOTES[note];
      filter.Q.value = this.flt_Q;
      filter.frequency.setValueAtTime(this.flt_f + this.flt_mod, time);
      filter.frequency.linearRampToValueAtTime(this.flt_f + this.flt_mod, time + this.flt_decay);
      osc.connect(filter);
      filter.connect(amp);
      amp.connect(destination);
      lfo.frequency.value = this.lfo_f;
      lfoAmp.gain.value = this.flt_lfo_mod;
      amp.gain.setValueAtTime(0, time);
      amp.gain.linearRampToValueAtTime(volume, time + 0.001);
      amp.gain.setValueAtTime(volume, time + length - this.decay);
      amp.gain.linearRampToValueAtTime(0, time + length);
      osc.start(time);
      osc.stop(time + length);
      lfo.noteOn(time);
      return lfo.noteOff(time + length);
    };

    return WubSynth;

  })();

  AcidSynth = (function() {
    function AcidSynth(context) {
      var helposc;

      this.context = context;
      helposc = this.context.createOscillator();
      this.SAWTOOTH = helposc.SAWTOOTH;
      this.SQUARE = helposc.SQUARE;
      this.osc_type = this.SAWTOOTH;
      this.decay = 0.6;
      this.flt_f = 300;
      this.flt_mod = 4000;
      this.flt_Q = 10;
    }

    AcidSynth.prototype.play = function(destination, time, length, note, volume) {
      var filter1, filter2, gain, osc;

      if (volume == null) {
        volume = 0.2;
      }
      gain = this.context.createGainNode();
      filter1 = this.context.createBiquadFilter();
      filter2 = this.context.createBiquadFilter();
      osc = this.context.createOscillator();
      osc.type = this.osc_type;
      osc.frequency.value = AE.NOTES[note];
      AE.LEnv(gain.gain, time, length, 0, volume, 0.01, this.decay, 0, 0);
      AE.LEnv(filter1.frequency, time, length, this.flt_f, this.flt_f + this.flt_mod, 0.01, this.decay, 0, 0);
      AE.LEnv(filter2.frequency, time, length, this.flt_f, this.flt_f + this.flt_mod, 0.01, this.decay, 0, 0);
      filter1.Q.value = this.flt_Q;
      filter2.Q.value = this.flt_Q;
      osc.connect(filter1);
      filter1.connect(filter2);
      filter2.connect(gain);
      gain.connect(destination);
      osc.noteOn(time);
      return osc.noteOff(time + length);
    };

    return AcidSynth;

  })();

  SawSynth = (function() {
    function SawSynth(context) {
      this.context = context;
      this.spread = 10;
      this.osc_type = 'sawtooth';
      this.voices = 5;
      this.amp_a = 0.05;
      this.amp_d = 0.3;
      this.amp_s = 0.8;
      this.amp_r = 0.1;
      this.flt_a = 0.01;
      this.flt_d = 0.1;
      this.flt_s = 1.0;
      this.flt_r = 0.01;
      this.flt_f = 4000;
      this.flt_mod = 3000;
      this.Q = 0;
    }

    SawSynth.prototype.play = function(destination, time, length, note, volume) {
      var filter, gain, i, osc, osc1, osc2, oscs, _i, _j, _len, _ref, _results;

      if (volume == null) {
        volume = 0.1;
      }
      gain = this.context.createGainNode();
      filter = this.context.createBiquadFilter();
      osc = this.context.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = AE.NOTES[note];
      oscs = [osc];
      for (i = _i = 0, _ref = this.voices; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        osc1 = this.context.createOscillator();
        osc2 = this.context.createOscillator();
        osc1.type = 'sawtooth';
        osc2.type = 'sawtooth';
        osc1.detune.value = this.spread * i;
        osc2.detune.value = this.spread * i * -1;
        osc1.frequency.value = AE.NOTES[note];
        osc2.frequency.value = AE.NOTES[note];
        oscs.push(osc1, osc2);
      }
      AE.LEnv(gain.gain, time, length, 0, volume, this.amp_a, this.amp_d, this.amp_s, this.amp_r);
      AE.LEnv(filter.frequency, time, length, this.flt_f, this.flt_f + this.flt_mod, this.flt_a, this.flt_d, this.flt_s, this.flt_r);
      filter.Q.value = this.Q;
      filter.connect(gain);
      gain.connect(destination);
      _results = [];
      for (_j = 0, _len = oscs.length; _j < _len; _j++) {
        osc = oscs[_j];
        osc.connect(filter);
        osc.start(time);
        _results.push(osc.stop(time + length));
      }
      return _results;
    };

    return SawSynth;

  })();

  SpreadSynth = (function() {
    function SpreadSynth(context) {
      var helposc;

      this.context = context;
      helposc = this.context.createOscillator();
      this.SAWTOOTH = helposc.SAWTOOTH;
      this.SINE = helposc.SINE;
      this.SQUARE = helposc.SQUARE;
      this.TRIANGLE = helposc.TRIANGLE;
      this.spread = 10;
      this.osc_type = this.SAWTOOTH;
      this.amp_a = 0.01;
      this.amp_d = 0.1;
      this.amp_s = 0.8;
      this.amp_r = 0.1;
      this.flt_a = 0.01;
      this.flt_d = 0.1;
      this.flt_s = 0.8;
      this.flt_r = 0.01;
      this.flt_f = 500;
      this.flt_mod = 2000;
      this.flt_Q = 10;
    }

    SpreadSynth.prototype.play = function(destination, time, length, note, volume) {
      var filter, gain, osc1, osc2;

      if (volume == null) {
        volume = 0.1;
      }
      gain = this.context.createGainNode();
      filter = this.context.createBiquadFilter();
      osc1 = this.context.createOscillator();
      osc2 = this.context.createOscillator();
      osc1.type = this.osc_type;
      osc2.type = this.osc_type;
      osc1.detune.value = this.spread;
      osc2.detune.value = this.spread * -1;
      osc1.frequency.value = AE.NOTES[note];
      osc2.frequency.value = AE.NOTES[note];
      AE.LEnv(gain.gain, time, length, 0, volume, this.amp_a, this.amp_d, this.amp_s, this.amp_r);
      AE.LEnv(filter.frequency, time, length, this.flt_f, this.flt_f + this.flt_mod, this.flt_a, this.flt_d, this.flt_s, this.flt_r);
      filter.Q.value = this.flt_Q;
      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(destination);
      osc1.noteOn(time);
      osc2.noteOn(time);
      osc1.noteOff(time + length);
      return osc2.noteOff(time + length);
    };

    return SpreadSynth;

  })();

  Reverb = (function() {
    function Reverb(context, buffer) {
      var decay, i, impulseL, impulseR, length, sampleRate, seconds, _i;

      if (buffer == null) {
        buffer = null;
      }
      this.context = context;
      this.destination = context.createGainNode();
      this.destination.gain.value = 1.0;
      this.mixer = context.createGainNode();
      this.mixer.gain.value = 0.3;
      if (!buffer) {
        console.log("No buffer given, falling back on synthetic one");
        seconds = 2;
        sampleRate = context.sampleRate;
        length = sampleRate * seconds;
        buffer = context.createBuffer(2, length, sampleRate);
        impulseL = buffer.getChannelData(0);
        impulseR = buffer.getChannelData(1);
        decay = 5;
        for (i = _i = 0; 0 <= length ? _i < length : _i > length; i = 0 <= length ? ++_i : --_i) {
          impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
          impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
        }
      }
      this.convolver = context.createConvolver();
      this.convolver.connect(this.mixer);
      this.convolver.buffer = buffer;
      this.destination.connect(this.convolver);
      this.mix = this.mixer.gain;
    }

    Reverb.prototype.buffer = function(buffer) {
      if (this.convolver.buffer !== buffer) {
        return this.convolver.buffer = buffer;
      }
    };

    Reverb.prototype.connect = function(dest) {
      this.mixer.connect(dest);
      return this.destination.connect(dest);
    };

    return Reverb;

  })();

  Delay = (function() {
    function Delay(context) {
      var delay, fbFilter, fbGain;

      this.context = context;
      this.destination = context.createGainNode();
      this.destination.gain = 1.0;
      fbGain = context.createGainNode();
      fbGain.gain.value = 0.6;
      fbFilter = context.createBiquadFilter();
      fbFilter.type = fbFilter.HIGHPASS;
      fbFilter.frequency.value = 4000.0;
      fbFilter.Q.value = 2.0;
      delay = context.createDelay(10);
      delay.delayTime.value = 0.6;
      this.outGain = context.createGainNode();
      this.outGain.gain.value = 0.4;
      this.destination.connect(delay);
      delay.connect(this.outGain);
      delay.connect(fbFilter);
      fbFilter.connect(fbGain);
      fbGain.connect(delay);
      this.feedback = fbGain.gain;
      this.delayTime = delay.delayTime;
      this.filterFrequency = fbFilter.frequency;
      this.output = this.outGain.gain;
    }

    Delay.prototype.connect = function(dest) {
      this.outGain.connect(dest);
      return this.destination.connect(dest);
    };

    return Delay;

  })();

  SampleList = (function() {
    function SampleList(audioContext, baseUrl, progressCallback, completeCallback, errorCallback) {
      this.audioContext = audioContext;
      this.baseUrl = baseUrl != null ? baseUrl : "http://localhost:4567";
      this.progressCallback = progressCallback != null ? progressCallback : null;
      this.completeCallback = completeCallback != null ? completeCallback : null;
      this.errorCallback = errorCallback;
      this._loadedCallback = __bind(this._loadedCallback, this);
      this._listLoaded = __bind(this._listLoaded, this);
      this._listError = __bind(this._listError, this);
      this.callback = completeCallback;
      this.names = [];
      console.log(this.callback);
      $.getJSON(this.baseUrl, {}, this._listLoaded).fail(this._listError);
    }

    SampleList.prototype._listError = function() {
      console.log("Failed to Load Sample List");
      if (this.errorCallback) {
        return this.errorCallback('sample list could not be loaded, did you start the server?');
      }
    };

    SampleList.prototype._listLoaded = function(data) {
      var name, url, _results;

      console.log(data);
      this.sampleLocations = data;
      this.sampleCount = Object.keys(data).length;
      _results = [];
      for (name in data) {
        url = data[name];
        this[name] = new Sample(this.audioContext, url, this._loadedCallback);
        _results.push(this.names.push(name));
      }
      return _results;
    };

    SampleList.prototype._loadedCallback = function() {
      var all_loaded, loadedCount, name, url, _ref;

      loadedCount = 0;
      all_loaded = true;
      _ref = this.sampleLocations;
      for (name in _ref) {
        url = _ref[name];
        if (this[name].loaded) {
          loadedCount += 1;
        }
        all_loaded && (all_loaded = this[name].loaded);
      }
      console.log(loadedCount, this.sampleCount);
      if (this.progressCallback) {
        this.progressCallback(Math.round((loadedCount / this.sampleCount) * 100.0));
      }
      if (all_loaded) {
        if (this.completeCallback) {
          return this.completeCallback("ok");
        }
      }
    };

    return SampleList;

  })();

  Sample = (function() {
    function Sample(audioContext, url, loadedCallback) {
      this.onDecodingError = __bind(this.onDecodingError, this);
      this.onDecode = __bind(this.onDecode, this);
      this.decode = __bind(this.decode, this);
      this.load = __bind(this.load, this);      this.context = audioContext;
      this.url = url;
      this.loaded = false;
      this.error = null;
      this.load();
      this.callback = loadedCallback;
    }

    Sample.prototype.load = function() {
      this.request = new XMLHttpRequest();
      this.request.open("GET", this.url, true);
      this.request.responseType = "arraybuffer";
      this.request.onload = this.decode;
      return this.request.send();
    };

    Sample.prototype.decode = function() {
      return this.context.decodeAudioData(this.request.response, this.onDecode, this.onDecodingError);
    };

    Sample.prototype.onDecode = function(buffer) {
      this.buffer = buffer;
      this.loaded = true;
      return this.callback(this.url);
    };

    Sample.prototype.onDecodingError = function(error) {
      console.log("error decoding", this.url, error);
      return this.error = error;
    };

    Sample.prototype.makeBufferSource = function(o, r, g) {
      var gain, player;

      player = this.context.createBufferSource(this.buffer);
      player.buffer = this.buffer;
      player.playbackRate.value = r;
      gain = this.context.createGainNode();
      gain.gain.value = g;
      player.connect(gain);
      gain.connect(o);
      return player;
    };

    Sample.prototype.play = function(o, t, l, r, g) {
      var player;

      if (r == null) {
        r = 1.0;
      }
      if (g == null) {
        g = 0.4;
      }
      if (!this.loaded) {
        return;
      }
      player = this.makeBufferSource(o, r, g);
      player.noteOn(t);
      return player.noteOff(t + l);
    };

    Sample.prototype.playShot = function(o, t, r, g) {
      var player;

      if (r == null) {
        r = 1.0;
      }
      if (g == null) {
        g = 0.4;
      }
      if (!this.loaded) {
        return;
      }
      player = this.makeBufferSource(o, r, g);
      return player.noteOn(t);
    };

    Sample.prototype.playGrain = function(o, t, offset, l, r, g) {
      var player;

      if (r == null) {
        r = 1.0;
      }
      if (g == null) {
        g = 0.4;
      }
      if (!this.loaded) {
        return;
      }
      player = this.makeBufferSource(o, r, g);
      return player.noteGrainOn(t, offset, l);
    };

    return Sample;

  })();

  AE.Engine = (function() {
    function Engine(state, sampleProgressCallback, sampleFinishedCallback, sampleErrorCallback) {
      this.state = state;
      this.sampleProgressCallback = sampleProgressCallback != null ? sampleProgressCallback : null;
      this.sampleFinishedCallback = sampleFinishedCallback != null ? sampleFinishedCallback : null;
      this.sampleErrorCallback = sampleErrorCallback != null ? sampleErrorCallback : null;
      this.audioRunLoop = __bind(this.audioRunLoop, this);
      this.setPatternMethod = __bind(this.setPatternMethod, this);
      this.sampleLoadError = __bind(this.sampleLoadError, this);
      this.postSampleInit = __bind(this.postSampleInit, this);
      this.lateInit = __bind(this.lateInit, this);
      this.getAnalyserData = __bind(this.getAnalyserData, this);
      this.tempo = 120;
      this.steps = 16;
      this.groove = 0;
      this.audioContext = new webkitAudioContext();
      console.log("PSI", this.postSampleInit);
      console.log("GAD", this.getAnalyserData);
      AE.S = new SampleList(this.audioContext, "http://localhost:4567/index.json", this.sampleProgressCallback, this.postSampleInit, this.sampleLoadError);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.5;
      this.analyser.minDecibels = -100;
      this.analyser.maxDecibels = -40;
      this.masterGain = this.audioContext.createGainNode();
      this.masterGain.gain.value = 0.5;
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.connect(this.analyser);
      this.masterCompressor = this.audioContext.createDynamicsCompressor();
      this.masterCompressor.connect(this.masterGain);
      this.patternMethod = null;
      this.oldPatternMethod = null;
      if (window.Tuna) {
        AE.Tuna = new Tuna(this.audioContext);
      }
      this.noiseBuffer = NoiseNode.makeBuffer(this.audioContext, 2);
      AE.DelayLine = new Delay(this.audioContext);
      AE.DelayLine.connect(this.masterGain);
      AE.DEL = AE.DelayLine.destination;
      AE.Arp = function(notes, t, l, n, fun) {
        var i, note, _i, _results;

        _results = [];
        for (i = _i = 0; 0 <= n ? _i < n : _i > n; i = 0 <= n ? ++_i : --_i) {
          note = notes[i % notes.length];
          _results.push(fun(t + i * l, note));
        }
        return _results;
      };
      AE.NoiseHat = new NoiseHat(this.audioContext, this.noiseBuffer);
      AE.DrumSynth = new DrumSynth(this.audioContext);
      AE.SnareSynth = new SnareSynth(this.audioContext, this.noiseBuffer);
      AE.SawSynth = new SawSynth(this.audioContext);
      AE.SpreadSynth = new SpreadSynth(this.audioContext);
      AE.AcidSynth = new AcidSynth(this.audioContext);
      AE.WubSynth = new WubSynth(this.audioContext);
      this.masterOutlet = this.masterCompressor;
      this.nextPatternTime = 0;
      console.log("AE init done");
    }

    Engine.prototype.getAnalyserData = function(data) {
      this.analyser.getByteFrequencyData(data);
      return data;
    };

    Engine.prototype.lateInit = function() {
      AE.ReverbLine = new Reverb(this.audioContext, this.reverbBuffer);
      AE.ReverbLine.connect(this.masterGain);
      AE.REV = AE.ReverbLine.destination;
      if (this.sampleFinishedCallback) {
        this.sampleFinishedCallback();
      }
      return this.audioRunLoop();
    };

    Engine.prototype.postSampleInit = function() {
      this.reverbBuffer = AE.S.t600 != null ? AE.S.t600.buffer : null;
      return this.lateInit();
    };

    Engine.prototype.sampleLoadError = function(message) {
      this.reverbBuffer = null;
      this.lateInit();
      if (this.sampleErrorCallback != null) {
        return this.sampleErrorCallback(message);
      }
    };

    Engine.prototype.setPatternMethod = function(patternMethod) {
      this.oldPatternMethod = this.patternMethod;
      return this.patternMethod = patternMethod;
    };

    Engine.prototype.audioRunLoop = function() {
      var e, i, stepTimes;

      this.timePerStep = 60 / (4 * this.tempo);
      if (this.nextPatternTime === 0 || this.nextPatternTime - this.audioContext.currentTime < 0.4) {
        if (this.nextPatternTime === 0) {
          this.nextPatternTime = this.audioContext.currentTime;
        }
        if (this.patternMethod) {
          stepTimes = (function() {
            var _i, _ref, _results;

            _results = [];
            for (i = _i = 0, _ref = this.steps; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
              _results.push(this.nextPatternTime + (this.timePerStep * i + (i % 2 === 0 ? 0 : this.groove * this.timePerStep)));
            }
            return _results;
          }).call(this);
          try {
            this.patternMethod(this.audioContext, this.masterOutlet, stepTimes, this.timePerStep, this.state);
          } catch (_error) {
            e = _error;
            console.log(e, e.message, e.stack);
            if (this.oldPatternMethod) {
              this.patternMethod = this.oldPatternMethod;
              this.patternMethod(this.audioContext, this.masterOutlet, stepTimes, this.timePerStep, this.state);
            }
          }
        }
        this.nextPatternTime += this.steps * this.timePerStep;
      }
      return setTimeout(this.audioRunLoop, 100);
    };

    return Engine;

  })();

}).call(this);