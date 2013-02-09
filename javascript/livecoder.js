// Generated by CoffeeScript 1.3.3
(function() {
  var Delay, Sample, SampleList, State,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.LC = {};

  LC.NOTES = [16.35, 17.32, 18.35, 19.45, 20.6, 21.83, 23.12, 24.5, 25.96, 27.5, 29.14, 30.87, 32.7, 34.65, 36.71, 38.89, 41.2, 43.65, 46.25, 49, 51.91, 55, 58.27, 61.74, 65.41, 69.3, 73.42, 77.78, 82.41, 87.31, 92.5, 98, 103.83, 110, 116.54, 123.47, 130.81, 138.59, 146.83, 155.56, 164.81, 174.61, 185, 196, 207.65, 220, 233.08, 246.94, 261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392, 415.3, 440, 466.16, 493.88, 523.25, 554.37, 587.33, 622.25, 659.26, 698.46, 739.99, 783.99, 830.61, 880, 932.33, 987.77, 1046.5, 1108.73, 1174.66, 1244.51, 1318.51, 1396.91, 1479.98, 1567.98, 1661.22, 1760, 1864.66, 1975.53, 2093, 2217.46, 2349.32, 2489.02, 2637.02, 2793.83, 2959.96, 3135.96, 3322.44, 3520, 3729.31, 3951.07, 4186.01, 4434.92, 4698.64, 4978];

  LC.LEnv = function(p, t, l, min, max, a, d, s, r) {
    if ((a + d + r) > 1) {
      return;
    }
    if (s < 0 || s > 1) {
      return;
    }
    p.setValueAtTime(min, t);
    p.linearRampToValueAtTime(max, t + (a * l));
    p.linearRampToValueAtTime(min + ((max - min) * s), t + ((a + d) * l));
    p.setValueAtTime(max * s, t + l - (l * r));
    return p.linearRampToValueAtTime(min, t + l);
  };

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

    SampleList.prototype.sampleLocations = {
      'amen': 'audio/amen_low.wav',
      'dub_base': 'audio/dub-base.wav',
      'dub_hhcl': 'audio/dub-hhcl.wav',
      'dub_clapsnare': 'audio/dub-clapsnare.wav'
    };

    function SampleList(audioContext) {
      var name, url, _ref;
      console.log("new sample list");
      this.context = audioContext;
      _ref = this.sampleLocations;
      for (name in _ref) {
        url = _ref[name];
        this[name] = new Sample(audioContext, url);
      }
    }

    return SampleList;

  })();

  Sample = (function() {

    function Sample(audioContext, url) {
      this.onDecodingError = __bind(this.onDecodingError, this);

      this.onDecode = __bind(this.onDecode, this);

      this.decode = __bind(this.decode, this);

      this.load = __bind(this.load, this);
      this.context = audioContext;
      this.url = url;
      this.loaded = false;
      this.error = null;
      this.load();
    }

    Sample.prototype.load = function() {
      this.request = new XMLHttpRequest();
      this.request.open("GET", this.url, true);
      this.request.responseType = "arraybuffer";
      this.request.onload = this.decode;
      return this.request.send();
    };

    Sample.prototype.decode = function() {
      console.log(this.request.response);
      return this.context.decodeAudioData(this.request.response, this.onDecode, this.onDecodingError);
    };

    Sample.prototype.onDecode = function(buffer) {
      this.buffer = buffer;
      return this.loaded = true;
    };

    Sample.prototype.onDecodingError = function(error) {
      console.log("error decoding", this.url, error);
      return this.error = error;
    };

    Sample.prototype.makeBufferSource = function(o, r) {
      var player;
      player = this.context.createBufferSource(this.buffer);
      player.buffer = this.buffer;
      player.playbackRate.value = r;
      player.connect(o);
      return player;
    };

    Sample.prototype.play = function(o, t, l, r) {
      var player;
      if (r == null) {
        r = 1.0;
      }
      if (!this.loaded) {
        return;
      }
      player = this.makeBufferSource(o, r);
      player.noteOn(t);
      return player.noteOff(t + l);
    };

    Sample.prototype.playGrain = function(o, t, offset, l, r) {
      var player;
      if (r == null) {
        r = 1.0;
      }
      if (!this.loaded) {
        return;
      }
      player = this.makeBufferSource(o, r);
      return player.noteGrainOn(t, offset, l);
    };

    return Sample;

  })();

  State = (function() {

    function State() {
      this.init = __bind(this.init, this);

    }

    State.prototype.init = function(k, v) {
      if (!(this[k] != null)) {
        return this[k] = v;
      }
    };

    return State;

  })();

  new Lawnchair({
    name: 'livecoder',
    adapter: 'dom'
  }, function(db) {
    return LC.LiveCoder = (function() {

      function LiveCoder(editor, canvas, keylist) {
        this.audioRunLoop = __bind(this.audioRunLoop, this);

        this.canvasRunLoop = __bind(this.canvasRunLoop, this);

        this.keydown = __bind(this.keydown, this);

        this.reload = __bind(this.reload, this);

        this.activate = __bind(this.activate, this);

        this.deactivate = __bind(this.deactivate, this);
        this.$el = $(editor);
        this.$canvas = $(canvas);
        this.$keylist = $(keylist);
        this.drawMethod = null;
        this.oldDrawMethod = null;
        this.patternMethod = null;
        this.oldPatternMethod = null;
        this.deactTimeout = null;
        this.state = new State();
        this.initEditor();
        this.initCanvas();
        this.initAudio();
        this.updateKeyList();
      }

      LiveCoder.prototype.initEditor = function() {
        var _this = this;
        this.editor = ace.edit("editor");
        this.editor.setTheme("ace/theme/monokai");
        this.editor.getSession().setMode("ace/mode/javascript");
        this.editor.container.addEventListener("keydown", this.keydown, true);
        this.editor.on('focus', this.activate);
        this.load('default');
        this.$keylist.on('click', "li[data-action='hide']", function(e) {
          _this.$keylist.toggleClass('hidden');
          return _this.editor.focus();
        });
        return this.$keylist.on('click', 'li[data-key]', function(e) {
          return _this.load($(e.target).data('key'));
        });
      };

      LiveCoder.prototype.load = function(key) {
        var _this = this;
        return db.get(key, function(data) {
          console.log("loading " + data.key);
          _this.editor.setValue(data.code);
          return _this.editor.focus();
        });
      };

      LiveCoder.prototype.updateKeyList = function() {
        var _this = this;
        this.$keylist.html("<li data-action='hide'>&lt;&lt;&lt;</li>");
        return db.keys(function(keys) {
          return keys.forEach(function(key) {
            return _this.$keylist.append("<li data-key='" + key + "'>" + key + "</li>");
          });
        });
      };

      LiveCoder.prototype.save = function() {
        var code, group, name;
        code = this.editor.getValue();
        group = code.match(/NAME: {0,1}(\w+)?\n/);
        console.log(group);
        if (group) {
          name = group[1];
        } else {
          name = "foobar_" + (Math.round(Math.random() * 1000));
        }
        db.save({
          key: name,
          code: code
        }, "console.log('huhu')");
        return this.updateKeyList();
      };

      LiveCoder.prototype.deactivate = function() {
        return this.$el.removeClass('active');
      };

      LiveCoder.prototype.activate = function() {
        this.$el.addClass('active');
        if (this.deactTimeout) {
          clearTimeout(this.deactTimeout);
        }
        this.deactTimeout = setTimeout(this.deactivate, 4000);
        return true;
      };

      LiveCoder.prototype.reload = function() {
        var code;
        code = this.editor.getValue();
        try {
          eval(code);
          if (this.drawMethod) {
            this.oldDrawMethod = this.drawMethod;
          }
          if (draw) {
            this.drawMethod = draw;
          }
          if (this.patternMethod) {
            this.oldPatternMethod = this.patternMethod;
          }
          if (pattern) {
            return this.patternMethod = pattern;
          }
        } catch (exception) {
          return console.log(exception);
        }
      };

      LiveCoder.prototype.keydown = function(e) {
        if (e.metaKey) {
          if (e.keyCode === 13) {
            this.reload();
          }
          if (e.keyCode === 83) {
            e.preventDefault();
            this.save();
          } else {
            console.log(e);
          }
        }
        return this.activate();
      };

      LiveCoder.prototype.initCanvas = function() {
        $(window).bind('resize', function() {
          return this.$canvas.width(window.innerWidth).height(window.innerHeight);
        });
        this.context = this.$canvas[0].getContext('2d');
        this.context.width = 1024;
        this.context.height = 768;
        return this.canvasRunLoop();
      };

      LiveCoder.prototype.canvasRunLoop = function() {
        var analyserData;
        if (this.drawMethod) {
          analyserData = new Float32Array(16);
          this.analyser.getFloatFrequencyData(analyserData);
          try {
            this.drawMethod(this.context, this.state, analyserData);
          } catch (exception) {
            console.log(exception);
            if (this.oldDrawMethod) {
              this.drawMethod = this.oldDrawMethod;
              this.drawMethod(this.context, this.state, analyserData);
            }
          }
        }
        return requestAnimationFrame(this.canvasRunLoop);
      };

      LiveCoder.prototype.initAudio = function() {
        this.tempo = 120;
        this.steps = 16;
        this.groove = 0;
        this.audioContext = new webkitAudioContext();
        LC.S = new SampleList(this.audioContext);
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 64;
        this.analyser.smoothingTimeConstant = 0.5;
        this.masterGain = this.audioContext.createGainNode();
        this.masterGain.gain.value = 0.5;
        this.masterGain.connect(this.audioContext.destination);
        this.masterGain.connect(this.analyser);
        LC.DelayLine = new Delay(this.audioContext);
        LC.DelayLine.connect(this.masterGain);
        this.masterOutlet = this.masterGain;
        this.nextPatternTime = 0;
        return this.audioRunLoop();
      };

      LiveCoder.prototype.audioRunLoop = function() {
        var i, stepTimes;
        this.timePerStep = 60 / (4 * this.tempo);
        if (this.nextPatternTime === 0 || this.nextPatternTime - this.audioContext.currentTime < 0.4) {
          if (this.nextPatternTime === 0) {
            this.nextPatternTime = this.audioContext.currentTime;
          }
          if (this.patternMethod) {
            stepTimes = (function() {
              var _i, _ref, _results;
              _results = [];
              for (i = _i = 0, _ref = this.steps; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
                _results.push(this.nextPatternTime + (this.timePerStep * i + (i % 2 === 0 ? 0 : this.groove * this.timePerStep)));
              }
              return _results;
            }).call(this);
            try {
              this.patternMethod(this.audioContext, this.masterOutlet, stepTimes, this.timePerStep, this.state);
            } catch (e) {
              console.log(e);
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

      return LiveCoder;

    })();
  });

}).call(this);