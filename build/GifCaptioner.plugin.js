/**
 * @name GifCaptioner
 * @version 0.2.0
 * @description Allows you to add a caption to discord gifs
 * @author TheLazySquid
 * @authorId 619261917352951815
 * @website https://github.com/TheLazySquid/DiscordGifCaptioner
 * @source https://github.com/TheLazySquid/DiscordGifCaptioner/blob/main/build/GifCaptioner.plugin.js
 */
module.exports = class {
    constructor() {
        const createCallbackHandler = (callbackName) => {
            const fullName = callbackName + "Callbacks";
            this[fullName] = [];
            return (callback, once, id) => {
                let object = { callback }

                const delCallback = () => {
                    this[fullName].splice(this[fullName].indexOf(object), 1);
                }
                
                // if once is true delete it after use
                if (once === true) {
                    object.callback = () => {
                        callback();
                        delCallback();
                    }
                }

                if(id) {
                    object.id = id

                    for(let i = 0; i < this[fullName].length; i++) {
                        if(this[fullName][i].id === id) {
                            this[fullName][i] = object;
                            return delCallback;
                        }
                    }
                }

                this[fullName].push(object);
                return delCallback;
            }
        }

        const onStart = createCallbackHandler("start");
        const onStop = createCallbackHandler("stop");
        const watchElement = (selector, callback) => {
            let observer = new MutationObserver((mutations) => {
                for (let mutation of mutations) {
                    if (mutation.addedNodes.length) {
                        for (let node of mutation.addedNodes) {
                            if (node.matches && node.matches(selector)) {
                                callback(node);
                            }

                            if (node.querySelectorAll) {
                                for (let element of node.querySelectorAll(selector)) {
                                    callback(element);
                                }
                            }
                        }
                    }
                }
            });

            let startDispose = onStart(() => {
                observer.observe(document.body, { childList: true, subtree: true });

                for(let element of document.querySelectorAll(selector)) {
                    callback(element);
                }
            });

            let stopDispose = onStop(() => {
                observer.disconnect();
            });

            return () => {
                observer.disconnect();
                startDispose();
                stopDispose();
            }
        }

'use strict';

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

function getCjsExportFromNamespace (n) {
	return n && n['default'] || n;
}

var domain;

// This constructor is used to store event handlers. Instantiating this is
// faster than explicitly calling `Object.create(null)` to get a "clean" empty
// object (tested with v8 v4.9).
function EventHandlers() {}
EventHandlers.prototype = Object.create(null);

function EventEmitter() {
  EventEmitter.init.call(this);
}

// nodejs oddity
// require('events') === require('events').EventEmitter
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.usingDomains = false;

EventEmitter.prototype.domain = undefined;
EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

EventEmitter.init = function() {
  this.domain = null;
  if (EventEmitter.usingDomains) {
    // if there is an active domain, then attach to it.
    if (domain.active ) ;
  }

  if (!this._events || this._events === Object.getPrototypeOf(this)._events) {
    this._events = new EventHandlers();
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || isNaN(n))
    throw new TypeError('"n" argument must be a positive number');
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

// These standalone emit* functions are used to optimize calling of event
// handlers for fast cases because emit() itself often has a variable number of
// arguments and can be deoptimized because of that. These functions always have
// the same number of arguments and thus do not get deoptimized, so the code
// inside them can execute faster.
function emitNone(handler, isFn, self) {
  if (isFn)
    handler.call(self);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self);
  }
}
function emitOne(handler, isFn, self, arg1) {
  if (isFn)
    handler.call(self, arg1);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1);
  }
}
function emitTwo(handler, isFn, self, arg1, arg2) {
  if (isFn)
    handler.call(self, arg1, arg2);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2);
  }
}
function emitThree(handler, isFn, self, arg1, arg2, arg3) {
  if (isFn)
    handler.call(self, arg1, arg2, arg3);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2, arg3);
  }
}

function emitMany(handler, isFn, self, args) {
  if (isFn)
    handler.apply(self, args);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].apply(self, args);
  }
}

EventEmitter.prototype.emit = function emit(type) {
  var er, handler, len, args, i, events, domain;
  var doError = (type === 'error');

  events = this._events;
  if (events)
    doError = (doError && events.error == null);
  else if (!doError)
    return false;

  domain = this.domain;

  // If there is no 'error' event listener then throw.
  if (doError) {
    er = arguments[1];
    if (domain) {
      if (!er)
        er = new Error('Uncaught, unspecified "error" event');
      er.domainEmitter = this;
      er.domain = domain;
      er.domainThrown = false;
      domain.emit('error', er);
    } else if (er instanceof Error) {
      throw er; // Unhandled 'error' event
    } else {
      // At least give some kind of context to the user
      var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
      err.context = er;
      throw err;
    }
    return false;
  }

  handler = events[type];

  if (!handler)
    return false;

  var isFn = typeof handler === 'function';
  len = arguments.length;
  switch (len) {
    // fast cases
    case 1:
      emitNone(handler, isFn, this);
      break;
    case 2:
      emitOne(handler, isFn, this, arguments[1]);
      break;
    case 3:
      emitTwo(handler, isFn, this, arguments[1], arguments[2]);
      break;
    case 4:
      emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
      break;
    // slower
    default:
      args = new Array(len - 1);
      for (i = 1; i < len; i++)
        args[i - 1] = arguments[i];
      emitMany(handler, isFn, this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');

  events = target._events;
  if (!events) {
    events = target._events = new EventHandlers();
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (!existing) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] = prepend ? [listener, existing] :
                                          [existing, listener];
    } else {
      // If we've already got an array, just append.
      if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
    }

    // Check for listener leak
    if (!existing.warned) {
      m = $getMaxListeners(target);
      if (m && m > 0 && existing.length > m) {
        existing.warned = true;
        var w = new Error('Possible EventEmitter memory leak detected. ' +
                            existing.length + ' ' + type + ' listeners added. ' +
                            'Use emitter.setMaxListeners() to increase limit');
        w.name = 'MaxListenersExceededWarning';
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        emitWarning(w);
      }
    }
  }

  return target;
}
function emitWarning(e) {
  typeof console.warn === 'function' ? console.warn(e) : console.log(e);
}
EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function _onceWrap(target, type, listener) {
  var fired = false;
  function g() {
    target.removeListener(type, g);
    if (!fired) {
      fired = true;
      listener.apply(target, arguments);
    }
  }
  g.listener = listener;
  return g;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');

      events = this._events;
      if (!events)
        return this;

      list = events[type];
      if (!list)
        return this;

      if (list === listener || (list.listener && list.listener === listener)) {
        if (--this._eventsCount === 0)
          this._events = new EventHandlers();
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length; i-- > 0;) {
          if (list[i] === listener ||
              (list[i].listener && list[i].listener === listener)) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (list.length === 1) {
          list[0] = undefined;
          if (--this._eventsCount === 0) {
            this._events = new EventHandlers();
            return this;
          } else {
            delete events[type];
          }
        } else {
          spliceOne(list, position);
        }

        if (events.removeListener)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };
    
// Alias for removeListener added in NodeJS 10.0
// https://nodejs.org/api/events.html#events_emitter_off_eventname_listener
EventEmitter.prototype.off = function(type, listener){
    return this.removeListener(type, listener);
};

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events;

      events = this._events;
      if (!events)
        return this;

      // not listening for removeListener, no need to emit
      if (!events.removeListener) {
        if (arguments.length === 0) {
          this._events = new EventHandlers();
          this._eventsCount = 0;
        } else if (events[type]) {
          if (--this._eventsCount === 0)
            this._events = new EventHandlers();
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        for (var i = 0, key; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = new EventHandlers();
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners) {
        // LIFO order
        do {
          this.removeListener(type, listeners[listeners.length - 1]);
        } while (listeners[0]);
      }

      return this;
    };

EventEmitter.prototype.listeners = function listeners(type) {
  var evlistener;
  var ret;
  var events = this._events;

  if (!events)
    ret = [];
  else {
    evlistener = events[type];
    if (!evlistener)
      ret = [];
    else if (typeof evlistener === 'function')
      ret = [evlistener.listener || evlistener];
    else
      ret = unwrapListeners(evlistener);
  }

  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
};

// About 1.5x faster than the two-arg version of Array#splice().
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
    list[i] = list[k];
  list.pop();
}

function arrayClone(arr, i) {
  var copy = new Array(i);
  while (i--)
    copy[i] = arr[i];
  return copy;
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

var _polyfillNode_events = /*#__PURE__*/Object.freeze({
	__proto__: null,
	EventEmitter: EventEmitter,
	default: EventEmitter
});

/* NeuQuant Neural-Net Quantization Algorithm
 * ------------------------------------------
 *
 * Copyright (c) 1994 Anthony Dekker
 *
 * NEUQUANT Neural-Net quantization algorithm by Anthony Dekker, 1994.
 * See "Kohonen neural networks for optimal colour quantization"
 * in "Network: Computation in Neural Systems" Vol. 5 (1994) pp 351-367.
 * for a discussion of the algorithm.
 * See also  http://members.ozemail.com.au/~dekker/NEUQUANT.HTML
 *
 * Any party obtaining a copy of these files from the author, directly or
 * indirectly, is granted, free of charge, a full and unrestricted irrevocable,
 * world-wide, paid up, royalty-free, nonexclusive right and license to deal
 * in this software and documentation files (the "Software"), including without
 * limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons who receive
 * copies from any such party to do so, with the only requirement being
 * that this copyright notice remain intact.
 *
 * (JavaScript port 2012 by Johan Nordberg)
 */

var ncycles = 100; // number of learning cycles
var netsize = 256; // number of colors used
var maxnetpos = netsize - 1;

// defs for freq and bias
var netbiasshift = 4; // bias for colour values
var intbiasshift = 16; // bias for fractions
var intbias = (1 << intbiasshift);
var gammashift = 10;
var betashift = 10;
var beta = (intbias >> betashift); /* beta = 1/1024 */
var betagamma = (intbias << (gammashift - betashift));

// defs for decreasing radius factor
var initrad = (netsize >> 3); // for 256 cols, radius starts
var radiusbiasshift = 6; // at 32.0 biased by 6 bits
var radiusbias = (1 << radiusbiasshift);
var initradius = (initrad * radiusbias); //and decreases by a
var radiusdec = 30; // factor of 1/30 each cycle

// defs for decreasing alpha factor
var alphabiasshift = 10; // alpha starts at 1.0
var initalpha = (1 << alphabiasshift);

/* radbias and alpharadbias used for radpower calculation */
var radbiasshift = 8;
var radbias = (1 << radbiasshift);
var alpharadbshift = (alphabiasshift + radbiasshift);
var alpharadbias = (1 << alpharadbshift);

// four primes near 500 - assume no image has a length so large that it is
// divisible by all four primes
var prime1 = 499;
var prime2 = 491;
var prime3 = 487;
var prime4 = 503;
var minpicturebytes = (3 * prime4);

/*
  Constructor: NeuQuant

  Arguments:

  pixels - array of pixels in RGB format
  samplefac - sampling factor 1 to 30 where lower is better quality

  >
  > pixels = [r, g, b, r, g, b, r, g, b, ..]
  >
*/
function NeuQuant(pixels, samplefac) {
  var network; // int[netsize][4]
  var netindex; // for network lookup - really 256

  // bias and freq arrays for learning
  var bias;
  var freq;
  var radpower;

  /*
    Private Method: init

    sets up arrays
  */
  function init() {
    network = [];
    netindex = new Int32Array(256);
    bias = new Int32Array(netsize);
    freq = new Int32Array(netsize);
    radpower = new Int32Array(netsize >> 3);

    var i, v;
    for (i = 0; i < netsize; i++) {
      v = (i << (netbiasshift + 8)) / netsize;
      network[i] = new Float64Array([v, v, v, 0]);
      //network[i] = [v, v, v, 0]
      freq[i] = intbias / netsize;
      bias[i] = 0;
    }
  }

  /*
    Private Method: unbiasnet

    unbiases network to give byte values 0..255 and record position i to prepare for sort
  */
  function unbiasnet() {
    for (var i = 0; i < netsize; i++) {
      network[i][0] >>= netbiasshift;
      network[i][1] >>= netbiasshift;
      network[i][2] >>= netbiasshift;
      network[i][3] = i; // record color number
    }
  }

  /*
    Private Method: altersingle

    moves neuron *i* towards biased (b,g,r) by factor *alpha*
  */
  function altersingle(alpha, i, b, g, r) {
    network[i][0] -= (alpha * (network[i][0] - b)) / initalpha;
    network[i][1] -= (alpha * (network[i][1] - g)) / initalpha;
    network[i][2] -= (alpha * (network[i][2] - r)) / initalpha;
  }

  /*
    Private Method: alterneigh

    moves neurons in *radius* around index *i* towards biased (b,g,r) by factor *alpha*
  */
  function alterneigh(radius, i, b, g, r) {
    var lo = Math.abs(i - radius);
    var hi = Math.min(i + radius, netsize);

    var j = i + 1;
    var k = i - 1;
    var m = 1;

    var p, a;
    while ((j < hi) || (k > lo)) {
      a = radpower[m++];

      if (j < hi) {
        p = network[j++];
        p[0] -= (a * (p[0] - b)) / alpharadbias;
        p[1] -= (a * (p[1] - g)) / alpharadbias;
        p[2] -= (a * (p[2] - r)) / alpharadbias;
      }

      if (k > lo) {
        p = network[k--];
        p[0] -= (a * (p[0] - b)) / alpharadbias;
        p[1] -= (a * (p[1] - g)) / alpharadbias;
        p[2] -= (a * (p[2] - r)) / alpharadbias;
      }
    }
  }

  /*
    Private Method: contest

    searches for biased BGR values
  */
  function contest(b, g, r) {
    /*
      finds closest neuron (min dist) and updates freq
      finds best neuron (min dist-bias) and returns position
      for frequently chosen neurons, freq[i] is high and bias[i] is negative
      bias[i] = gamma * ((1 / netsize) - freq[i])
    */

    var bestd = ~(1 << 31);
    var bestbiasd = bestd;
    var bestpos = -1;
    var bestbiaspos = bestpos;

    var i, n, dist, biasdist, betafreq;
    for (i = 0; i < netsize; i++) {
      n = network[i];

      dist = Math.abs(n[0] - b) + Math.abs(n[1] - g) + Math.abs(n[2] - r);
      if (dist < bestd) {
        bestd = dist;
        bestpos = i;
      }

      biasdist = dist - ((bias[i]) >> (intbiasshift - netbiasshift));
      if (biasdist < bestbiasd) {
        bestbiasd = biasdist;
        bestbiaspos = i;
      }

      betafreq = (freq[i] >> betashift);
      freq[i] -= betafreq;
      bias[i] += (betafreq << gammashift);
    }

    freq[bestpos] += beta;
    bias[bestpos] -= betagamma;

    return bestbiaspos;
  }

  /*
    Private Method: inxbuild

    sorts network and builds netindex[0..255]
  */
  function inxbuild() {
    var i, j, p, q, smallpos, smallval, previouscol = 0, startpos = 0;
    for (i = 0; i < netsize; i++) {
      p = network[i];
      smallpos = i;
      smallval = p[1]; // index on g
      // find smallest in i..netsize-1
      for (j = i + 1; j < netsize; j++) {
        q = network[j];
        if (q[1] < smallval) { // index on g
          smallpos = j;
          smallval = q[1]; // index on g
        }
      }
      q = network[smallpos];
      // swap p (i) and q (smallpos) entries
      if (i != smallpos) {
        j = q[0];   q[0] = p[0];   p[0] = j;
        j = q[1];   q[1] = p[1];   p[1] = j;
        j = q[2];   q[2] = p[2];   p[2] = j;
        j = q[3];   q[3] = p[3];   p[3] = j;
      }
      // smallval entry is now in position i

      if (smallval != previouscol) {
        netindex[previouscol] = (startpos + i) >> 1;
        for (j = previouscol + 1; j < smallval; j++)
          netindex[j] = i;
        previouscol = smallval;
        startpos = i;
      }
    }
    netindex[previouscol] = (startpos + maxnetpos) >> 1;
    for (j = previouscol + 1; j < 256; j++)
      netindex[j] = maxnetpos; // really 256
  }

  /*
    Private Method: inxsearch

    searches for BGR values 0..255 and returns a color index
  */
  function inxsearch(b, g, r) {
    var a, p, dist;

    var bestd = 1000; // biggest possible dist is 256*3
    var best = -1;

    var i = netindex[g]; // index on g
    var j = i - 1; // start at netindex[g] and work outwards

    while ((i < netsize) || (j >= 0)) {
      if (i < netsize) {
        p = network[i];
        dist = p[1] - g; // inx key
        if (dist >= bestd) i = netsize; // stop iter
        else {
          i++;
          if (dist < 0) dist = -dist;
          a = p[0] - b; if (a < 0) a = -a;
          dist += a;
          if (dist < bestd) {
            a = p[2] - r; if (a < 0) a = -a;
            dist += a;
            if (dist < bestd) {
              bestd = dist;
              best = p[3];
            }
          }
        }
      }
      if (j >= 0) {
        p = network[j];
        dist = g - p[1]; // inx key - reverse dif
        if (dist >= bestd) j = -1; // stop iter
        else {
          j--;
          if (dist < 0) dist = -dist;
          a = p[0] - b; if (a < 0) a = -a;
          dist += a;
          if (dist < bestd) {
            a = p[2] - r; if (a < 0) a = -a;
            dist += a;
            if (dist < bestd) {
              bestd = dist;
              best = p[3];
            }
          }
        }
      }
    }

    return best;
  }

  /*
    Private Method: learn

    "Main Learning Loop"
  */
  function learn() {
    var i;

    var lengthcount = pixels.length;
    var alphadec = 30 + ((samplefac - 1) / 3);
    var samplepixels = lengthcount / (3 * samplefac);
    var delta = ~~(samplepixels / ncycles);
    var alpha = initalpha;
    var radius = initradius;

    var rad = radius >> radiusbiasshift;

    if (rad <= 1) rad = 0;
    for (i = 0; i < rad; i++)
      radpower[i] = alpha * (((rad * rad - i * i) * radbias) / (rad * rad));

    var step;
    if (lengthcount < minpicturebytes) {
      samplefac = 1;
      step = 3;
    } else if ((lengthcount % prime1) !== 0) {
      step = 3 * prime1;
    } else if ((lengthcount % prime2) !== 0) {
      step = 3 * prime2;
    } else if ((lengthcount % prime3) !== 0)  {
      step = 3 * prime3;
    } else {
      step = 3 * prime4;
    }

    var b, g, r, j;
    var pix = 0; // current pixel

    i = 0;
    while (i < samplepixels) {
      b = (pixels[pix] & 0xff) << netbiasshift;
      g = (pixels[pix + 1] & 0xff) << netbiasshift;
      r = (pixels[pix + 2] & 0xff) << netbiasshift;

      j = contest(b, g, r);

      altersingle(alpha, j, b, g, r);
      if (rad !== 0) alterneigh(rad, j, b, g, r); // alter neighbours

      pix += step;
      if (pix >= lengthcount) pix -= lengthcount;

      i++;

      if (delta === 0) delta = 1;
      if (i % delta === 0) {
        alpha -= alpha / alphadec;
        radius -= radius / radiusdec;
        rad = radius >> radiusbiasshift;

        if (rad <= 1) rad = 0;
        for (j = 0; j < rad; j++)
          radpower[j] = alpha * (((rad * rad - j * j) * radbias) / (rad * rad));
      }
    }
  }

  /*
    Method: buildColormap

    1. initializes network
    2. trains it
    3. removes misconceptions
    4. builds colorindex
  */
  function buildColormap() {
    init();
    learn();
    unbiasnet();
    inxbuild();
  }
  this.buildColormap = buildColormap;

  /*
    Method: getColormap

    builds colormap from the index

    returns array in the format:

    >
    > [r, g, b, r, g, b, r, g, b, ..]
    >
  */
  function getColormap() {
    var map = [];
    var index = [];

    for (var i = 0; i < netsize; i++)
      index[network[i][3]] = i;

    var k = 0;
    for (var l = 0; l < netsize; l++) {
      var j = index[l];
      map[k++] = (network[j][0]);
      map[k++] = (network[j][1]);
      map[k++] = (network[j][2]);
    }
    return map;
  }
  this.getColormap = getColormap;

  /*
    Method: lookupRGB

    looks for the closest *r*, *g*, *b* color in the map and
    returns its index
  */
  this.lookupRGB = inxsearch;
}

var TypedNeuQuant = NeuQuant;

/*
  LZWEncoder.js

  Authors
  Kevin Weiner (original Java version - kweiner@fmsware.com)
  Thibault Imbert (AS3 version - bytearray.org)
  Johan Nordberg (JS version - code@johan-nordberg.com)

  Acknowledgements
  GIFCOMPR.C - GIF Image compression routines
  Lempel-Ziv compression based on 'compress'. GIF modifications by
  David Rowley (mgardi@watdcsu.waterloo.edu)
  GIF Image compression - modified 'compress'
  Based on: compress.c - File compression ala IEEE Computer, June 1984.
  By Authors: Spencer W. Thomas (decvax!harpo!utah-cs!utah-gr!thomas)
  Jim McKie (decvax!mcvax!jim)
  Steve Davies (decvax!vax135!petsd!peora!srd)
  Ken Turkowski (decvax!decwrl!turtlevax!ken)
  James A. Woods (decvax!ihnp4!ames!jaw)
  Joe Orost (decvax!vax135!petsd!joe)
*/

var EOF = -1;
var BITS = 12;
var HSIZE = 5003; // 80% occupancy
var masks = [0x0000, 0x0001, 0x0003, 0x0007, 0x000F, 0x001F,
             0x003F, 0x007F, 0x00FF, 0x01FF, 0x03FF, 0x07FF,
             0x0FFF, 0x1FFF, 0x3FFF, 0x7FFF, 0xFFFF];

function LZWEncoder(width, height, pixels, colorDepth) {
  var initCodeSize = Math.max(2, colorDepth);

  var accum = new Uint8Array(256);
  var htab = new Int32Array(HSIZE);
  var codetab = new Int32Array(HSIZE);

  var cur_accum, cur_bits = 0;
  var a_count;
  var free_ent = 0; // first unused entry
  var maxcode;

  // block compression parameters -- after all codes are used up,
  // and compression rate changes, start over.
  var clear_flg = false;

  // Algorithm: use open addressing double hashing (no chaining) on the
  // prefix code / next character combination. We do a variant of Knuth's
  // algorithm D (vol. 3, sec. 6.4) along with G. Knott's relatively-prime
  // secondary probe. Here, the modular division first probe is gives way
  // to a faster exclusive-or manipulation. Also do block compression with
  // an adaptive reset, whereby the code table is cleared when the compression
  // ratio decreases, but after the table fills. The variable-length output
  // codes are re-sized at this point, and a special CLEAR code is generated
  // for the decompressor. Late addition: construct the table according to
  // file size for noticeable speed improvement on small files. Please direct
  // questions about this implementation to ames!jaw.
  var g_init_bits, ClearCode, EOFCode, remaining, curPixel, n_bits;

  // Add a character to the end of the current packet, and if it is 254
  // characters, flush the packet to disk.
  function char_out(c, outs) {
    accum[a_count++] = c;
    if (a_count >= 254) flush_char(outs);
  }

  // Clear out the hash table
  // table clear for block compress
  function cl_block(outs) {
    cl_hash(HSIZE);
    free_ent = ClearCode + 2;
    clear_flg = true;
    output(ClearCode, outs);
  }

  // Reset code table
  function cl_hash(hsize) {
    for (var i = 0; i < hsize; ++i) htab[i] = -1;
  }

  function compress(init_bits, outs) {
    var fcode, c, i, ent, disp, hsize_reg, hshift;

    // Set up the globals: g_init_bits - initial number of bits
    g_init_bits = init_bits;

    // Set up the necessary values
    clear_flg = false;
    n_bits = g_init_bits;
    maxcode = MAXCODE(n_bits);

    ClearCode = 1 << (init_bits - 1);
    EOFCode = ClearCode + 1;
    free_ent = ClearCode + 2;

    a_count = 0; // clear packet

    ent = nextPixel();

    hshift = 0;
    for (fcode = HSIZE; fcode < 65536; fcode *= 2) ++hshift;
    hshift = 8 - hshift; // set hash code range bound
    hsize_reg = HSIZE;
    cl_hash(hsize_reg); // clear hash table

    output(ClearCode, outs);

    outer_loop: while ((c = nextPixel()) != EOF) {
      fcode = (c << BITS) + ent;
      i = (c << hshift) ^ ent; // xor hashing
      if (htab[i] === fcode) {
        ent = codetab[i];
        continue;
      } else if (htab[i] >= 0) { // non-empty slot
        disp = hsize_reg - i; // secondary hash (after G. Knott)
        if (i === 0) disp = 1;
        do {
          if ((i -= disp) < 0) i += hsize_reg;
          if (htab[i] === fcode) {
            ent = codetab[i];
            continue outer_loop;
          }
        } while (htab[i] >= 0);
      }
      output(ent, outs);
      ent = c;
      if (free_ent < 1 << BITS) {
        codetab[i] = free_ent++; // code -> hashtable
        htab[i] = fcode;
      } else {
        cl_block(outs);
      }
    }

    // Put out the final code.
    output(ent, outs);
    output(EOFCode, outs);
  }

  function encode(outs) {
    outs.writeByte(initCodeSize); // write "initial code size" byte
    remaining = width * height; // reset navigation variables
    curPixel = 0;
    compress(initCodeSize + 1, outs); // compress and write the pixel data
    outs.writeByte(0); // write block terminator
  }

  // Flush the packet to disk, and reset the accumulator
  function flush_char(outs) {
    if (a_count > 0) {
      outs.writeByte(a_count);
      outs.writeBytes(accum, 0, a_count);
      a_count = 0;
    }
  }

  function MAXCODE(n_bits) {
    return (1 << n_bits) - 1;
  }

  // Return the next pixel from the image
  function nextPixel() {
    if (remaining === 0) return EOF;
    --remaining;
    var pix = pixels[curPixel++];
    return pix & 0xff;
  }

  function output(code, outs) {
    cur_accum &= masks[cur_bits];

    if (cur_bits > 0) cur_accum |= (code << cur_bits);
    else cur_accum = code;

    cur_bits += n_bits;

    while (cur_bits >= 8) {
      char_out((cur_accum & 0xff), outs);
      cur_accum >>= 8;
      cur_bits -= 8;
    }

    // If the next entry is going to be too big for the code size,
    // then increase it, if possible.
    if (free_ent > maxcode || clear_flg) {
      if (clear_flg) {
        maxcode = MAXCODE(n_bits = g_init_bits);
        clear_flg = false;
      } else {
        ++n_bits;
        if (n_bits == BITS) maxcode = 1 << BITS;
        else maxcode = MAXCODE(n_bits);
      }
    }

    if (code == EOFCode) {
      // At EOF, write the rest of the buffer.
      while (cur_bits > 0) {
        char_out((cur_accum & 0xff), outs);
        cur_accum >>= 8;
        cur_bits -= 8;
      }
      flush_char(outs);
    }
  }

  this.encode = encode;
}

var LZWEncoder_1 = LZWEncoder;

/*
  GIFEncoder.js

  Authors
  Kevin Weiner (original Java version - kweiner@fmsware.com)
  Thibault Imbert (AS3 version - bytearray.org)
  Johan Nordberg (JS version - code@johan-nordberg.com)
*/




function ByteArray() {
  this.page = -1;
  this.pages = [];
  this.newPage();
}

ByteArray.pageSize = 4096;
ByteArray.charMap = {};

for (var i = 0; i < 256; i++)
  ByteArray.charMap[i] = String.fromCharCode(i);

ByteArray.prototype.newPage = function() {
  this.pages[++this.page] = new Uint8Array(ByteArray.pageSize);
  this.cursor = 0;
};

ByteArray.prototype.getData = function() {
  var rv = '';
  for (var p = 0; p < this.pages.length; p++) {
    for (var i = 0; i < ByteArray.pageSize; i++) {
      rv += ByteArray.charMap[this.pages[p][i]];
    }
  }
  return rv;
};

ByteArray.prototype.writeByte = function(val) {
  if (this.cursor >= ByteArray.pageSize) this.newPage();
  this.pages[this.page][this.cursor++] = val;
};

ByteArray.prototype.writeUTFBytes = function(string) {
  for (var l = string.length, i = 0; i < l; i++)
    this.writeByte(string.charCodeAt(i));
};

ByteArray.prototype.writeBytes = function(array, offset, length) {
  for (var l = length || array.length, i = offset || 0; i < l; i++)
    this.writeByte(array[i]);
};

function GIFEncoder(width, height) {
  // image size
  this.width = ~~width;
  this.height = ~~height;

  // transparent color if given
  this.transparent = null;

  // transparent index in color table
  this.transIndex = 0;

  // -1 = no repeat, 0 = forever. anything else is repeat count
  this.repeat = -1;

  // frame delay (hundredths)
  this.delay = 0;

  this.image = null; // current frame
  this.pixels = null; // BGR byte array from frame
  this.indexedPixels = null; // converted frame indexed to palette
  this.colorDepth = null; // number of bit planes
  this.colorTab = null; // RGB palette
  this.neuQuant = null; // NeuQuant instance that was used to generate this.colorTab.
  this.usedEntry = new Array(); // active palette entries
  this.palSize = 7; // color table size (bits-1)
  this.dispose = -1; // disposal code (-1 = use default)
  this.firstFrame = true;
  this.sample = 10; // default sample interval for quantizer
  this.dither = false; // default dithering
  this.globalPalette = false;

  this.out = new ByteArray();
}

/*
  Sets the delay time between each frame, or changes it for subsequent frames
  (applies to last frame added)
*/
GIFEncoder.prototype.setDelay = function(milliseconds) {
  this.delay = Math.round(milliseconds / 10);
};

/*
  Sets frame rate in frames per second.
*/
GIFEncoder.prototype.setFrameRate = function(fps) {
  this.delay = Math.round(100 / fps);
};

/*
  Sets the GIF frame disposal code for the last added frame and any
  subsequent frames.

  Default is 0 if no transparent color has been set, otherwise 2.
*/
GIFEncoder.prototype.setDispose = function(disposalCode) {
  if (disposalCode >= 0) this.dispose = disposalCode;
};

/*
  Sets the number of times the set of GIF frames should be played.

  -1 = play once
  0 = repeat indefinitely

  Default is -1

  Must be invoked before the first image is added
*/

GIFEncoder.prototype.setRepeat = function(repeat) {
  this.repeat = repeat;
};

/*
  Sets the transparent color for the last added frame and any subsequent
  frames. Since all colors are subject to modification in the quantization
  process, the color in the final palette for each frame closest to the given
  color becomes the transparent color for that frame. May be set to null to
  indicate no transparent color.
*/
GIFEncoder.prototype.setTransparent = function(color) {
  this.transparent = color;
};

/*
  Adds next GIF frame. The frame is not written immediately, but is
  actually deferred until the next frame is received so that timing
  data can be inserted.  Invoking finish() flushes all frames.
*/
GIFEncoder.prototype.addFrame = function(imageData) {
  this.image = imageData;

  this.colorTab = this.globalPalette && this.globalPalette.slice ? this.globalPalette : null;

  this.getImagePixels(); // convert to correct format if necessary
  this.analyzePixels(); // build color table & map pixels

  if (this.globalPalette === true) this.globalPalette = this.colorTab;

  if (this.firstFrame) {
    this.writeLSD(); // logical screen descriptior
    this.writePalette(); // global color table
    if (this.repeat >= 0) {
      // use NS app extension to indicate reps
      this.writeNetscapeExt();
    }
  }

  this.writeGraphicCtrlExt(); // write graphic control extension
  this.writeImageDesc(); // image descriptor
  if (!this.firstFrame && !this.globalPalette) this.writePalette(); // local color table
  this.writePixels(); // encode and write pixel data

  this.firstFrame = false;
};

/*
  Adds final trailer to the GIF stream, if you don't call the finish method
  the GIF stream will not be valid.
*/
GIFEncoder.prototype.finish = function() {
  this.out.writeByte(0x3b); // gif trailer
};

/*
  Sets quality of color quantization (conversion of images to the maximum 256
  colors allowed by the GIF specification). Lower values (minimum = 1)
  produce better colors, but slow processing significantly. 10 is the
  default, and produces good color mapping at reasonable speeds. Values
  greater than 20 do not yield significant improvements in speed.
*/
GIFEncoder.prototype.setQuality = function(quality) {
  if (quality < 1) quality = 1;
  this.sample = quality;
};

/*
  Sets dithering method. Available are:
  - FALSE no dithering
  - TRUE or FloydSteinberg
  - FalseFloydSteinberg
  - Stucki
  - Atkinson
  You can add '-serpentine' to use serpentine scanning
*/
GIFEncoder.prototype.setDither = function(dither) {
  if (dither === true) dither = 'FloydSteinberg';
  this.dither = dither;
};

/*
  Sets global palette for all frames.
  You can provide TRUE to create global palette from first picture.
  Or an array of r,g,b,r,g,b,...
*/
GIFEncoder.prototype.setGlobalPalette = function(palette) {
  this.globalPalette = palette;
};

/*
  Returns global palette used for all frames.
  If setGlobalPalette(true) was used, then this function will return
  calculated palette after the first frame is added.
*/
GIFEncoder.prototype.getGlobalPalette = function() {
  return (this.globalPalette && this.globalPalette.slice && this.globalPalette.slice(0)) || this.globalPalette;
};

/*
  Writes GIF file header
*/
GIFEncoder.prototype.writeHeader = function() {
  this.out.writeUTFBytes("GIF89a");
};

/*
  Analyzes current frame colors and creates color map.
*/
GIFEncoder.prototype.analyzePixels = function() {
  if (!this.colorTab) {
    this.neuQuant = new TypedNeuQuant(this.pixels, this.sample);
    this.neuQuant.buildColormap(); // create reduced palette
    this.colorTab = this.neuQuant.getColormap();
  }

  // map image pixels to new palette
  if (this.dither) {
    this.ditherPixels(this.dither.replace('-serpentine', ''), this.dither.match(/-serpentine/) !== null);
  } else {
    this.indexPixels();
  }

  this.pixels = null;
  this.colorDepth = 8;
  this.palSize = 7;

  // get closest match to transparent color if specified
  if (this.transparent !== null) {
    this.transIndex = this.findClosest(this.transparent, true);
  }
};

/*
  Index pixels, without dithering
*/
GIFEncoder.prototype.indexPixels = function(imgq) {
  var nPix = this.pixels.length / 3;
  this.indexedPixels = new Uint8Array(nPix);
  var k = 0;
  for (var j = 0; j < nPix; j++) {
    var index = this.findClosestRGB(
      this.pixels[k++] & 0xff,
      this.pixels[k++] & 0xff,
      this.pixels[k++] & 0xff
    );
    this.usedEntry[index] = true;
    this.indexedPixels[j] = index;
  }
};

/*
  Taken from http://jsbin.com/iXofIji/2/edit by PAEz
*/
GIFEncoder.prototype.ditherPixels = function(kernel, serpentine) {
  var kernels = {
    FalseFloydSteinberg: [
      [3 / 8, 1, 0],
      [3 / 8, 0, 1],
      [2 / 8, 1, 1]
    ],
    FloydSteinberg: [
      [7 / 16, 1, 0],
      [3 / 16, -1, 1],
      [5 / 16, 0, 1],
      [1 / 16, 1, 1]
    ],
    Stucki: [
      [8 / 42, 1, 0],
      [4 / 42, 2, 0],
      [2 / 42, -2, 1],
      [4 / 42, -1, 1],
      [8 / 42, 0, 1],
      [4 / 42, 1, 1],
      [2 / 42, 2, 1],
      [1 / 42, -2, 2],
      [2 / 42, -1, 2],
      [4 / 42, 0, 2],
      [2 / 42, 1, 2],
      [1 / 42, 2, 2]
    ],
    Atkinson: [
      [1 / 8, 1, 0],
      [1 / 8, 2, 0],
      [1 / 8, -1, 1],
      [1 / 8, 0, 1],
      [1 / 8, 1, 1],
      [1 / 8, 0, 2]
    ]
  };

  if (!kernel || !kernels[kernel]) {
    throw 'Unknown dithering kernel: ' + kernel;
  }

  var ds = kernels[kernel];
  var index = 0,
    height = this.height,
    width = this.width,
    data = this.pixels;
  var direction = serpentine ? -1 : 1;

  this.indexedPixels = new Uint8Array(this.pixels.length / 3);

  for (var y = 0; y < height; y++) {

    if (serpentine) direction = direction * -1;

    for (var x = (direction == 1 ? 0 : width - 1), xend = (direction == 1 ? width : 0); x !== xend; x += direction) {

      index = (y * width) + x;
      // Get original colour
      var idx = index * 3;
      var r1 = data[idx];
      var g1 = data[idx + 1];
      var b1 = data[idx + 2];

      // Get converted colour
      idx = this.findClosestRGB(r1, g1, b1);
      this.usedEntry[idx] = true;
      this.indexedPixels[index] = idx;
      idx *= 3;
      var r2 = this.colorTab[idx];
      var g2 = this.colorTab[idx + 1];
      var b2 = this.colorTab[idx + 2];

      var er = r1 - r2;
      var eg = g1 - g2;
      var eb = b1 - b2;

      for (var i = (direction == 1 ? 0: ds.length - 1), end = (direction == 1 ? ds.length : 0); i !== end; i += direction) {
        var x1 = ds[i][1]; // *direction;  //  Should this by timesd by direction?..to make the kernel go in the opposite direction....got no idea....
        var y1 = ds[i][2];
        if (x1 + x >= 0 && x1 + x < width && y1 + y >= 0 && y1 + y < height) {
          var d = ds[i][0];
          idx = index + x1 + (y1 * width);
          idx *= 3;

          data[idx] = Math.max(0, Math.min(255, data[idx] + er * d));
          data[idx + 1] = Math.max(0, Math.min(255, data[idx + 1] + eg * d));
          data[idx + 2] = Math.max(0, Math.min(255, data[idx + 2] + eb * d));
        }
      }
    }
  }
};

/*
  Returns index of palette color closest to c
*/
GIFEncoder.prototype.findClosest = function(c, used) {
  return this.findClosestRGB((c & 0xFF0000) >> 16, (c & 0x00FF00) >> 8, (c & 0x0000FF), used);
};

GIFEncoder.prototype.findClosestRGB = function(r, g, b, used) {
  if (this.colorTab === null) return -1;

  if (this.neuQuant && !used) {
    return this.neuQuant.lookupRGB(r, g, b);
  }

  var minpos = 0;
  var dmin = 256 * 256 * 256;
  var len = this.colorTab.length;

  for (var i = 0, index = 0; i < len; index++) {
    var dr = r - (this.colorTab[i++] & 0xff);
    var dg = g - (this.colorTab[i++] & 0xff);
    var db = b - (this.colorTab[i++] & 0xff);
    var d = dr * dr + dg * dg + db * db;
    if ((!used || this.usedEntry[index]) && (d < dmin)) {
      dmin = d;
      minpos = index;
    }
  }

  return minpos;
};

/*
  Extracts image pixels into byte array pixels
  (removes alphachannel from canvas imagedata)
*/
GIFEncoder.prototype.getImagePixels = function() {
  var w = this.width;
  var h = this.height;
  this.pixels = new Uint8Array(w * h * 3);

  var data = this.image;
  var srcPos = 0;
  var count = 0;

  for (var i = 0; i < h; i++) {
    for (var j = 0; j < w; j++) {
      this.pixels[count++] = data[srcPos++];
      this.pixels[count++] = data[srcPos++];
      this.pixels[count++] = data[srcPos++];
      srcPos++;
    }
  }
};

/*
  Writes Graphic Control Extension
*/
GIFEncoder.prototype.writeGraphicCtrlExt = function() {
  this.out.writeByte(0x21); // extension introducer
  this.out.writeByte(0xf9); // GCE label
  this.out.writeByte(4); // data block size

  var transp, disp;
  if (this.transparent === null) {
    transp = 0;
    disp = 0; // dispose = no action
  } else {
    transp = 1;
    disp = 2; // force clear if using transparent color
  }

  if (this.dispose >= 0) {
    disp = this.dispose & 7; // user override
  }
  disp <<= 2;

  // packed fields
  this.out.writeByte(
    0 | // 1:3 reserved
    disp | // 4:6 disposal
    0 | // 7 user input - 0 = none
    transp // 8 transparency flag
  );

  this.writeShort(this.delay); // delay x 1/100 sec
  this.out.writeByte(this.transIndex); // transparent color index
  this.out.writeByte(0); // block terminator
};

/*
  Writes Image Descriptor
*/
GIFEncoder.prototype.writeImageDesc = function() {
  this.out.writeByte(0x2c); // image separator
  this.writeShort(0); // image position x,y = 0,0
  this.writeShort(0);
  this.writeShort(this.width); // image size
  this.writeShort(this.height);

  // packed fields
  if (this.firstFrame || this.globalPalette) {
    // no LCT - GCT is used for first (or only) frame
    this.out.writeByte(0);
  } else {
    // specify normal LCT
    this.out.writeByte(
      0x80 | // 1 local color table 1=yes
      0 | // 2 interlace - 0=no
      0 | // 3 sorted - 0=no
      0 | // 4-5 reserved
      this.palSize // 6-8 size of color table
    );
  }
};

/*
  Writes Logical Screen Descriptor
*/
GIFEncoder.prototype.writeLSD = function() {
  // logical screen size
  this.writeShort(this.width);
  this.writeShort(this.height);

  // packed fields
  this.out.writeByte(
    0x80 | // 1 : global color table flag = 1 (gct used)
    0x70 | // 2-4 : color resolution = 7
    0x00 | // 5 : gct sort flag = 0
    this.palSize // 6-8 : gct size
  );

  this.out.writeByte(0); // background color index
  this.out.writeByte(0); // pixel aspect ratio - assume 1:1
};

/*
  Writes Netscape application extension to define repeat count.
*/
GIFEncoder.prototype.writeNetscapeExt = function() {
  this.out.writeByte(0x21); // extension introducer
  this.out.writeByte(0xff); // app extension label
  this.out.writeByte(11); // block size
  this.out.writeUTFBytes('NETSCAPE2.0'); // app id + auth code
  this.out.writeByte(3); // sub-block size
  this.out.writeByte(1); // loop sub-block id
  this.writeShort(this.repeat); // loop count (extra iterations, 0=repeat forever)
  this.out.writeByte(0); // block terminator
};

/*
  Writes color table
*/
GIFEncoder.prototype.writePalette = function() {
  this.out.writeBytes(this.colorTab);
  var n = (3 * 256) - this.colorTab.length;
  for (var i = 0; i < n; i++)
    this.out.writeByte(0);
};

GIFEncoder.prototype.writeShort = function(pValue) {
  this.out.writeByte(pValue & 0xFF);
  this.out.writeByte((pValue >> 8) & 0xFF);
};

/*
  Encodes and writes pixel data
*/
GIFEncoder.prototype.writePixels = function() {
  var enc = new LZWEncoder_1(this.width, this.height, this.indexedPixels, this.colorDepth);
  enc.encode(this.out);
};

/*
  Retrieves the GIF stream
*/
GIFEncoder.prototype.stream = function() {
  return this.out;
};

var GIFEncoder_1 = GIFEncoder;

var require$0 = getCjsExportFromNamespace(_polyfillNode_events);

var gif = createCommonjsModule(function (module) {
// Generated by CoffeeScript 2.7.0
(function() {
  var EventEmitter, GIF,
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf;

  ({EventEmitter} = require$0);

  GIF = (function() {
    var defaults, frameDefaults, GIFEncoder, renderFrame;

    GIFEncoder = GIFEncoder_1;

    renderFrame = function(frame) {
      var encoder, stream;
      encoder = new GIFEncoder(frame.width, frame.height);
      if (frame.index === 0) {
        encoder.writeHeader();
      } else {
        encoder.firstFrame = false;
      }
      encoder.setTransparent(frame.transparent);
      encoder.setDispose(frame.dispose);
      encoder.setRepeat(frame.repeat);
      encoder.setDelay(frame.delay);
      encoder.setQuality(frame.quality);
      encoder.setDither(frame.dither);
      encoder.setGlobalPalette(frame.globalPalette);
      encoder.addFrame(frame.data);
      if (frame.last) {
        encoder.finish();
      }
      if (frame.globalPalette === true) {
        frame.globalPalette = encoder.getGlobalPalette();
      }
      stream = encoder.stream();
      frame.data = stream.pages;
      frame.cursor = stream.cursor;
      frame.pageSize = stream.constructor.pageSize;
      return frame;
    };

    class GIF extends EventEmitter {
      constructor(options) {
        var base, key, value;
        super();
        this.running = false;
        this.options = {};
        this.frames = [];
        this.setOptions(options);
        for (key in defaults) {
          value = defaults[key];
          if ((base = this.options)[key] == null) {
            base[key] = value;
          }
        }
      }

      setOption(key, value) {
        this.options[key] = value;
        if ((this._canvas != null) && (key === 'width' || key === 'height')) {
          return this._canvas[key] = value;
        }
      }

      setOptions(options) {
        var key, results, value;
        results = [];
        for (key in options) {
          if (!hasProp.call(options, key)) continue;
          value = options[key];
          results.push(this.setOption(key, value));
        }
        return results;
      }

      addFrame(image, options = {}) {
        var frame, key;
        frame = {};
        frame.transparent = this.options.transparent;
        for (key in frameDefaults) {
          frame[key] = options[key] || frameDefaults[key];
        }
        if (this.options.width == null) {
          // use the images width and height for options unless already set
          this.setOption('width', image.width);
        }
        if (this.options.height == null) {
          this.setOption('height', image.height);
        }
        if ((typeof ImageData !== "undefined" && ImageData !== null) && image instanceof ImageData) {
          frame.data = image.data;
        } else if (((typeof CanvasRenderingContext2D !== "undefined" && CanvasRenderingContext2D !== null) && image instanceof CanvasRenderingContext2D) || ((typeof WebGLRenderingContext !== "undefined" && WebGLRenderingContext !== null) && image instanceof WebGLRenderingContext)) {
          if (options.copy) {
            frame.data = this.getContextData(image);
          } else {
            frame.context = image;
          }
        } else if (image.childNodes != null) {
          if (options.copy) {
            frame.data = this.getImageData(image);
          } else {
            frame.image = image;
          }
        } else {
          throw new Error('Invalid image');
        }
        return this.frames.push(frame);
      }

      render() {
        if (this.running) {
          throw new Error('Already running');
        }
        if ((this.options.width == null) || (this.options.height == null)) {
          throw new Error('Width and height must be set prior to rendering');
        }
        this.running = true;
        this.nextFrame = 0;
        this.finishedFrames = 0;
        this.imageParts = (function() {
          var j, ref, results;
          results = [];
          for (j = 0, ref = this.frames.length; (0 <= ref ? j < ref : j > ref); 0 <= ref ? ++j : --j) {
            results.push(null);
          }
          return results;
        }).call(this);
        // we need to wait for the palette
        this.renderNextFrame();
        this.emit('start');
        return this.emit('progress', 0);
      }

      abort() {
        this.running = false;
        return this.emit('abort');
      }

      frameFinished(frame) {
        this.log(`frame ${frame.index} finished`);
        this.finishedFrames++;
        this.emit('progress', this.finishedFrames / this.frames.length);
        this.imageParts[frame.index] = frame;
        // remember calculated palette, spawn the rest of the workers
        if (this.options.globalPalette === true) {
          this.options.globalPalette = frame.globalPalette;
          this.log('global palette analyzed');
          if (this.frames.length > 2) {
            this.renderNextFrame();
          }
        }
        if (indexOf.call(this.imageParts, null) >= 0) {
          return this.renderNextFrame();
        } else {
          return this.finishRendering();
        }
      }

      finishRendering() {
        var data, frame, i, image, j, k, l, len, len1, len2, len3, offset, page, ref, ref1, ref2;
        len = 0;
        ref = this.imageParts;
        for (j = 0, len1 = ref.length; j < len1; j++) {
          frame = ref[j];
          len += (frame.data.length - 1) * frame.pageSize + frame.cursor;
        }
        len += frame.pageSize - frame.cursor;
        this.log(`rendering finished - filesize ${Math.round(len / 1000)}kb`);
        data = new Uint8Array(len);
        offset = 0;
        ref1 = this.imageParts;
        for (k = 0, len2 = ref1.length; k < len2; k++) {
          frame = ref1[k];
          ref2 = frame.data;
          for (i = l = 0, len3 = ref2.length; l < len3; i = ++l) {
            page = ref2[i];
            data.set(page, offset);
            if (i === frame.data.length - 1) {
              offset += frame.cursor;
            } else {
              offset += frame.pageSize;
            }
          }
        }
        image = new Blob([data], {
          type: 'image/gif'
        });
        return this.emit('finished', image, data);
      }

      async renderNextFrame() {
        var frame, task;
        if (this.nextFrame >= this.frames.length) { // no new frame to render
          return;
        }
        frame = this.frames[this.nextFrame++];
        task = this.getTask(frame);
        this.log(`starting frame ${task.index + 1} of ${this.frames.length}`);
        let event = renderFrame(task); //, [task.data.buffer]
        
        // wait a tick to allow the event loop to process
        await new Promise(resolve => setTimeout(resolve, 0));
        this.frameFinished(event);
      }

      getContextData(ctx) {
        return ctx.getImageData(0, 0, this.options.width, this.options.height).data;
      }

      getImageData(image) {
        var ctx;
        if (this._canvas == null) {
          this._canvas = document.createElement('canvas');
          this._canvas.width = this.options.width;
          this._canvas.height = this.options.height;
        }
        ctx = this._canvas.getContext('2d');
        ctx.fillStyle = this.options.background;
        ctx.fillRect(0, 0, this.options.width, this.options.height);
        ctx.drawImage(image, 0, 0);
        return this.getContextData(ctx);
      }

      getTask(frame) {
        var index, task;
        index = this.frames.indexOf(frame);
        task = {
          index: index,
          last: index === (this.frames.length - 1),
          delay: frame.delay,
          dispose: frame.dispose,
          transparent: frame.transparent,
          width: this.options.width,
          height: this.options.height,
          quality: this.options.quality,
          dither: this.options.dither,
          globalPalette: this.options.globalPalette,
          repeat: this.options.repeat
        };
        if (frame.data != null) {
          task.data = frame.data;
        } else if (frame.context != null) {
          task.data = this.getContextData(frame.context);
        } else if (frame.image != null) {
          task.data = this.getImageData(frame.image);
        } else {
          throw new Error('Invalid frame');
        }
        return task;
      }

      log(...args) {
        if (!this.options.debug) {
          return;
        }
        return console.log(...args);
      }

    }
    defaults = {
      repeat: 0, // repeat forever, -1 = repeat once
      background: '#fff',
      quality: 10, // pixel sample interval, lower is better
      width: null, // size derermined from first frame if possible
      height: null,
      transparent: null,
      debug: false,
      dither: false // see GIFEncoder.js for dithering options
    };

    frameDefaults = {
      delay: 500, // ms
      copy: false,
      dispose: -1
    };

    return GIF;

  }).call(this);

  module.exports = GIF;

}).call(commonjsGlobal);
});

function base64ToBuffer(base64) {
    const binary = window.atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; ++i) { bytes[i] = binary.charCodeAt(i); }
    return bytes.buffer;
}
var futura = base64ToBuffer("T1RUTwAKAIAAAwAgQ0ZGICyG+KgAAACsAABPs0dQT1PoqPSMAABUHAAAAnJPUy8yFFwoIQAAXlQAAABgY21hcFyiS6oAAFBgAAADumhlYWToAyBnAABWkAAAADZoaGVhCBkEJwAAVsgAAAAkaG10eI5qF6QAAFbwAAADlG1heHAA5VAAAABaiAAAAAZuYW1ldrfjNQAAWpAAAAPAcG9zdP9tAEsAAF64AAAAIAEABAQAAQEBFUZ1dHVyYS1Db25kZW5zZWRCb2xkAAECAAEAOvgPAPgbAfgcAvgdA/gUBPsqDAPWDAQcLr0N+yD7mRwEq/qLBRwA9w8cAAAQHALAERwAIR0AAE+SEgADAgABAHMAiACOQ29weXJpZ2h0IChjKSAxOTg3IEFkb2JlIFN5c3RlbXMgSW5jb3Jwb3JhdGVkLiAgQWxsIFJpZ2h0cyBSZXNlcnZlZC5GdXR1cmEgaXMgYSByZWdpc3RlcmVkIHRyYWRlbWFyayBvZiBOZXVmdmlsbGUuRnV0dXJhIENvbmRlbnNlZCBCb2xkRnV0dXJhAAAAAAEAAgADAAQABQAGAAcACAAJAAoACwAMAA0ADgAPABAAEQASABMAFAAVABYAFwAYABkAGgAbABwAHQAeAB8AIAAhACIAIwAkACUAJgAnACgAKQAqACsALAAtAC4ALwAwADEAMgAzADQANQA2ADcAOAA5ADoAOwA8AD0APgA/AEAAQQBCAEMARABFAEYARwBIAEkASgBLAEwATQBOAE8AUABRAFIAUwBUAFUAVgBXAFgAWQBaAFsAXABdAF4AXwBgAGEAYgBjAGQAZQBmAGcAaABpAGoAawBsAG0AbgBvAHAAcQByAHMAdAB1AHYAdwB4AHkAegB7AHwAfQB+AH8AgACBAIIAgwCEAIUAhgCHAIgAiQCKAIsAjACNAI4AjwCQAJEAkgCTAJQAlQCrAKwArQCuAK8AsACxALIAswC0ALUAmgC2ALcAuAC5ALoAuwC8AL0AvgC/AMAAnQDBAMIAwwDEAMUAxgDHAMgAyQDKAMsAzADNAKAAzgCqAKEAnwDPANAA0QDSAKcA0wDUANUA1gCXAKYAmACoANcA2ADZANoA2wCbAJ4AlgDcAJwApQDdAKIAowCpAJkApADeAN8A4ADhAOIA4wDkAOUDAAABAAAEAAAHAABEAAB9AADkAAFmAAIQAAK1AALVAAMRAANOAAOXAAPIAAPjAAP8AAQgAAQ9AASOAASuAAUCAAWIAAXKAAYcAAaBAAakAAc6AAefAAfeAAgRAAg2AAhbAAh+AAj4AAm8AAn/AApwAArEAAsGAAs9AAttAAvPAAwJAAwjAAxZAAyTAAyzAA0AAA1KAA2eAA3jAA5SAA6iAA8IAA8vAA9uAA+nABAPABBrABClABDQABD1ABETABE5ABFhABF3ABGXABHxABJMABKZABL0ABNXABOjABQwABR1ABSxABTuABUpABVDABW6ABX9ABZKABapABcIABc9ABeYABfHABgDABg2ABiGABjFABj3ABkiABl7ABmTABnrABotABpsABrMABthABuAABvlABxiAB0sAB2zAB3XAB4MAB5SAB50AB6WAB8SAB92AB+NAB/CACASACA3ACBxACCVACCxACDkACEZACFcACG1ACKmACMiACM9ACNZACN7ACPFACPcACQKACQvACRuACSrACTGACTwACUrACVNACVlACXKACYrACZjACb1ACd8ACfHACiVACivACjdAClIACn9ACqFACrjACtGACvIACwlACyjAC0sAC2bAC3tAC5FAC68AC8NAC9nAC+cAC/WADAuADBiADDxADFaADHNADJeADLKADNjADPpADQ0ADSMADTpADVmADW9ADYSADaJADbUADdIADfBADhbADjOADljADoEADoqADqRADs0ADt2ADuuADwqADyrAD1RAD3MAD5OAD6DAD69AD8VAD9JAD9oAD9/AD/GAEACAECNAED0AEFgAEHtAEJTAELGAEMjAENAAEPUAEQWAETDAEVFAEWkAEZoAEbnAEdEAEeRAEfnAEhEAEjAAEkVAEliAEnTAEoe+1MO+1MO+1J/91K7+KR3nxKn91L7PPcnFxPo91n5hhX7Jwb8pAf3JwYTkEFbFVdgYFcfV7Zgvx6/tra/H79gtlceDj/4Y/e3d58Snvcf+xf3EL73H/sX9xAXE9z32vhjFZr3twX7Hwaa+7cFE6BBFpr3twX7Hwaa+7cFDveC7+nvAfcW39TfA/hM9+YVQAaW6QXjBu8HPwam93IFNwZx+3IFQAal93IFOAZw+3IFLAYnB98GgC0FKQYnB+AGb/uCBd8GqPeCBdUGb/uCBd4GqPeCBeEG+yf3VhV/LQVCBpbpBQ5/9wz4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");

var css = "#progressDialog {\r\n    width: 100vw;\r\n    height: 100vh;\r\n    background-color: rgba(0, 0, 0, 0.5);\r\n    text-align: center;\r\n    color: white;\r\n    font-size: 80px;\r\n    outline: none;\r\n    border: none;\r\n}\r\n\r\n#cancelRender {\r\n    background-color: red;\r\n    border-radius: 9999px;\r\n    font-size: 30px;\r\n    padding: 10px;\r\n    padding-left: 35px;\r\n    padding-right: 35px;\r\n}\r\n\r\n.gif-captioner-btn {\r\n    position: absolute;\r\n    z-index: 4;\r\n    top: 0px;\r\n    left: 0px;\r\n    background-color: transparent;\r\n    border: none;\r\n    outline: none;\r\n    color: white;\r\n    padding: 0px;\r\n}\r\n\r\n.caption-creator {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    width: 100%;\r\n    color: white;\r\n}\r\n\r\n.settings {\r\n    display: flex;\r\n    justify-content: space-between;\r\n    align-items: center;\r\n    width: 100%;\r\n    margin-bottom: 20px;\r\n}\r\n\r\n.caption-input {\r\n    flex-grow: 1;\r\n    margin-right: 10px;\r\n}\r\n\r\n.font-size-slider {\r\n    width: 100px;\r\n}\r\n\r\n.caption-canvas {\r\n    border: 1px solid #000;\r\n    width: 100%;\r\n    border: none;\r\n    outline: none;\r\n}\r\n\r\n.caption-preview {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    width: 100%;\r\n    border: 2px solid black;\r\n}\r\n\r\n.caption-video {\r\n    width: 100%;\r\n}";

var CaptionBtnSVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"30\" height=\"30\"><rect x=\"5\" y=\"5\" width=\"14\" height=\"10\" fill=\"white\"></rect><path d=\"M18,11H16.5V10.5H14.5V13.5H16.5V13H18V14A1,1 0 0,1 17,15H14A1,1 0 0,1 13,14V10A1,1 0 0,1 14,9H17A1,1 0 0,1 18,10M11,11H9.5V10.5H7.5V13.5H9.5V13H11V14A1,1 0 0,1 10,15H7A1,1 0 0,1 6,14V10A1,1 0 0,1 7,9H10A1,1 0 0,1 11,10M19,4H5C3.89,4 3,4.89 3,6V18A2,2 0 0,0 5,20H19A2,2 0 0,0 21,18V6C21,4.89 20.1,4 19,4Z\" /></svg>";

// https://stackoverflow.com/questions/2936112/text-wrap-in-a-canvas-element
function getLines(ctx, text, maxWidth) {
    var words = text.split(" ");
    var lines = [];
    var currentLine = words[0];
    for (var i = 1; i < words.length; i++) {
        var word = words[i];
        var width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        }
        else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

const React = BdApi.React;
const {
  useState,
  useEffect,
  useRef
} = React;
function CaptionCreator({
  src,
  width,
  onUpdate
}) {
  const padding = 10;
  const [caption, setCaption] = useState('');
  const [fontSize, setFontSize] = useState(35);
  const canvasRef = useRef(null);
  function rerender() {
    onUpdate(caption, fontSize);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.font = `${fontSize}px futuraBoldCondensed`;
    const lines = getLines(ctx, caption, width);
    canvas.height = lines.length * fontSize + padding * 2;
    ctx.font = `${fontSize}px futuraBoldCondensed`;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let line = 0; line < lines.length; line++) {
      ctx.fillText(lines[line], width / 2, line * fontSize + padding);
    }
  }
  useEffect(rerender, [caption, fontSize]);
  return /*#__PURE__*/React.createElement("div", {
    className: "caption-creator"
  }, /*#__PURE__*/React.createElement("div", {
    className: "settings"
  }, /*#__PURE__*/React.createElement("input", {
    className: "caption-input",
    type: "text",
    placeholder: "Caption",
    onChange: e => setCaption(e.target.value)
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "font-size-slider"
  }, "Font Size"), /*#__PURE__*/React.createElement("input", {
    id: "font-size-slider",
    className: "font-size-slider",
    type: "range",
    min: "5",
    max: "100",
    defaultValue: "35",
    onChange: e => setFontSize(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "caption-preview"
  }, /*#__PURE__*/React.createElement("canvas", {
    className: "caption-canvas",
    ref: canvasRef,
    width: width,
    height: padding * 2
  }), /*#__PURE__*/React.createElement("video", {
    className: "caption-video",
    src: src,
    loop: true,
    muted: true,
    autoPlay: true
  })));
}

let rendering = false;
const gifSelector = "video[class^='gif']";
watchElement(gifSelector, (gif) => {
    if (gif.querySelector(".gif-captioner-btn"))
        return;
    let captionBtn = document.createElement("button");
    captionBtn.innerHTML = CaptionBtnSVG;
    captionBtn.classList.add("gif-captioner-btn");
    gif.before(captionBtn);
    BdApi.UI.createTooltip(captionBtn, "Add Custom Caption", {});
    captionBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        e.preventDefault();
        let settings = { caption: '', fontSize: 35 };
        const reactEl = BdApi.React.createElement(CaptionCreator, {
            src: gif.src,
            width: gif.videoWidth,
            onUpdate: (caption, fontSize) => {
                settings.caption = caption;
                settings.fontSize = parseInt(fontSize);
            }
        });
        const onConfirm = () => {
            // close the GIF picker
            renderGif(gif.src, settings.caption, settings.fontSize);
            document.querySelector(".expression-picker-chat-input-button > button")?.click();
        };
        BdApi.UI.showConfirmationModal("Add Caption", reactEl, {
            confirmText: 'Upload',
            cancelText: 'Cancel',
            onConfirm
        });
    });
});
function getChannelId() {
    const channelID = location.href.split("/").pop();
    // make sure channelID is a number
    if (isNaN(Number(channelID)))
        return null;
    return channelID;
}
let font = new FontFace("futuraBoldCondensed", futura);
const imgAdder = Object.values(BdApi.Webpack.getModule(module => Object.values(module)?.[0]?.addFile))[0];
const chatKeyHandlers = BdApi.Webpack.getModule((exports) => Object.values(exports)?.[0]?.
    toString().includes("selectNextCommandOption"));
let submitMessage;
onStart(() => {
    document.fonts.add(font);
    BdApi.Patcher.before("GifCaptioner", chatKeyHandlers, Object.keys(chatKeyHandlers)[0], (_, args) => {
        submitMessage = args[0].submit;
    });
});
onStop(() => {
    document.fonts.delete(font);
    BdApi.Patcher.unpatchAll("GifCaptioner");
});
function uploadFile(channelId, file) {
    // add the GIF to the message
    imgAdder.addFile({
        channelId,
        draftType: 0,
        showLargeMessageDialog: false,
        file: {
            file,
            isThumbnail: false,
            platform: 1
        }
    });
    // send the message
    submitMessage();
}
async function renderGif(originalSrc, caption, fontSize) {
    if (rendering)
        return;
    rendering = true;
    const channel = getChannelId();
    if (!channel)
        return;
    let progressDialog = document.createElement("dialog");
    progressDialog.id = "progressDialog";
    progressDialog.addEventListener("close", (e) => e.preventDefault());
    progressDialog.innerHTML = `
        <label for="renderProgress">Preparing...</label>
        <progress id="renderProgress" value="0" max="1"></progress> <br />
        <button id="cancelRender">Cancel</button>
    `;
    let progress = progressDialog.querySelector("#renderProgress");
    document.body.appendChild(progressDialog);
    progressDialog.showModal();
    let video = document.createElement("video");
    video.src = originalSrc;
    video.crossOrigin = "anonymous";
    // wait for video to load
    await new Promise((res) => {
        video.addEventListener('canplaythrough', res, { once: true });
    });
    // calculate how many frames are in the video
    video.currentTime = 0;
    video.playbackRate = 16;
    video.play();
    await new Promise((res) => video.addEventListener('ended', res, { once: true }));
    let quality = video.getVideoPlaybackQuality();
    const frames = quality.totalVideoFrames;
    console.log("Frames:", frames);
    video.pause();
    // yeah this is a bit of a mess
    const padding = 10;
    let renderCanvas = document.createElement("canvas"); // this could be an OffscreenCanvas but issues
    renderCanvas.width = video.videoWidth;
    let renderCtx = renderCanvas.getContext("2d");
    renderCtx.font = `${fontSize}px futuraBoldCondensed`;
    let lines = getLines(renderCtx, caption, renderCanvas.width);
    renderCanvas.height = video.videoHeight + (lines.length * fontSize) + (padding * 2);
    renderCtx.font = `${fontSize}px futuraBoldCondensed`;
    renderCtx.textAlign = 'center';
    renderCtx.textBaseline = 'top';
    console.log("Rendering to", renderCanvas.width, "x", renderCanvas.height);
    // scale down the gif to fit within the max size (needs work)
    const maxSize = 24e6; // 24 MB
    const estSize = frames * renderCanvas.width * renderCanvas.height;
    console.log("Estimated size:", estSize);
    const factor = Math.max(1, Math.sqrt(estSize / maxSize));
    const newWidth = Math.floor(renderCanvas.width / factor);
    const newHeight = Math.floor(renderCanvas.height / factor);
    console.log("Scaling down by a factor of", factor, "to", newWidth, "x", newHeight);
    let gif$1 = new gif({
        quality: 10,
        width: newWidth,
        height: newHeight,
    });
    let aborted = false;
    progressDialog.querySelector("#cancelRender").addEventListener("click", () => {
        if (gif$1.running)
            gif$1.abort();
        aborted = true;
        document.body.removeChild(progressDialog);
    });
    gif$1.on('progress', (e) => {
        console.log("Rending progress:", e);
        progress.value = e;
    });
    gif$1.on('finished', (blob) => {
        rendering = false;
        document.body.removeChild(progressDialog);
        console.log("Final size:", blob.size);
        let file = new File([blob], 'rendered.gif', { type: 'image/gif' });
        uploadFile(channel, file);
    });
    let fps = frames / video.duration;
    let scaledCanvas = document.createElement("canvas");
    let scaledCtx = scaledCanvas.getContext("2d");
    scaledCanvas.width = newWidth;
    scaledCanvas.height = newHeight;
    progressDialog.querySelector("label").innerHTML = "Rendering...";
    renderCtx.fillStyle = "white";
    renderCtx.fillRect(0, 0, renderCanvas.width, renderCanvas.height);
    renderCtx.font = `${fontSize}px futuraBoldCondensed`;
    renderCtx.fillStyle = "black";
    for (let i = 0; i < lines.length; i++) {
        renderCtx.fillText(lines[i], renderCanvas.width / 2, i * fontSize + padding);
    }
    const captionHeight = (lines.length * fontSize) + (padding * 2);
    for (let frame = 0; frame < frames; frame++) {
        if (aborted)
            break;
        video.currentTime = frame * 1 / fps + Number.MIN_VALUE;
        await new Promise((res) => video.addEventListener('seeked', res, { once: true }));
        renderCtx.fillStyle = "white";
        renderCtx.fillRect(0, captionHeight, renderCanvas.width, renderCanvas.height);
        renderCtx.drawImage(video, 0, captionHeight);
        scaledCtx.drawImage(renderCanvas, 0, 0, newWidth, newHeight);
        gif$1.addFrame(scaledCtx, { delay: 1 / fps * 1000, copy: true });
        progress.value = frame / frames;
    }
    progressDialog.querySelector("label").innerHTML = "Encoding...";
    gif$1.render();
}
onStart(() => {
    BdApi.DOM.addStyle("gif-captioner-style", css);
});
onStop(() => {
    BdApi.DOM.removeStyle("gif-captioner-style");
    // cleanup any buttons that were added
    let btns = document.querySelectorAll(".gif-captioner-btn");
    for (let btn of btns) {
        btn.remove();
    }
});

exports.chatKeyHandlers = chatKeyHandlers;
exports.imgAdder = imgAdder;
    }

    start() {
        for(let callback of this.startCallbacks) {
            callback.callback();
        }
    }
    stop() {
        for(let callback of this.stopCallbacks) {
            callback.callback();
        }
    }
}
