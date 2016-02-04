(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var LParticle;

LParticle = {};

LParticle.ParticleSystem = require('./particle/particleSystem');

LParticle.Emitter = require('./particle/emitters');

LParticle.Initializer = require('./particle/initializers');

LParticle.Affector = require('./particle/affectors');

LParticle.Renderer = require('./particle/renderers');

LParticle.colorUtils = require('./utils/colorUtils');

global.LParticle = LParticle;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./particle/affectors":2,"./particle/emitters":3,"./particle/initializers":4,"./particle/particleSystem":5,"./particle/renderers":6,"./utils/colorUtils":7}],2:[function(require,module,exports){
var Affector, colorUtils, rangeValue;

rangeValue = require('../utils/rangeValue');

colorUtils = require('../utils/colorUtils');

Affector = {};

Affector.move = (function() {
  function move() {}

  move.prototype.initParticle = function(p) {
    p.x = p.x || 0;
    p.y = p.y || 0;
    if (p.accx) {
      p.dx = p.dx || 0;
    }
    if (p.accy) {
      p.dy = p.dy || 0;
    }
  };

  move.prototype.updateParticle = function(dt, p) {
    if (p.dx) {
      p.x += p.dx * dt;
    }
    if (p.dy) {
      p.y += p.dy * dt;
    }
    if (p.accx) {
      p.dx += p.accx * dt;
    }
    if (p.accy) {
      p.dy += p.accy * dt;
    }
  };

  return move;

})();

Affector.size = (function() {
  function size(system, params) {
    this.fromSizeVal = rangeValue(params.from);
    this.toSizeVal = rangeValue(params.to);
  }

  size.prototype.initParticle = function(p) {
    p.sizeFrom = this.fromSizeVal();
    p.sizeTo = this.toSizeVal();
    return p.size = p.sizeFrom;
  };

  size.prototype.updateParticle = function(dt, p) {
    var t;
    t = p.life / p.maxLife;
    return p.size = p.sizeFrom * t + p.sizeTo * (1 - t);
  };

  return size;

})();

Affector.color = (function() {
  function color(system, params) {
    this.fromColorVal = colorUtils.colorRangeValue(params.from);
    this.toColorVal = colorUtils.colorRangeValue(params.to);
  }

  color.prototype.initParticle = function(p) {
    p.colorFrom = this.fromColorVal();
    p.colorTo = this.toColorVal();
    return p.color = p.colorFrom.slice();
  };

  color.prototype.updateParticle = function(dt, p) {
    var t;
    t = p.life / p.maxLife;
    p.color[0] = p.colorFrom[0] * t + p.colorTo[0] * (1 - t);
    p.color[1] = p.colorFrom[1] * t + p.colorTo[1] * (1 - t);
    p.color[2] = p.colorFrom[2] * t + p.colorTo[2] * (1 - t);
    return p.color[3] = p.colorFrom[3] * t + p.colorTo[3] * (1 - t);
  };

  return color;

})();

Affector.alpha = (function() {
  function alpha(system, params) {
    this.fromAlphaVal = rangeValue(params.from);
    this.toAlphaVal = rangeValue(params.to);
  }

  alpha.prototype.initParticle = function(p) {
    p.alphaFrom = this.fromAlphaVal();
    p.alphaTo = this.toAlphaVal();
    return p.alpha = p.alphaFrom;
  };

  alpha.prototype.updateParticle = function(dt, p) {
    var t;
    t = p.life / p.maxLife;
    return p.alpha = p.alphaFrom * t + p.alphaTo * (1 - t);
  };

  return alpha;

})();

Affector.rotation = (function() {
  function rotation(system, params) {
    this.fromAngleVal = rangeValue(params.from);
    this.toAngleVal = rangeValue(params.to);
  }

  rotation.prototype.initParticle = function(p) {
    p.angleFrom = this.fromAngleVal();
    p.angleTo = this.toAngleVal();
    return p.angle = p.angleFrom;
  };

  rotation.prototype.updateParticle = function(dt, p) {
    var t;
    t = p.life / p.maxLife;
    return p.rotation = p.angleFrom * t + p.angleTo * (1 - t);
  };

  return rotation;

})();

module.exports = Affector;


},{"../utils/colorUtils":7,"../utils/rangeValue":8}],3:[function(require,module,exports){
var Emitter, rangeValue;

rangeValue = require('../utils/rangeValue');

Emitter = {};

Emitter.once = (function() {
  function once(system, params) {
    this.system = system;
    this.count = rangeValue(params.count)();
    this.lifeVal = rangeValue(params.life);
    this.emitted = false;
  }

  once.prototype.update = function() {
    var i, j, ref;
    if (!this.emitted) {
      for (i = j = 1, ref = this.count; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
        this.system.spawnParticle({
          life: this.lifeVal()
        });
      }
      this.emitted = true;
    }
    return true;
  };

  once.prototype.isAlive = function() {
    return !this.emitted;
  };

  return once;

})();

Emitter.infinite = (function() {
  function infinite(system, params) {
    this.system = system;
    this.rateVal = rangeValue(params.rate);
    this.lifeVal = rangeValue(params.life);
    this.emitted = false;
    this.timer = 0;
    this._updateDuration();
  }

  infinite.prototype._updateDuration = function() {
    var rate;
    rate = this.rateVal();
    if (rate > 0.001) {
      return this.duration = 1 / rate;
    } else {
      return this.duration = 10e10;
    }
  };

  infinite.prototype.update = function(dt) {
    this.timer += dt;
    while (this.timer > this.duration) {
      this.timer -= this.duration;
      this.system.spawnParticle({
        life: this.lifeVal()
      });
      this._updateDuration();
    }
    return true;
  };

  infinite.prototype.isAlive = function() {
    return true;
  };

  return infinite;

})();

module.exports = Emitter;


},{"../utils/rangeValue":8}],4:[function(require,module,exports){
var Initializer, colorUtils, rangeValue;

rangeValue = require('../utils/rangeValue');

colorUtils = require('../utils/colorUtils');

Initializer = {};

Initializer.radius = (function() {
  function radius(system, params) {
    this.radiusVal = rangeValue(params.radius);
    this.speedVal = rangeValue(params.speed);
  }

  radius.prototype.initParticle = function(p) {
    var cosTheta, orgX, orgY, radius, sinTheta, speed, theta;
    orgX = p.x || 0;
    orgY = p.y || 0;
    theta = Math.random() * Math.PI * 2;
    sinTheta = Math.sin(theta);
    cosTheta = Math.cos(theta);
    radius = this.radiusVal();
    speed = this.speedVal();
    p.x = cosTheta * radius + orgX;
    p.y = sinTheta * radius + orgY;
    p.dx = cosTheta * speed;
    return p.dy = sinTheta * speed;
  };

  return radius;

})();

Initializer.box = (function() {
  function box(system, params) {
    this.xVal = rangeValue(params.x);
    this.yVal = rangeValue(params.y);
  }

  box.prototype.initParticle = function(p) {
    var orgX, orgY, x, y;
    orgX = p.x || 0;
    orgY = p.y || 0;
    x = this.xVal();
    y = this.yVal();
    p.x = x + orgX;
    return p.y = y + orgY;
  };

  return box;

})();

Initializer.delta_speed = (function() {
  function delta_speed(system, params) {
    var ref;
    this.speedXVal = rangeValue(params.x);
    this.speedYVal = rangeValue(params.y);
    this.mulVal = rangeValue((ref = params.mul) != null ? ref : 1);
  }

  delta_speed.prototype.initParticle = function(p) {
    var dx, dy, mul;
    dx = p.dx || 0;
    dy = p.dy || 0;
    mul = this.mulVal();
    p.dx = (dx + this.speedXVal()) * mul;
    return p.dy = (dy + this.speedYVal()) * mul;
  };

  return delta_speed;

})();

Initializer.force = (function() {
  function force(system, params) {
    this.forceXVal = rangeValue(params.x);
    this.forceYVal = rangeValue(params.y);
  }

  force.prototype.initParticle = function(p) {
    p.accx = this.forceXVal();
    return p.accy = this.forceYVal();
  };

  return force;

})();

Initializer.rotation = (function() {
  function rotation(system, params) {
    this.angleVal = rangeValue(params.angle);
  }

  rotation.prototype.initParticle = function(p) {
    return p.rotation = this.angleVal();
  };

  return rotation;

})();

Initializer.size = (function() {
  function size(system, params) {
    this.sizeVal = rangeValue(params.size);
  }

  size.prototype.initParticle = function(p) {
    return p.size = this.sizeVal();
  };

  return size;

})();

Initializer.color = (function() {
  function color(system, params) {
    this.colorVal = colorUtils.colorRangeValue(params.color);
  }

  color.prototype.initParticle = function(p) {
    return p.color = this.colorVal();
  };

  return color;

})();

Initializer.attach_node_pos = (function() {
  function attach_node_pos(system1, params) {
    this.system = system1;
    this.attachToNode = params.node;
  }

  attach_node_pos.prototype.initParticle = function(p) {
    var globalPos, localPos;
    globalPos = this.attachToNode.localToGlobal(new LPoint(this.system.x, this.system.y));
    localPos = this.system.globalToLocal(globalPos);
    p.x = localPos.x;
    return p.y = localPos.y;
  };

  return attach_node_pos;

})();

module.exports = Initializer;


},{"../utils/colorUtils":7,"../utils/rangeValue":8}],5:[function(require,module,exports){
var Affector, Emitter, Initializer, ParticleSystem, Renderer;

Affector = require('./affectors');

Emitter = require('./emitters');

Renderer = require('./renderers');

Initializer = require('./initializers');

ParticleSystem = (function() {
  function ParticleSystem(params) {
    var curTime;
    LExtends(this, LSprite, []);
    this.removeOnFinish = true;
    this.emitters = this._createComponents("emitters", Emitter, params);
    this.initializers = this._createComponents("initializers", Initializer, params);
    this.affectors = this._createComponents("affectors", Affector, params);
    this.renderers = this._createComponents("renderers", Renderer, params);
    this.particles = [];
    this.graphics.add((function(_this) {
      return function(ctx) {
        var i, j, len, len1, p, ref, ref1, renderer;
        ctx.save();
        if (_this.blendMode) {
          ctx.globalCompositeOperation = _this.blendMode;
        }
        ref = _this.particles;
        for (i = 0, len = ref.length; i < len; i++) {
          p = ref[i];
          if (p.life > 0) {
            ref1 = _this.renderers;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              renderer = ref1[j];
              renderer.drawParticle(ctx, p);
            }
          }
        }
        ctx.restore();
      };
    })(this));
    curTime = Date.now();
    this.addEventListener(LEvent.ENTER_FRAME, (function(_this) {
      return function() {
        var deltaTime, newTime;
        newTime = Date.now();
        deltaTime = newTime - curTime;
        curTime = newTime;
        deltaTime = Math.min(deltaTime, 100);
        return _this.update(deltaTime / 1000);
      };
    })(this));
  }

  ParticleSystem.prototype._createComponents = function(compType, compCollection, paramsObj) {
    var cls, i, len, params, paramsList, results;
    paramsList = paramsObj[compType];
    if (!(paramsList && paramsList.length > 0)) {
      return [];
    }
    results = [];
    for (i = 0, len = paramsList.length; i < len; i++) {
      params = paramsList[i];
      cls = compCollection[params.name];
      if (typeof cls !== "function") {
        console.error(compType + "." + params.name + " is undefined!");
        continue;
      }
      results.push(new cls(this, params));
    }
    return results;
  };

  ParticleSystem.prototype.spawnParticle = function(p) {
    var affector, i, initializer, j, k, len, len1, len2, ref, ref1, ref2, renderer;
    if (p == null) {
      p = {};
    }
    ref = this.initializers;
    for (i = 0, len = ref.length; i < len; i++) {
      initializer = ref[i];
      initializer.initParticle(p);
    }
    ref1 = this.affectors;
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      affector = ref1[j];
      if (typeof affector.initParticle === "function") {
        affector.initParticle(p);
      }
    }
    ref2 = this.renderers;
    for (k = 0, len2 = ref2.length; k < len2; k++) {
      renderer = ref2[k];
      if (typeof renderer.initParticle === "function") {
        renderer.initParticle(p);
      }
    }
    p.maxLife = p.life;
    this.particles.push(p);
    return p;
  };

  ParticleSystem.prototype.isAlive = function() {
    var emitter, i, j, len, len1, p, ref, ref1;
    ref = this.emitters;
    for (i = 0, len = ref.length; i < len; i++) {
      emitter = ref[i];
      if (emitter.isAlive()) {
        return true;
      }
    }
    ref1 = this.particles;
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      p = ref1[j];
      if (p.life > 0) {
        return true;
      }
    }
    return false;
  };

  ParticleSystem.prototype.update = function(dt) {
    var affector, aliveParticles, emitter, i, isAlive, j, k, len, len1, len2, p, ps, ref, ref1;
    isAlive = false;
    ref = this.emitters;
    for (i = 0, len = ref.length; i < len; i++) {
      emitter = ref[i];
      if (!(emitter.isAlive())) {
        continue;
      }
      isAlive = true;
      emitter.update(dt);
    }
    ps = this.particles;
    if (ps.length > 0) {
      aliveParticles = 0;
      for (j = 0, len1 = ps.length; j < len1; j++) {
        p = ps[j];
        if (!(p.life > 0)) {
          continue;
        }
        aliveParticles++;
        isAlive = true;
        ref1 = this.affectors;
        for (k = 0, len2 = ref1.length; k < len2; k++) {
          affector = ref1[k];
          affector.updateParticle(dt, p);
        }
        p.life -= dt;
      }
      if (aliveParticles === 0) {
        ps.length = 0;
      } else if (this.particles.length - aliveParticles > 10) {
        this.particles = ps.filter(function(p) {
          return p.life > 0;
        });
      }
    }
    if (this.removeOnFinish && !isAlive) {
      console.log("remove");
      this.remove();
    }
  };

  ParticleSystem.prototype.reset = function() {
    var emitter, i, len, ref;
    ref = this.emitters;
    for (i = 0, len = ref.length; i < len; i++) {
      emitter = ref[i];
      if (typeof emitter.reset === "function") {
        emitter.reset();
      }
    }
    return this.particles.length = 0;
  };

  return ParticleSystem;

})();

module.exports = ParticleSystem;


},{"./affectors":2,"./emitters":3,"./initializers":4,"./renderers":6}],6:[function(require,module,exports){
var Renderer, colorToStyle, colorUtils;

colorUtils = require('../utils/colorUtils');

colorToStyle = colorUtils.colorToStyle;

Renderer = {};

Renderer.dot = (function() {
  function dot() {}

  dot.prototype.initParticle = function(p) {
    if (p.x == null) {
      p.x = 0;
    }
    if (p.y == null) {
      p.y = 0;
    }
    if (p.size == null) {
      p.size = 1;
    }
    return p.color != null ? p.color : p.color = [255, 0, 0];
  };

  dot.prototype.drawParticle = function(ctx, p) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, 2 * Math.PI);
    ctx.fillStyle = colorToStyle(p.color);
    return ctx.fill();
  };

  return dot;

})();

Renderer.box = (function() {
  function box() {}

  box.prototype.initParticle = function(p) {
    if (p.x == null) {
      p.x = 0;
    }
    if (p.y == null) {
      p.y = 0;
    }
    if (p.size == null) {
      p.size = 1;
    }
    return p.color != null ? p.color : p.color = [255, 0, 0];
  };

  box.prototype.drawParticle = function(ctx, p) {
    var rot, size;
    ctx.beginPath();
    rot = p.rotation;
    size = p.size;
    ctx.fillStyle = colorToStyle(p.color);
    if (rot) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(rot);
      ctx.fillRect(-size, -size, size * 2, size * 2);
      return ctx.restore();
    } else {
      return ctx.fillRect(-size + p.x, -size + p.y, size * 2, size * 2);
    }
  };

  return box;

})();

Renderer.dot_fade = (function() {
  function dot_fade() {}

  dot_fade.prototype.initParticle = function(p) {
    if (p.x == null) {
      p.x = 0;
    }
    if (p.y == null) {
      p.y = 0;
    }
    if (p.size == null) {
      p.size = 1;
    }
    return p.color != null ? p.color : p.color = [100, 100, 100];
  };

  dot_fade.prototype.drawParticle = function(ctx, p) {
    var a, rad, rot, size;
    ctx.beginPath();
    rot = p.rotation;
    size = p.size;
    ctx.save();
    rad = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
    a = p.color[3];
    rad.addColorStop(0, colorToStyle(p.color));
    p.color[3] = 0;
    rad.addColorStop(1, colorToStyle(p.color));
    p.color[3] = a;
    ctx.fillStyle = rad;
    ctx.translate(p.x, p.y);
    if (rot) {
      ctx.rotate(rot);
    }
    ctx.fillRect(-size, -size, size * 2, size * 2);
    return ctx.restore();
  };

  return dot_fade;

})();

Renderer.image = (function() {
  function image(system, params) {
    this.image = params.image;
  }

  image.prototype.initParticle = function(p) {
    if (p.x == null) {
      p.x = 0;
    }
    if (p.y == null) {
      p.y = 0;
    }
    if (p.size == null) {
      p.size = 1;
    }
    return p.alpha != null ? p.alpha : p.alpha = 1;
  };

  image.prototype.drawParticle = function(ctx, p) {
    var rot, size;
    rot = p.rotation;
    size = p.size;
    ctx.globalAlpha = p.alpha;
    if (rot) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(rot);
      ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, -size, -size, size * 2, size * 2);
      return ctx.restore();
    } else {
      return ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, p.x - size, p.y - size, size * 2, size * 2);
    }
  };

  return image;

})();

module.exports = Renderer;


},{"../utils/colorUtils":7}],7:[function(require,module,exports){
var rangeValue;

rangeValue = require('./rangeValue');

module.exports = {
  colorRangeValue: function(color) {
    var a, b, g, r;
    r = rangeValue(color[0]);
    g = rangeValue(color[1]);
    b = rangeValue(color[2]);
    a = rangeValue(color[3]);
    return function() {
      return [r(), g(), b(), a()];
    };
  },
  colorToStyle: function(color) {
    var a, b, g, r;
    r = ~~color[0];
    g = ~~color[1];
    b = ~~color[2];
    a = color[3];
    if (a != null) {
      return "rgba(" + r + "," + g + "," + b + "," + a + ")";
    } else {
      return "rgb(" + r + "," + g + "," + b + ")";
    }
  }
};


},{"./rangeValue":8}],8:[function(require,module,exports){
module.exports = function(val) {
  if (val.length > 1) {
    return function() {
      return (val[1] - val[0]) * Math.random() + val[0];
    };
  } else {
    return function() {
      return val;
    };
  }
};


},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9jb2ZmZWUvbGliLmNvZmZlZSIsIi4uL2NvZmZlZS9wYXJ0aWNsZS9hZmZlY3RvcnMuY29mZmVlIiwiLi4vY29mZmVlL3BhcnRpY2xlL2VtaXR0ZXJzLmNvZmZlZSIsIi4uL2NvZmZlZS9wYXJ0aWNsZS9pbml0aWFsaXplcnMuY29mZmVlIiwiLi4vY29mZmVlL3BhcnRpY2xlL3BhcnRpY2xlU3lzdGVtLmNvZmZlZSIsIi4uL2NvZmZlZS9wYXJ0aWNsZS9yZW5kZXJlcnMuY29mZmVlIiwiLi4vY29mZmVlL3V0aWxzL2NvbG9yVXRpbHMuY29mZmVlIiwiLi4vY29mZmVlL3V0aWxzL3JhbmdlVmFsdWUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0NBLElBQUE7O0FBQUEsU0FBQSxHQUFZOztBQUNaLFNBQVMsQ0FBQyxjQUFWLEdBQThCLE9BQUEsQ0FBUSwyQkFBUjs7QUFDOUIsU0FBUyxDQUFDLE9BQVYsR0FBOEIsT0FBQSxDQUFRLHFCQUFSOztBQUM5QixTQUFTLENBQUMsV0FBVixHQUE4QixPQUFBLENBQVEseUJBQVI7O0FBQzlCLFNBQVMsQ0FBQyxRQUFWLEdBQThCLE9BQUEsQ0FBUSxzQkFBUjs7QUFDOUIsU0FBUyxDQUFDLFFBQVYsR0FBOEIsT0FBQSxDQUFRLHNCQUFSOztBQUM5QixTQUFTLENBQUMsVUFBVixHQUE4QixPQUFBLENBQVEsb0JBQVI7O0FBRTlCLE1BQU0sQ0FBQyxTQUFQLEdBQW1COzs7Ozs7QUNSbkIsSUFBQTs7QUFBQSxVQUFBLEdBQWEsT0FBQSxDQUFRLHFCQUFSOztBQUNiLFVBQUEsR0FBYSxPQUFBLENBQVEscUJBQVI7O0FBRWIsUUFBQSxHQUFXOztBQUVMLFFBQVEsQ0FBQztFQUNFLGNBQUEsR0FBQTs7aUJBQ2IsWUFBQSxHQUFjLFNBQUMsQ0FBRDtJQUNWLENBQUMsQ0FBQyxD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TUFBQTthQUdJLE1BQUEsR0FBTyxDQUFQLEdBQVMsR0FBVCxHQUFZLENBQVosR0FBYyxHQUFkLEdBQWlCLENBQWpCLEdBQW1CLElBSHZCOztFQUxVLENBUmQ7Ozs7O0FDRkosTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxHQUFEO0VBQ2IsSUFBRyxHQUFHLENBQUMsTUFBSixHQUFhLENBQWhCO1dBQ0ksU0FBQTthQUFHLENBQUMsR0FBSSxDQUFBLENBQUEsQ0FBSixHQUFTLEdBQUksQ0FBQSxDQUFBLENBQWQsQ0FBQSxHQUFvQixJQUFJLENBQUMsTUFBTCxDQUFBLENBQXBCLEdBQW9DLEdBQUksQ0FBQSxDQUFBO0lBQTNDLEVBREo7R0FBQSxNQUFBO1dBR0ksU0FBQTthQUFHO0lBQUgsRUFISjs7QUFEYSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIjIENyZWF0ZWQgYnkgeWFvY2h1bmh1aSBvbiAxNi8xLzI3LlxuTFBhcnRpY2xlID0ge31cbkxQYXJ0aWNsZS5QYXJ0aWNsZVN5c3RlbSAgICA9IHJlcXVpcmUgJy4vcGFydGljbGUvcGFydGljbGVTeXN0ZW0nXG5MUGFydGljbGUuRW1pdHRlciAgICAgICAgICAgPSByZXF1aXJlICcuL3BhcnRpY2xlL2VtaXR0ZXJzJ1xuTFBhcnRpY2xlLkluaXRpYWxpemVyICAgICAgID0gcmVxdWlyZSAnLi9wYXJ0aWNsZS9pbml0aWFsaXplcnMnXG5MUGFydGljbGUuQWZmZWN0b3IgICAgICAgICAgPSByZXF1aXJlICcuL3BhcnRpY2xlL2FmZmVjdG9ycydcbkxQYXJ0aWNsZS5SZW5kZXJlciAgICAgICAgICA9IHJlcXVpcmUgJy4vcGFydGljbGUvcmVuZGVyZXJzJ1xuTFBhcnRpY2xlLmNvbG9yVXRpbHMgICAgICAgID0gcmVxdWlyZSAnLi91dGlscy9jb2xvclV0aWxzJ1xuXG5nbG9iYWwuTFBhcnRpY2xlID0gTFBhcnRpY2xlXG5cbiIsIiMgQ3JlYXRlZCBieSB5YW9jaHVuaHVpIG9uIDE2LzEvNC5cbnJhbmdlVmFsdWUgPSByZXF1aXJlICcuLi91dGlscy9yYW5nZVZhbHVlJ1xuY29sb3JVdGlscyA9IHJlcXVpcmUgJy4uL3V0aWxzL2NvbG9yVXRpbHMnXG5cbkFmZmVjdG9yID0ge31cblxuY2xhc3MgQWZmZWN0b3IubW92ZVxuICAgIGNvbnN0cnVjdG9yOiAtPlxuICAgIGluaXRQYXJ0aWNsZTogKHApIC0+XG4gICAgICAgIHAueCA9IHAueCBvciAwXG4gICAgICAgIHAueSA9IHAueSBvciAwXG4gICAgICAgIGlmIHAuYWNjeFxuICAgICAgICAgICAgcC5keCA9IHAuZHggb3IgMFxuICAgICAgICBpZiBwLmFjY3lcbiAgICAgICAgICAgIHAuZHkgPSBwLmR5IG9yIDBcbiAgICAgICAgcmV0dXJuXG5cbiAgICB1cGRhdGVQYXJ0aWNsZTogKGR0LCBwKSAtPlxuICAgICAgICBpZiBwLmR4XG4gICAgICAgICAgICBwLnggKz0gcC5keCAqIGR0XG4gICAgICAgIGlmIHAuZHlcbiAgICAgICAgICAgIHAueSArPSBwLmR5ICogZHRcbiAgICAgICAgaWYgcC5hY2N4XG4gICAgICAgICAgICBwLmR4ICs9IHAuYWNjeCAqIGR0XG4gICAgICAgIGlmIHAuYWNjeVxuICAgICAgICAgICAgcC5keSArPSBwLmFjY3kgKiBkdFxuICAgICAgICByZXR1cm5cblxuY2xhc3MgQWZmZWN0b3Iuc2l6ZVxuICAgIGNvbnN0cnVjdG9yOiAoc3lzdGVtLCBwYXJhbXMpIC0+XG4gICAgICAgIEBmcm9tU2l6ZVZhbCA9IHJhbmdlVmFsdWUgcGFyYW1zLmZyb21cbiAgICAgICAgQHRvU2l6ZVZhbCA9IHJhbmdlVmFsdWUgcGFyYW1zLnRvXG5cbiAgICBpbml0UGFydGljbGU6IChwKSAtPlxuICAgICAgICBwLnNpemVGcm9tID0gQGZyb21TaXplVmFsKClcbiAgICAgICAgcC5zaXplVG8gPSBAdG9TaXplVmFsKClcbiAgICAgICAgcC5zaXplID0gcC5zaXplRnJvbVxuXG4gICAgdXBkYXRlUGFydGljbGU6IChkdCwgcCkgLT5cbiAgICAgICAgdCA9IHAubGlmZSAvIHAubWF4TGlmZVxuICAgICAgICBwLnNpemUgPSBwLnNpemVGcm9tICogdCArIHAuc2l6ZVRvICogKDEgLSB0KVxuXG5jbGFzcyBBZmZlY3Rvci5jb2xvclxuICAgIGNvbnN0cnVjdG9yOiAoc3lzdGVtLCBwYXJhbXMpIC0+XG4gICAgICAgIEBmcm9tQ29sb3JWYWwgPSBjb2xvclV0aWxzLmNvbG9yUmFuZ2VWYWx1ZSBwYXJhbXMuZnJvbVxuICAgICAgICBAdG9Db2xvclZhbCA9IGNvbG9yVXRpbHMuY29sb3JSYW5nZVZhbHVlIHBhcmFtcy50b1xuXG4gICAgaW5pdFBhcnRpY2xlOiAocCkgLT5cbiAgICAgICAgcC5jb2xvckZyb20gPSBAZnJvbUNvbG9yVmFsKClcbiAgICAgICAgcC5jb2xvclRvID0gQHRvQ29sb3JWYWwoKVxuICAgICAgICBwLmNvbG9yID0gcC5jb2xvckZyb20uc2xpY2UoKVxuXG4gICAgdXBkYXRlUGFydGljbGU6IChkdCwgcCkgLT5cbiAgICAgICAgdCA9IHAubGlmZSAvIHAubWF4TGlmZVxuICAgICAgICBwLmNvbG9yWzBdID0gcC5jb2xvckZyb21bMF0gKiB0ICsgcC5jb2xvclRvWzBdICogKDEgLSB0KVxuICAgICAgICBwLmNvbG9yWzFdID0gcC5jb2xvckZyb21bMV0gKiB0ICsgcC5jb2xvclRvWzFdICogKDEgLSB0KVxuICAgICAgICBwLmNvbG9yWzJdID0gcC5jb2xvckZyb21bMl0gKiB0ICsgcC5jb2xvclRvWzJdICogKDEgLSB0KVxuICAgICAgICBwLmNvbG9yWzNdID0gcC5jb2xvckZyb21bM10gKiB0ICsgcC5jb2xvclRvWzNdICogKDEgLSB0KVxuXG5jbGFzcyBBZmZlY3Rvci5hbHBoYVxuICAgIGNvbnN0cnVjdG9yOiAoc3lzdGVtLCBwYXJhbXMpIC0+XG4gICAgICAgIEBmcm9tQWxwaGFWYWwgPSByYW5nZVZhbHVlIHBhcmFtcy5mcm9tXG4gICAgICAgIEB0b0FscGhhVmFsID0gcmFuZ2VWYWx1ZSBwYXJhbXMudG9cblxuICAgIGluaXRQYXJ0aWNsZTogKHApIC0+XG4gICAgICAgIHAuYWxwaGFGcm9tID0gQGZyb21BbHBoYVZhbCgpXG4gICAgICAgIHAuYWxwaGFUbyA9IEB0b0FscGhhVmFsKClcbiAgICAgICAgcC5hbHBoYSA9IHAuYWxwaGFGcm9tXG5cbiAgICB1cGRhdGVQYXJ0aWNsZTogKGR0LCBwKSAtPlxuICAgICAgICB0ID0gcC5saWZlIC8gcC5tYXhMaWZlXG4gICAgICAgIHAuYWxwaGEgPSBwLmFscGhhRnJvbSAqIHQgKyBwLmFscGhhVG8gKiAoMSAtIHQpXG5cbmNsYXNzIEFmZmVjdG9yLnJvdGF0aW9uXG4gICAgY29uc3RydWN0b3I6IChzeXN0ZW0sIHBhcmFtcykgLT5cbiAgICAgICAgQGZyb21BbmdsZVZhbCA9IHJhbmdlVmFsdWUgcGFyYW1zLmZyb21cbiAgICAgICAgQHRvQW5nbGVWYWwgPSByYW5nZVZhbHVlIHBhcmFtcy50b1xuXG4gICAgaW5pdFBhcnRpY2xlOiAocCkgLT5cbiAgICAgICAgcC5hbmdsZUZyb20gPSBAZnJvbUFuZ2xlVmFsKClcbiAgICAgICAgcC5hbmdsZVRvID0gQHRvQW5nbGVWYWwoKVxuICAgICAgICBwLmFuZ2xlID0gcC5hbmdsZUZyb21cblxuICAgIHVwZGF0ZVBhcnRpY2xlOiAoZHQsIHApIC0+XG4gICAgICAgIHQgPSBwLmxpZmUgLyBwLm1heExpZmVcbiAgICAgICAgcC5yb3RhdGlvbiA9IHAuYW5nbGVGcm9tICogdCArIHAuYW5nbGVUbyAqICgxIC0gdClcbm1vZHVsZS5leHBvcnRzID0gQWZmZWN0b3JcbiIsIiMgQ3JlYXRlZCBieSB5YW9jaHVuaHVpIG9uIDE2LzEvNC5cbnJhbmdlVmFsdWUgPSByZXF1aXJlICcuLi91dGlscy9yYW5nZVZhbHVlJ1xuRW1pdHRlciA9IHt9XG5cbmNsYXNzIEVtaXR0ZXIub25jZVxuICAgIGNvbnN0cnVjdG9yOiAoQHN5c3RlbSwgcGFyYW1zKS0+XG4gICAgICAgIEBjb3VudCA9IHJhbmdlVmFsdWUocGFyYW1zLmNvdW50KSgpXG4gICAgICAgIEBsaWZlVmFsID0gcmFuZ2VWYWx1ZSBwYXJhbXMubGlmZVxuICAgICAgICBAZW1pdHRlZCA9IGZhbHNlXG5cbiAgICB1cGRhdGU6IC0+XG4gICAgICAgIHVubGVzcyBAZW1pdHRlZFxuICAgICAgICAgICAgZm9yIGkgaW4gWzEuLkBjb3VudF1cbiAgICAgICAgICAgICAgICBAc3lzdGVtLnNwYXduUGFydGljbGUobGlmZTogQGxpZmVWYWwoKSlcbiAgICAgICAgICAgIEBlbWl0dGVkID0gdHJ1ZVxuXG4gICAgICAgIHRydWVcblxuICAgIGlzQWxpdmU6IC0+ICFAZW1pdHRlZFxuXG5jbGFzcyBFbWl0dGVyLmluZmluaXRlXG4gICAgY29uc3RydWN0b3I6IChAc3lzdGVtLCBwYXJhbXMpLT5cbiAgICAgICAgQHJhdGVWYWwgPSByYW5nZVZhbHVlIHBhcmFtcy5yYXRlXG4gICAgICAgIEBsaWZlVmFsID0gcmFuZ2VWYWx1ZSBwYXJhbXMubGlmZVxuICAgICAgICBAZW1pdHRlZCA9IGZhbHNlXG4gICAgICAgIEB0aW1lciA9IDBcbiAgICAgICAgQF91cGRhdGVEdXJhdGlvbigpXG5cbiAgICBfdXBkYXRlRHVyYXRpb246IC0+XG4gICAgICAgIHJhdGUgPSBAcmF0ZVZhbCgpXG4gICAgICAgIGlmIHJhdGUgPiAwLjAwMVxuICAgICAgICAgICAgQGR1cmF0aW9uID0gMSAvIHJhdGVcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQGR1cmF0aW9uID0gMTBlMTBcblxuICAgIHVwZGF0ZTogKGR0KS0+XG4gICAgICAgIEB0aW1lciArPSBkdFxuICAgICAgICB3aGlsZSBAdGltZXIgPiBAZHVyYXRpb25cbiAgICAgICAgICAgIEB0aW1lciAtPSBAZHVyYXRpb25cbiAgICAgICAgICAgIEBzeXN0ZW0uc3Bhd25QYXJ0aWNsZShsaWZlOiBAbGlmZVZhbCgpKVxuICAgICAgICAgICAgQF91cGRhdGVEdXJhdGlvbigpXG4gICAgICAgIHRydWVcblxuICAgIGlzQWxpdmU6IC0+IHRydWVcblxubW9kdWxlLmV4cG9ydHMgPSBFbWl0dGVyXG4iLCIjIENyZWF0ZWQgYnkgeWFvY2h1bmh1aSBvbiAxNi8xLzQuXG5yYW5nZVZhbHVlID0gcmVxdWlyZSAnLi4vdXRpbHMvcmFuZ2VWYWx1ZSdcbmNvbG9yVXRpbHMgPSByZXF1aXJlICcuLi91dGlscy9jb2xvclV0aWxzJ1xuSW5pdGlhbGl6ZXIgPSB7fVxuXG5jbGFzcyBJbml0aWFsaXplci5yYWRpdXNcbiAgICBjb25zdHJ1Y3RvcjogKHN5c3RlbSwgcGFyYW1zKS0+XG4gICAgICAgIEByYWRpdXNWYWwgPSByYW5nZVZhbHVlIHBhcmFtcy5yYWRpdXNcbiAgICAgICAgQHNwZWVkVmFsID0gcmFuZ2VWYWx1ZSBwYXJhbXMuc3BlZWRcblxuICAgIGluaXRQYXJ0aWNsZTogKHApIC0+XG4gICAgICAgIG9yZ1ggPSBwLnggb3IgMFxuICAgICAgICBvcmdZID0gcC55IG9yIDBcbiAgICAgICAgdGhldGEgPSBNYXRoLnJhbmRvbSgpICogTWF0aC5QSSAqIDJcbiAgICAgICAgc2luVGhldGEgPSBNYXRoLnNpbiB0aGV0YVxuICAgICAgICBjb3NUaGV0YSA9IE1hdGguY29zIHRoZXRhXG4gICAgICAgIHJhZGl1cyA9IEByYWRpdXNWYWwoKVxuICAgICAgICBzcGVlZCA9IEBzcGVlZFZhbCgpXG4gICAgICAgIHAueCA9IGNvc1RoZXRhICogcmFkaXVzICsgb3JnWFxuICAgICAgICBwLnkgPSBzaW5UaGV0YSAqIHJhZGl1cyArIG9yZ1lcbiAgICAgICAgcC5keCA9IGNvc1RoZXRhICogc3BlZWRcbiAgICAgICAgcC5keSA9IHNpblRoZXRhICogc3BlZWRcblxuY2xhc3MgSW5pdGlhbGl6ZXIuYm94XG4gICAgY29uc3RydWN0b3I6IChzeXN0ZW0sIHBhcmFtcyktPlxuICAgICAgICBAeFZhbCA9IHJhbmdlVmFsdWUgcGFyYW1zLnhcbiAgICAgICAgQHlWYWwgPSByYW5nZVZhbHVlIHBhcmFtcy55XG5cbiAgICBpbml0UGFydGljbGU6IChwKSAtPlxuICAgICAgICBvcmdYID0gcC54IG9yIDBcbiAgICAgICAgb3JnWSA9IHAueSBvciAwXG4gICAgICAgIHggPSBAeFZhbCgpXG4gICAgICAgIHkgPSBAeVZhbCgpXG4gICAgICAgIHAueCA9IHggKyBvcmdYXG4gICAgICAgIHAueSA9IHkgKyBvcmdZXG5cbmNsYXNzIEluaXRpYWxpemVyLmRlbHRhX3NwZWVkXG4gICAgY29uc3RydWN0b3I6IChzeXN0ZW0sIHBhcmFtcyktPlxuICAgICAgICBAc3BlZWRYVmFsID0gcmFuZ2VWYWx1ZSBwYXJhbXMueFxuICAgICAgICBAc3BlZWRZVmFsID0gcmFuZ2VWYWx1ZSBwYXJhbXMueVxuICAgICAgICBAbXVsVmFsID0gcmFuZ2VWYWx1ZSAocGFyYW1zLm11bCA/IDEpXG5cbiAgICBpbml0UGFydGljbGU6IChwKSAtPlxuICAgICAgICBkeCA9IHAuZHggb3IgMFxuICAgICAgICBkeSA9IHAuZHkgb3IgMFxuICAgICAgICBtdWwgPSBAbXVsVmFsKClcbiAgICAgICAgcC5keCA9IChkeCArIEBzcGVlZFhWYWwoKSkgKiBtdWxcbiAgICAgICAgcC5keSA9IChkeSArIEBzcGVlZFlWYWwoKSkgKiBtdWxcblxuY2xhc3MgSW5pdGlhbGl6ZXIuZm9yY2VcbiAgICBjb25zdHJ1Y3RvcjogKHN5c3RlbSwgcGFyYW1zKS0+XG4gICAgICAgIEBmb3JjZVhWYWwgPSByYW5nZVZhbHVlIHBhcmFtcy54XG4gICAgICAgIEBmb3JjZVlWYWwgPSByYW5nZVZhbHVlIHBhcmFtcy55XG5cbiAgICBpbml0UGFydGljbGU6IChwKSAtPlxuICAgICAgICBwLmFjY3ggPSBAZm9yY2VYVmFsKClcbiAgICAgICAgcC5hY2N5ID0gQGZvcmNlWVZhbCgpXG5cbmNsYXNzIEluaXRpYWxpemVyLnJvdGF0aW9uXG4gICAgY29uc3RydWN0b3I6IChzeXN0ZW0sIHBhcmFtcyktPlxuICAgICAgICBAYW5nbGVWYWwgPSByYW5nZVZhbHVlIHBhcmFtcy5hbmdsZVxuXG4gICAgaW5pdFBhcnRpY2xlOiAocCkgLT5cbiAgICAgICAgcC5yb3RhdGlvbiA9IEBhbmdsZVZhbCgpXG5cbmNsYXNzIEluaXRpYWxpemVyLnNpemVcbiAgICBjb25zdHJ1Y3RvcjogKHN5c3RlbSwgcGFyYW1zKS0+XG4gICAgICAgIEBzaXplVmFsID0gcmFuZ2VWYWx1ZSBwYXJhbXMuc2l6ZVxuXG4gICAgaW5pdFBhcnRpY2xlOiAocCkgLT5cbiAgICAgICAgcC5zaXplID0gQHNpemVWYWwoKVxuXG5jbGFzcyBJbml0aWFsaXplci5jb2xvclxuICAgIGNvbnN0cnVjdG9yOiAoc3lzdGVtLCBwYXJhbXMpLT5cbiAgICAgICAgQGNvbG9yVmFsID0gY29sb3JVdGlscy5jb2xvclJhbmdlVmFsdWUocGFyYW1zLmNvbG9yKVxuXG4gICAgaW5pdFBhcnRpY2xlOiAocCkgLT5cbiAgICAgICAgcC5jb2xvciA9IEBjb2xvclZhbCgpXG5cbmNsYXNzIEluaXRpYWxpemVyLmF0dGFjaF9ub2RlX3Bvc1xuICAgIGNvbnN0cnVjdG9yOiAoQHN5c3RlbSwgcGFyYW1zKS0+XG4gICAgICAgIEBhdHRhY2hUb05vZGUgPSBwYXJhbXMubm9kZVxuXG4gICAgaW5pdFBhcnRpY2xlOiAocCkgLT5cbiAgICAgICAgZ2xvYmFsUG9zID0gQGF0dGFjaFRvTm9kZS5sb2NhbFRvR2xvYmFsKG5ldyBMUG9pbnQoQHN5c3RlbS54LCBAc3lzdGVtLnkpKVxuICAgICAgICBsb2NhbFBvcyA9IEBzeXN0ZW0uZ2xvYmFsVG9Mb2NhbChnbG9iYWxQb3MpXG4gICAgICAgIHAueCA9IGxvY2FsUG9zLnhcbiAgICAgICAgcC55ID0gbG9jYWxQb3MueVxuXG5tb2R1bGUuZXhwb3J0cyA9IEluaXRpYWxpemVyXG4iLCIjIENyZWF0ZWQgYnkgeWFvY2h1bmh1aSBvbiAxNi8xLzQuXG5BZmZlY3RvciAgICA9IHJlcXVpcmUgJy4vYWZmZWN0b3JzJ1xuRW1pdHRlciAgICAgPSByZXF1aXJlICcuL2VtaXR0ZXJzJ1xuUmVuZGVyZXIgICAgPSByZXF1aXJlICcuL3JlbmRlcmVycydcbkluaXRpYWxpemVyID0gcmVxdWlyZSAnLi9pbml0aWFsaXplcnMnXG5cbmNsYXNzIFBhcnRpY2xlU3lzdGVtXG4gICAgY29uc3RydWN0b3I6IChwYXJhbXMpLT5cbiAgICAgICAgTEV4dGVuZHMoQCwgTFNwcml0ZSwgW10pXG4gICAgICAgIEByZW1vdmVPbkZpbmlzaCA9IHRydWVcblxuICAgICAgICBAZW1pdHRlcnMgPSBAX2NyZWF0ZUNvbXBvbmVudHMoXCJlbWl0dGVyc1wiLCBFbWl0dGVyLCBwYXJhbXMpXG4gICAgICAgIEBpbml0aWFsaXplcnMgPSBAX2NyZWF0ZUNvbXBvbmVudHMoXCJpbml0aWFsaXplcnNcIiwgSW5pdGlhbGl6ZXIsIHBhcmFtcylcbiAgICAgICAgQGFmZmVjdG9ycyA9IEBfY3JlYXRlQ29tcG9uZW50cyhcImFmZmVjdG9yc1wiLCBBZmZlY3RvciwgcGFyYW1zKVxuICAgICAgICBAcmVuZGVyZXJzID0gQF9jcmVhdGVDb21wb25lbnRzKFwicmVuZGVyZXJzXCIsIFJlbmRlcmVyLCBwYXJhbXMpXG5cbiAgICAgICAgQHBhcnRpY2xlcyA9IFtdXG4gICAgICAgIEBncmFwaGljcy5hZGQgKGN0eCkgPT5cbiAgICAgICAgICAgIGN0eC5zYXZlKClcbiAgICAgICAgICAgIGlmIChAYmxlbmRNb2RlKVxuICAgICAgICAgICAgICAgIGN0eC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSBAYmxlbmRNb2RlXG4gICAgICAgICAgICBmb3IgcCBpbiBAcGFydGljbGVzIHdoZW4gcC5saWZlID4gMFxuICAgICAgICAgICAgICAgIGZvciByZW5kZXJlciBpbiBAcmVuZGVyZXJzXG4gICAgICAgICAgICAgICAgICAgIHJlbmRlcmVyLmRyYXdQYXJ0aWNsZShjdHgsIHApXG4gICAgICAgICAgICBjdHgucmVzdG9yZSgpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgY3VyVGltZSA9IERhdGUubm93KClcbiAgICAgICAgQGFkZEV2ZW50TGlzdGVuZXIoTEV2ZW50LkVOVEVSX0ZSQU1FLCA9PlxuICAgICAgICAgICAgbmV3VGltZSA9IERhdGUubm93KClcbiAgICAgICAgICAgIGRlbHRhVGltZSA9IG5ld1RpbWUgLSBjdXJUaW1lXG4gICAgICAgICAgICBjdXJUaW1lID0gbmV3VGltZVxuICAgICAgICAgICAgZGVsdGFUaW1lID0gTWF0aC5taW4oZGVsdGFUaW1lLCAxMDApXG4gICAgICAgICAgICBAdXBkYXRlKGRlbHRhVGltZSAvIDEwMDApXG4gICAgICAgICk7XG5cbiAgICBfY3JlYXRlQ29tcG9uZW50czogKGNvbXBUeXBlLCBjb21wQ29sbGVjdGlvbiwgcGFyYW1zT2JqKSAtPlxuICAgICAgICBwYXJhbXNMaXN0ID0gcGFyYW1zT2JqW2NvbXBUeXBlXVxuICAgICAgICByZXR1cm4gW10gdW5sZXNzIHBhcmFtc0xpc3QgYW5kIHBhcmFtc0xpc3QubGVuZ3RoID4gMFxuICAgICAgICBmb3IgcGFyYW1zIGluIHBhcmFtc0xpc3RcbiAgICAgICAgICAgIGNscyA9IGNvbXBDb2xsZWN0aW9uW3BhcmFtcy5uYW1lXVxuICAgICAgICAgICAgdW5sZXNzIHR5cGVvZiBjbHMgaXMgXCJmdW5jdGlvblwiXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvciBcIiN7Y29tcFR5cGV9LiN7cGFyYW1zLm5hbWV9IGlzIHVuZGVmaW5lZCFcIlxuICAgICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgICBuZXcgY2xzKEAsIHBhcmFtcylcblxuICAgIHNwYXduUGFydGljbGU6IChwID0ge30pLT5cbiAgICAgICAgZm9yIGluaXRpYWxpemVyIGluIEBpbml0aWFsaXplcnNcbiAgICAgICAgICAgIGluaXRpYWxpemVyLmluaXRQYXJ0aWNsZShwKVxuICAgICAgICBmb3IgYWZmZWN0b3IgaW4gQGFmZmVjdG9yc1xuICAgICAgICAgICAgYWZmZWN0b3IuaW5pdFBhcnRpY2xlPyhwKVxuICAgICAgICBmb3IgcmVuZGVyZXIgaW4gQHJlbmRlcmVyc1xuICAgICAgICAgICAgcmVuZGVyZXIuaW5pdFBhcnRpY2xlPyhwKVxuICAgICAgICBwLm1heExpZmUgPSBwLmxpZmVcbiAgICAgICAgQHBhcnRpY2xlcy5wdXNoIHBcbiAgICAgICAgcFxuXG4gICAgaXNBbGl2ZTogLT5cbiAgICAgICAgZm9yIGVtaXR0ZXIgaW4gQGVtaXR0ZXJzXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZSBpZiBlbWl0dGVyLmlzQWxpdmUoKVxuICAgICAgICBmb3IgcCBpbiBAcGFydGljbGVzXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZSBpZiBwLmxpZmUgPiAwXG4gICAgICAgIGZhbHNlXG5cbiAgICB1cGRhdGU6IChkdCkgLT5cbiAgICAgICAgaXNBbGl2ZSA9IGZhbHNlXG4gICAgICAgIGZvciBlbWl0dGVyIGluIEBlbWl0dGVycyB3aGVuIGVtaXR0ZXIuaXNBbGl2ZSgpXG4gICAgICAgICAgICBpc0FsaXZlID0gdHJ1ZVxuICAgICAgICAgICAgZW1pdHRlci51cGRhdGUoZHQpXG5cbiAgICAgICAgcHMgPSBAcGFydGljbGVzXG4gICAgICAgIGlmIHBzLmxlbmd0aCA+IDBcbiAgICAgICAgICAgIGFsaXZlUGFydGljbGVzID0gMFxuICAgICAgICAgICAgZm9yIHAgaW4gcHMgd2hlbiBwLmxpZmUgPiAwXG4gICAgICAgICAgICAgICAgYWxpdmVQYXJ0aWNsZXMrK1xuICAgICAgICAgICAgICAgIGlzQWxpdmUgPSB0cnVlXG4gICAgICAgICAgICAgICAgZm9yIGFmZmVjdG9yIGluIEBhZmZlY3RvcnNcbiAgICAgICAgICAgICAgICAgICAgYWZmZWN0b3IudXBkYXRlUGFydGljbGUoZHQsIHApXG4gICAgICAgICAgICAgICAgcC5saWZlIC09IGR0XG5cbiAgICAgICAgICAgIGlmIGFsaXZlUGFydGljbGVzID09IDBcbiAgICAgICAgICAgICAgICBwcy5sZW5ndGggPSAwXG4gICAgICAgICAgICBlbHNlIGlmIEBwYXJ0aWNsZXMubGVuZ3RoIC0gYWxpdmVQYXJ0aWNsZXMgPiAxMFxuICAgICAgICAgICAgICAgIEBwYXJ0aWNsZXMgPSBwcy5maWx0ZXIgKHApIC0+IHAubGlmZSA+IDBcblxuICAgICAgICBpZiBAcmVtb3ZlT25GaW5pc2ggYW5kIG5vdCBpc0FsaXZlXG4gICAgICAgICAgICBjb25zb2xlLmxvZyBcInJlbW92ZVwiXG4gICAgICAgICAgICBAcmVtb3ZlKClcbiAgICAgICAgcmV0dXJuXG5cbiAgICByZXNldDogLT5cbiAgICAgICAgZm9yIGVtaXR0ZXIgaW4gQGVtaXR0ZXJzXG4gICAgICAgICAgICBlbWl0dGVyLnJlc2V0PygpXG4gICAgICAgIEBwYXJ0aWNsZXMubGVuZ3RoID0gMFxuXG5tb2R1bGUuZXhwb3J0cyA9IFBhcnRpY2xlU3lzdGVtXG5cbiIsIiMgQ3JlYXRlZCBieSB5YW9jaHVuaHVpIG9uIDE2LzEvNC5cbmNvbG9yVXRpbHMgPSByZXF1aXJlICcuLi91dGlscy9jb2xvclV0aWxzJ1xuY29sb3JUb1N0eWxlID0gY29sb3JVdGlscy5jb2xvclRvU3R5bGVcblxuUmVuZGVyZXIgPSB7fVxuXG5jbGFzcyBSZW5kZXJlci5kb3RcbiAgICBjb25zdHJ1Y3RvcjogLT5cbiAgICBpbml0UGFydGljbGU6IChwKSAtPlxuICAgICAgICBwLnggPz0gMFxuICAgICAgICBwLnkgPz0gMFxuICAgICAgICBwLnNpemUgPz0gMVxuICAgICAgICBwLmNvbG9yID89IFsyNTUsIDAsIDBdXG5cbiAgICBkcmF3UGFydGljbGU6IChjdHgsIHApLT5cbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpXG4gICAgICAgIGN0eC5hcmMocC54LCBwLnksIHAuc2l6ZSwgMCwgMiAqIE1hdGguUEkpXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBjb2xvclRvU3R5bGUocC5jb2xvcilcbiAgICAgICAgY3R4LmZpbGwoKVxuXG5jbGFzcyBSZW5kZXJlci5ib3hcbiAgICBjb25zdHJ1Y3RvcjogLT5cbiAgICBpbml0UGFydGljbGU6IChwKSAtPlxuICAgICAgICBwLnggPz0gMFxuICAgICAgICBwLnkgPz0gMFxuICAgICAgICBwLnNpemUgPz0gMVxuICAgICAgICBwLmNvbG9yID89IFsyNTUsIDAsIDBdXG5cbiAgICBkcmF3UGFydGljbGU6IChjdHgsIHApLT5cbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpXG4gICAgICAgIHJvdCA9IHAucm90YXRpb25cbiAgICAgICAgc2l6ZSA9IHAuc2l6ZVxuXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBjb2xvclRvU3R5bGUocC5jb2xvcilcbiAgICAgICAgaWYgcm90XG4gICAgICAgICAgICBjdHguc2F2ZSgpXG4gICAgICAgICAgICBjdHgudHJhbnNsYXRlKHAueCwgcC55KVxuICAgICAgICAgICAgY3R4LnJvdGF0ZShyb3QpXG4gICAgICAgICAgICBjdHguZmlsbFJlY3QoLXNpemUsIC1zaXplLCBzaXplICogMiwgc2l6ZSAqIDIpXG4gICAgICAgICAgICBjdHgucmVzdG9yZSgpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGN0eC5maWxsUmVjdCgtc2l6ZSArIHAueCwgLXNpemUgKyBwLnksIHNpemUgKiAyLCBzaXplICogMilcblxuY2xhc3MgUmVuZGVyZXIuZG90X2ZhZGVcbiAgICBjb25zdHJ1Y3RvcjogLT5cbiAgICBpbml0UGFydGljbGU6IChwKSAtPlxuICAgICAgICBwLnggPz0gMFxuICAgICAgICBwLnkgPz0gMFxuICAgICAgICBwLnNpemUgPz0gMVxuICAgICAgICBwLmNvbG9yID89IFsxMDAsIDEwMCwgMTAwXVxuXG4gICAgZHJhd1BhcnRpY2xlOiAoY3R4LCBwKS0+XG4gICAgICAgIGN0eC5iZWdpblBhdGgoKVxuICAgICAgICByb3QgPSBwLnJvdGF0aW9uXG4gICAgICAgIHNpemUgPSBwLnNpemVcblxuICAgICAgICBjdHguc2F2ZSgpXG4gICAgICAgIHJhZCA9IGN0eC5jcmVhdGVSYWRpYWxHcmFkaWVudCgwLCAwLCAwLCAwLCAwLCBzaXplKTtcbiAgICAgICAgYSA9IHAuY29sb3JbM11cbiAgICAgICAgcmFkLmFkZENvbG9yU3RvcCgwLCBjb2xvclRvU3R5bGUocC5jb2xvcikpO1xuICAgICAgICBwLmNvbG9yWzNdID0gMFxuICAgICAgICByYWQuYWRkQ29sb3JTdG9wKDEsIGNvbG9yVG9TdHlsZShwLmNvbG9yKSk7XG4gICAgICAgIHAuY29sb3JbM10gPSBhXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSByYWRcbiAgICAgICAgY3R4LnRyYW5zbGF0ZShwLngsIHAueSlcbiAgICAgICAgaWYgcm90XG4gICAgICAgICAgICBjdHgucm90YXRlKHJvdClcblxuICAgICAgICBjdHguZmlsbFJlY3QoLXNpemUsIC1zaXplLCBzaXplICogMiwgc2l6ZSAqIDIpXG4gICAgICAgIGN0eC5yZXN0b3JlKClcblxuXG5jbGFzcyBSZW5kZXJlci5pbWFnZVxuICAgIGNvbnN0cnVjdG9yOiAoc3lzdGVtLCBwYXJhbXMpLT5cbiAgICAgICAgQGltYWdlID0gcGFyYW1zLmltYWdlXG5cbiAgICBpbml0UGFydGljbGU6IChwKSAtPlxuICAgICAgICBwLnggPz0gMFxuICAgICAgICBwLnkgPz0gMFxuICAgICAgICBwLnNpemUgPz0gMVxuICAgICAgICBwLmFscGhhID89IDFcblxuICAgIGRyYXdQYXJ0aWNsZTogKGN0eCwgcCktPlxuICAgICAgICByb3QgPSBwLnJvdGF0aW9uXG4gICAgICAgIHNpemUgPSBwLnNpemVcbiAgICAgICAgY3R4Lmdsb2JhbEFscGhhID0gcC5hbHBoYVxuICAgICAgICBpZiByb3RcbiAgICAgICAgICAgIGN0eC5zYXZlKClcbiAgICAgICAgICAgIGN0eC50cmFuc2xhdGUocC54LCBwLnkpXG4gICAgICAgICAgICBjdHgucm90YXRlKHJvdClcbiAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoQGltYWdlLCAwLCAwLCBAaW1hZ2Uud2lkdGgsIEBpbWFnZS5oZWlnaHQsXG4gICAgICAgICAgICAgICAgLXNpemUsIC1zaXplLCBzaXplICogMiwgc2l6ZSAqIDIpXG4gICAgICAgICAgICBjdHgucmVzdG9yZSgpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoQGltYWdlLCAwLCAwLCBAaW1hZ2Uud2lkdGgsIEBpbWFnZS5oZWlnaHQsXG4gICAgICAgICAgICAgICAgcC54LXNpemUsIHAueS1zaXplLCBzaXplICogMiwgc2l6ZSAqIDIpXG5cbm1vZHVsZS5leHBvcnRzID0gUmVuZGVyZXJcbiIsIiMgQ3JlYXRlZCBieSB5YW9jaHVuaHVpIG9uIDE2LzEvNi5cbnJhbmdlVmFsdWUgPSByZXF1aXJlICcuL3JhbmdlVmFsdWUnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgICBjb2xvclJhbmdlVmFsdWU6IChjb2xvcikgLT5cbiAgICAgICAgciA9IHJhbmdlVmFsdWUgY29sb3JbMF1cbiAgICAgICAgZyA9IHJhbmdlVmFsdWUgY29sb3JbMV1cbiAgICAgICAgYiA9IHJhbmdlVmFsdWUgY29sb3JbMl1cbiAgICAgICAgYSA9IHJhbmdlVmFsdWUgY29sb3JbM11cblxuICAgICAgICAtPiBbcigpLCBnKCksIGIoKSwgYSgpXVxuXG4gICAgY29sb3JUb1N0eWxlOiAoY29sb3IpIC0+XG4gICAgICAgIHIgPSB+fmNvbG9yWzBdXG4gICAgICAgIGcgPSB+fmNvbG9yWzFdXG4gICAgICAgIGIgPSB+fmNvbG9yWzJdXG4gICAgICAgIGEgPSBjb2xvclszXVxuICAgICAgICBpZiBhP1xuICAgICAgICAgICAgXCJyZ2JhKCN7cn0sI3tnfSwje2J9LCN7YX0pXCJcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgXCJyZ2IoI3tyfSwje2d9LCN7Yn0pXCIiLCIjIENyZWF0ZWQgYnkgeWFvY2h1bmh1aSBvbiAxNi8xLzUuXG5cbm1vZHVsZS5leHBvcnRzID0gKHZhbCkgLT5cbiAgICBpZiB2YWwubGVuZ3RoID4gMVxuICAgICAgICAtPiAodmFsWzFdIC0gdmFsWzBdKSAqIE1hdGgucmFuZG9tKCkgKyB2YWxbMF1cbiAgICBlbHNlXG4gICAgICAgIC0+IHZhbFxuIl19
