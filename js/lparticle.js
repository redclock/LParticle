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

if (typeof define === 'function' && define.amd) {
  define(function() {
    return LParticle;
  });
} else if (typeof module === 'object' && module.exports) {
  module.exports = LParticle;
}

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

Initializer.position = (function() {
  function position(system, params) {
    this.xVal = rangeValue(params.x);
    this.yVal = rangeValue(params.y);
  }

  position.prototype.initParticle = function(p) {
    var orgX, orgY, x, y;
    orgX = p.x || 0;
    orgY = p.y || 0;
    x = this.xVal();
    y = this.yVal();
    p.x = x + orgX;
    return p.y = y + orgY;
  };

  return position;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9jb2ZmZWUvbGliLmNvZmZlZSIsIi4uL2NvZmZlZS9wYXJ0aWNsZS9hZmZlY3RvcnMuY29mZmVlIiwiLi4vY29mZmVlL3BhcnRpY2xlL2VtaXR0ZXJzLmNvZmZlZSIsIi4uL2NvZmZlZS9wYXJ0aWNsZS9pbml0aWFsaXplcnMuY29mZmVlIiwiLi4vY29mZmVlL3BhcnRpY2xlL3BhcnRpY2xlU3lzdGVtLmNvZmZlZSIsIi4uL2NvZmZlZS9wYXJ0aWNsZS9yZW5kZXJlcnMuY29mZmVlIiwiLi4vY29mZmVlL3V0aWxzL2NvbG9yVXRpbHMuY29mZmVlIiwiLi4vY29mZmVlL3V0aWxzL3JhbmdlVmFsdWUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0NBLElBQUE7O0FBQUEsU0FBQSxHQUFZOztBQUNaLFNBQVMsQ0FBQyxjQUFWLEdBQThCLE9BQUEsQ0FBUSwyQkFBUjs7QUFDOUIsU0FBUyxDQUFDLE9BQVYsR0FBOEIsT0FBQSxDQUFRLHFCQUFSOztBQUM5QixTQUFTLENBQUMsV0FBVixHQUE4QixPQUFBLENBQVEseUJBQVI7O0FBQzlCLFNBQVMsQ0FBQyxRQUFWLEdBQThCLE9BQUEsQ0FBUSxzQkFBUjs7QUFDOUIsU0FBUyxDQUFDLFFBQVYsR0FBOEIsT0FBQSxDQUFRLHNCQUFSOztBQUM5QixTQUFTLENBQUMsVUFBVixHQUE4QixPQUFBLENBQVEsb0JBQVI7O0FBRzlCLElBQUcsT0FBTyxNQUFQLEtBQWlCLFVBQWpCLElBQWdDLE1BQU0sQ0FBQyxHQUExQztFQUNJLE1BQUEsQ0FBTyxTQUFBO1dBQUc7RUFBSCxDQUFQLEVBREo7Q0FBQSxNQUVLLElBQUcsT0FBTyxNQUFQLEtBQWlCLFFBQWpCLElBQThCLE1BQU0sQ0FBQyxPQUF4QztFQUNELE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFVBRGhCOzs7QUFHTCxNQUFN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SUFDWixDQUFBLEdBQUksQ0FBQyxDQUFDLEtBQU0sQ0FBQSxDQUFBO0lBQ1osQ0FBQSxHQUFJLEtBQU0sQ0FBQSxDQUFBO0lBQ1YsSUFBRyxTQUFIO2FBQ0ksT0FBQSxHQUFRLENBQVIsR0FBVSxHQUFWLEdBQWEsQ0FBYixHQUFlLEdBQWYsR0FBa0IsQ0FBbEIsR0FBb0IsR0FBcEIsR0FBdUIsQ0FBdkIsR0FBeUIsSUFEN0I7S0FBQSxNQUFBO2FBR0ksTUFBQSxHQUFPLENBQVAsR0FBUyxHQUFULEdBQVksQ0FBWixHQUFjLEdBQWQsR0FBaUIsQ0FBakIsR0FBbUIsSUFIdkI7O0VBTFUsQ0FSZDs7Ozs7QUNGSixNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLEdBQUQ7RUFDYixJQUFHLEdBQUcsQ0FBQyxNQUFKLEdBQWEsQ0FBaEI7V0FDSSxTQUFBO2FBQUcsQ0FBQyxHQUFJLENBQUEsQ0FBQSxDQUFKLEdBQVMsR0FBSSxDQUFBLENBQUEsQ0FBZCxDQUFBLEdBQW9CLElBQUksQ0FBQyxNQUFMLENBQUEsQ0FBcEIsR0FBb0MsR0FBSSxDQUFBLENBQUE7SUFBM0MsRUFESjtHQUFBLE1BQUE7V0FHSSxTQUFBO2FBQUc7SUFBSCxFQUhKOztBQURhIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIiMgQ3JlYXRlZCBieSB5YW9jaHVuaHVpIG9uIDE2LzEvMjcuXG5MUGFydGljbGUgPSB7fVxuTFBhcnRpY2xlLlBhcnRpY2xlU3lzdGVtICAgID0gcmVxdWlyZSAnLi9wYXJ0aWNsZS9wYXJ0aWNsZVN5c3RlbSdcbkxQYXJ0aWNsZS5FbWl0dGVyICAgICAgICAgICA9IHJlcXVpcmUgJy4vcGFydGljbGUvZW1pdHRlcnMnXG5MUGFydGljbGUuSW5pdGlhbGl6ZXIgICAgICAgPSByZXF1aXJlICcuL3BhcnRpY2xlL2luaXRpYWxpemVycydcbkxQYXJ0aWNsZS5BZmZlY3RvciAgICAgICAgICA9IHJlcXVpcmUgJy4vcGFydGljbGUvYWZmZWN0b3JzJ1xuTFBhcnRpY2xlLlJlbmRlcmVyICAgICAgICAgID0gcmVxdWlyZSAnLi9wYXJ0aWNsZS9yZW5kZXJlcnMnXG5MUGFydGljbGUuY29sb3JVdGlscyAgICAgICAgPSByZXF1aXJlICcuL3V0aWxzL2NvbG9yVXRpbHMnXG5cbiMgRXhwb3NlIHRoZSBjbGFzcyBlaXRoZXIgdmlhIEFNRCwgQ29tbW9uSlMgb3IgdGhlIGdsb2JhbCBvYmplY3RcbmlmIHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyBhbmQgZGVmaW5lLmFtZFxuICAgIGRlZmluZSAtPiBMUGFydGljbGVcbmVsc2UgaWYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyBhbmQgbW9kdWxlLmV4cG9ydHNcbiAgICBtb2R1bGUuZXhwb3J0cyA9IExQYXJ0aWNsZVxuXG5nbG9iYWwuTFBhcnRpY2xlID0gTFBhcnRpY2xlXG5cbiIsIiMgQ3JlYXRlZCBieSB5YW9jaHVuaHVpIG9uIDE2LzEvNC5cbnJhbmdlVmFsdWUgPSByZXF1aXJlICcuLi91dGlscy9yYW5nZVZhbHVlJ1xuY29sb3JVdGlscyA9IHJlcXVpcmUgJy4uL3V0aWxzL2NvbG9yVXRpbHMnXG5cbkFmZmVjdG9yID0ge31cblxuY2xhc3MgQWZmZWN0b3IubW92ZVxuICAgIGNvbnN0cnVjdG9yOiAtPlxuICAgIGluaXRQYXJ0aWNsZTogKHApIC0+XG4gICAgICAgIHAueCA9IHAueCBvciAwXG4gICAgICAgIHAueSA9IHAueSBvciAwXG4gICAgICAgIGlmIHAuYWNjeFxuICAgICAgICAgICAgcC5keCA9IHAuZHggb3IgMFxuICAgICAgICBpZiBwLmFjY3lcbiAgICAgICAgICAgIHAuZHkgPSBwLmR5IG9yIDBcbiAgICAgICAgcmV0dXJuXG5cbiAgICB1cGRhdGVQYXJ0aWNsZTogKGR0LCBwKSAtPlxuICAgICAgICBpZiBwLmR4XG4gICAgICAgICAgICBwLnggKz0gcC5keCAqIGR0XG4gICAgICAgIGlmIHAuZHlcbiAgICAgICAgICAgIHAueSArPSBwLmR5ICogZHRcbiAgICAgICAgaWYgcC5hY2N4XG4gICAgICAgICAgICBwLmR4ICs9IHAuYWNjeCAqIGR0XG4gICAgICAgIGlmIHAuYWNjeVxuICAgICAgICAgICAgcC5keSArPSBwLmFjY3kgKiBkdFxuICAgICAgICByZXR1cm5cblxuY2xhc3MgQWZmZWN0b3Iuc2l6ZVxuICAgIGNvbnN0cnVjdG9yOiAoc3lzdGVtLCBwYXJhbXMpIC0+XG4gICAgICAgIEBmcm9tU2l6ZVZhbCA9IHJhbmdlVmFsdWUgcGFyYW1zLmZyb21cbiAgICAgICAgQHRvU2l6ZVZhbCA9IHJhbmdlVmFsdWUgcGFyYW1zLnRvXG5cbiAgICBpbml0UGFydGljbGU6IChwKSAtPlxuICAgICAgICBwLnNpemVGcm9tID0gQGZyb21TaXplVmFsKClcbiAgICAgICAgcC5zaXplVG8gPSBAdG9TaXplVmFsKClcbiAgICAgICAgcC5zaXplID0gcC5zaXplRnJvbVxuXG4gICAgdXBkYXRlUGFydGljbGU6IChkdCwgcCkgLT5cbiAgICAgICAgdCA9IHAubGlmZSAvIHAubWF4TGlmZVxuICAgICAgICBwLnNpemUgPSBwLnNpemVGcm9tICogdCArIHAuc2l6ZVRvICogKDEgLSB0KVxuXG5jbGFzcyBBZmZlY3Rvci5jb2xvclxuICAgIGNvbnN0cnVjdG9yOiAoc3lzdGVtLCBwYXJhbXMpIC0+XG4gICAgICAgIEBmcm9tQ29sb3JWYWwgPSBjb2xvclV0aWxzLmNvbG9yUmFuZ2VWYWx1ZSBwYXJhbXMuZnJvbVxuICAgICAgICBAdG9Db2xvclZhbCA9IGNvbG9yVXRpbHMuY29sb3JSYW5nZVZhbHVlIHBhcmFtcy50b1xuXG4gICAgaW5pdFBhcnRpY2xlOiAocCkgLT5cbiAgICAgICAgcC5jb2xvckZyb20gPSBAZnJvbUNvbG9yVmFsKClcbiAgICAgICAgcC5jb2xvclRvID0gQHRvQ29sb3JWYWwoKVxuICAgICAgICBwLmNvbG9yID0gcC5jb2xvckZyb20uc2xpY2UoKVxuXG4gICAgdXBkYXRlUGFydGljbGU6IChkdCwgcCkgLT5cbiAgICAgICAgdCA9IHAubGlmZSAvIHAubWF4TGlmZVxuICAgICAgICBwLmNvbG9yWzBdID0gcC5jb2xvckZyb21bMF0gKiB0ICsgcC5jb2xvclRvWzBdICogKDEgLSB0KVxuICAgICAgICBwLmNvbG9yWzFdID0gcC5jb2xvckZyb21bMV0gKiB0ICsgcC5jb2xvclRvWzFdICogKDEgLSB0KVxuICAgICAgICBwLmNvbG9yWzJdID0gcC5jb2xvckZyb21bMl0gKiB0ICsgcC5jb2xvclRvWzJdICogKDEgLSB0KVxuICAgICAgICBwLmNvbG9yWzNdID0gcC5jb2xvckZyb21bM10gKiB0ICsgcC5jb2xvclRvWzNdICogKDEgLSB0KVxuXG5jbGFzcyBBZmZlY3Rvci5hbHBoYVxuICAgIGNvbnN0cnVjdG9yOiAoc3lzdGVtLCBwYXJhbXMpIC0+XG4gICAgICAgIEBmcm9tQWxwaGFWYWwgPSByYW5nZVZhbHVlIHBhcmFtcy5mcm9tXG4gICAgICAgIEB0b0FscGhhVmFsID0gcmFuZ2VWYWx1ZSBwYXJhbXMudG9cblxuICAgIGluaXRQYXJ0aWNsZTogKHApIC0+XG4gICAgICAgIHAuYWxwaGFGcm9tID0gQGZyb21BbHBoYVZhbCgpXG4gICAgICAgIHAuYWxwaGFUbyA9IEB0b0FscGhhVmFsKClcbiAgICAgICAgcC5hbHBoYSA9IHAuYWxwaGFGcm9tXG5cbiAgICB1cGRhdGVQYXJ0aWNsZTogKGR0LCBwKSAtPlxuICAgICAgICB0ID0gcC5saWZlIC8gcC5tYXhMaWZlXG4gICAgICAgIHAuYWxwaGEgPSBwLmFscGhhRnJvbSAqIHQgKyBwLmFscGhhVG8gKiAoMSAtIHQpXG5cbmNsYXNzIEFmZmVjdG9yLnJvdGF0aW9uXG4gICAgY29uc3RydWN0b3I6IChzeXN0ZW0sIHBhcmFtcykgLT5cbiAgICAgICAgQGZyb21BbmdsZVZhbCA9IHJhbmdlVmFsdWUgcGFyYW1zLmZyb21cbiAgICAgICAgQHRvQW5nbGVWYWwgPSByYW5nZVZhbHVlIHBhcmFtcy50b1xuXG4gICAgaW5pdFBhcnRpY2xlOiAocCkgLT5cbiAgICAgICAgcC5hbmdsZUZyb20gPSBAZnJvbUFuZ2xlVmFsKClcbiAgICAgICAgcC5hbmdsZVRvID0gQHRvQW5nbGVWYWwoKVxuICAgICAgICBwLmFuZ2xlID0gcC5hbmdsZUZyb21cblxuICAgIHVwZGF0ZVBhcnRpY2xlOiAoZHQsIHApIC0+XG4gICAgICAgIHQgPSBwLmxpZmUgLyBwLm1heExpZmVcbiAgICAgICAgcC5yb3RhdGlvbiA9IHAuYW5nbGVGcm9tICogdCArIHAuYW5nbGVUbyAqICgxIC0gdClcbm1vZHVsZS5leHBvcnRzID0gQWZmZWN0b3JcbiIsIiMgQ3JlYXRlZCBieSB5YW9jaHVuaHVpIG9uIDE2LzEvNC5cbnJhbmdlVmFsdWUgPSByZXF1aXJlICcuLi91dGlscy9yYW5nZVZhbHVlJ1xuRW1pdHRlciA9IHt9XG5cbmNsYXNzIEVtaXR0ZXIub25jZVxuICAgIGNvbnN0cnVjdG9yOiAoQHN5c3RlbSwgcGFyYW1zKS0+XG4gICAgICAgIEBjb3VudCA9IHJhbmdlVmFsdWUocGFyYW1zLmNvdW50KSgpXG4gICAgICAgIEBsaWZlVmFsID0gcmFuZ2VWYWx1ZSBwYXJhbXMubGlmZVxuICAgICAgICBAZW1pdHRlZCA9IGZhbHNlXG5cbiAgICB1cGRhdGU6IC0+XG4gICAgICAgIHVubGVzcyBAZW1pdHRlZFxuICAgICAgICAgICAgZm9yIGkgaW4gWzEuLkBjb3VudF1cbiAgICAgICAgICAgICAgICBAc3lzdGVtLnNwYXduUGFydGljbGUobGlmZTogQGxpZmVWYWwoKSlcbiAgICAgICAgICAgIEBlbWl0dGVkID0gdHJ1ZVxuXG4gICAgICAgIHRydWVcblxuICAgIGlzQWxpdmU6IC0+ICFAZW1pdHRlZFxuXG5jbGFzcyBFbWl0dGVyLmluZmluaXRlXG4gICAgY29uc3RydWN0b3I6IChAc3lzdGVtLCBwYXJhbXMpLT5cbiAgICAgICAgQHJhdGVWYWwgPSByYW5nZVZhbHVlIHBhcmFtcy5yYXRlXG4gICAgICAgIEBsaWZlVmFsID0gcmFuZ2VWYWx1ZSBwYXJhbXMubGlmZVxuICAgICAgICBAZW1pdHRlZCA9IGZhbHNlXG4gICAgICAgIEB0aW1lciA9IDBcbiAgICAgICAgQF91cGRhdGVEdXJhdGlvbigpXG5cbiAgICBfdXBkYXRlRHVyYXRpb246IC0+XG4gICAgICAgIHJhdGUgPSBAcmF0ZVZhbCgpXG4gICAgICAgIGlmIHJhdGUgPiAwLjAwMVxuICAgICAgICAgICAgQGR1cmF0aW9uID0gMSAvIHJhdGVcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQGR1cmF0aW9uID0gMTBlMTBcblxuICAgIHVwZGF0ZTogKGR0KS0+XG4gICAgICAgIEB0aW1lciArPSBkdFxuICAgICAgICB3aGlsZSBAdGltZXIgPiBAZHVyYXRpb25cbiAgICAgICAgICAgIEB0aW1lciAtPSBAZHVyYXRpb25cbiAgICAgICAgICAgIEBzeXN0ZW0uc3Bhd25QYXJ0aWNsZShsaWZlOiBAbGlmZVZhbCgpKVxuICAgICAgICAgICAgQF91cGRhdGVEdXJhdGlvbigpXG4gICAgICAgIHRydWVcblxuICAgIGlzQWxpdmU6IC0+IHRydWVcblxubW9kdWxlLmV4cG9ydHMgPSBFbWl0dGVyXG4iLCIjIENyZWF0ZWQgYnkgeWFvY2h1bmh1aSBvbiAxNi8xLzQuXG5yYW5nZVZhbHVlID0gcmVxdWlyZSAnLi4vdXRpbHMvcmFuZ2VWYWx1ZSdcbmNvbG9yVXRpbHMgPSByZXF1aXJlICcuLi91dGlscy9jb2xvclV0aWxzJ1xuSW5pdGlhbGl6ZXIgPSB7fVxuXG5jbGFzcyBJbml0aWFsaXplci5yYWRpdXNcbiAgICBjb25zdHJ1Y3RvcjogKHN5c3RlbSwgcGFyYW1zKS0+XG4gICAgICAgIEByYWRpdXNWYWwgPSByYW5nZVZhbHVlIHBhcmFtcy5yYWRpdXNcbiAgICAgICAgQHNwZWVkVmFsID0gcmFuZ2VWYWx1ZSBwYXJhbXMuc3BlZWRcblxuICAgIGluaXRQYXJ0aWNsZTogKHApIC0+XG4gICAgICAgIG9yZ1ggPSBwLnggb3IgMFxuICAgICAgICBvcmdZID0gcC55IG9yIDBcbiAgICAgICAgdGhldGEgPSBNYXRoLnJhbmRvbSgpICogTWF0aC5QSSAqIDJcbiAgICAgICAgc2luVGhldGEgPSBNYXRoLnNpbiB0aGV0YVxuICAgICAgICBjb3NUaGV0YSA9IE1hdGguY29zIHRoZXRhXG4gICAgICAgIHJhZGl1cyA9IEByYWRpdXNWYWwoKVxuICAgICAgICBzcGVlZCA9IEBzcGVlZFZhbCgpXG4gICAgICAgIHAueCA9IGNvc1RoZXRhICogcmFkaXVzICsgb3JnWFxuICAgICAgICBwLnkgPSBzaW5UaGV0YSAqIHJhZGl1cyArIG9yZ1lcbiAgICAgICAgcC5keCA9IGNvc1RoZXRhICogc3BlZWRcbiAgICAgICAgcC5keSA9IHNpblRoZXRhICogc3BlZWRcblxuY2xhc3MgSW5pdGlhbGl6ZXIucG9zaXRpb25cbiAgICBjb25zdHJ1Y3RvcjogKHN5c3RlbSwgcGFyYW1zKS0+XG4gICAgICAgIEB4VmFsID0gcmFuZ2VWYWx1ZSBwYXJhbXMueFxuICAgICAgICBAeVZhbCA9IHJhbmdlVmFsdWUgcGFyYW1zLnlcblxuICAgIGluaXRQYXJ0aWNsZTogKHApIC0+XG4gICAgICAgIG9yZ1ggPSBwLnggb3IgMFxuICAgICAgICBvcmdZID0gcC55IG9yIDBcbiAgICAgICAgeCA9IEB4VmFsKClcbiAgICAgICAgeSA9IEB5VmFsKClcbiAgICAgICAgcC54ID0geCArIG9yZ1hcbiAgICAgICAgcC55ID0geSArIG9yZ1lcblxuY2xhc3MgSW5pdGlhbGl6ZXIuZGVsdGFfc3BlZWRcbiAgICBjb25zdHJ1Y3RvcjogKHN5c3RlbSwgcGFyYW1zKS0+XG4gICAgICAgIEBzcGVlZFhWYWwgPSByYW5nZVZhbHVlIHBhcmFtcy54XG4gICAgICAgIEBzcGVlZFlWYWwgPSByYW5nZVZhbHVlIHBhcmFtcy55XG4gICAgICAgIEBtdWxWYWwgPSByYW5nZVZhbHVlIChwYXJhbXMubXVsID8gMSlcblxuICAgIGluaXRQYXJ0aWNsZTogKHApIC0+XG4gICAgICAgIGR4ID0gcC5keCBvciAwXG4gICAgICAgIGR5ID0gcC5keSBvciAwXG4gICAgICAgIG11bCA9IEBtdWxWYWwoKVxuICAgICAgICBwLmR4ID0gKGR4ICsgQHNwZWVkWFZhbCgpKSAqIG11bFxuICAgICAgICBwLmR5ID0gKGR5ICsgQHNwZWVkWVZhbCgpKSAqIG11bFxuXG5jbGFzcyBJbml0aWFsaXplci5mb3JjZVxuICAgIGNvbnN0cnVjdG9yOiAoc3lzdGVtLCBwYXJhbXMpLT5cbiAgICAgICAgQGZvcmNlWFZhbCA9IHJhbmdlVmFsdWUgcGFyYW1zLnhcbiAgICAgICAgQGZvcmNlWVZhbCA9IHJhbmdlVmFsdWUgcGFyYW1zLnlcblxuICAgIGluaXRQYXJ0aWNsZTogKHApIC0+XG4gICAgICAgIHAuYWNjeCA9IEBmb3JjZVhWYWwoKVxuICAgICAgICBwLmFjY3kgPSBAZm9yY2VZVmFsKClcblxuY2xhc3MgSW5pdGlhbGl6ZXIucm90YXRpb25cbiAgICBjb25zdHJ1Y3RvcjogKHN5c3RlbSwgcGFyYW1zKS0+XG4gICAgICAgIEBhbmdsZVZhbCA9IHJhbmdlVmFsdWUgcGFyYW1zLmFuZ2xlXG5cbiAgICBpbml0UGFydGljbGU6IChwKSAtPlxuICAgICAgICBwLnJvdGF0aW9uID0gQGFuZ2xlVmFsKClcblxuY2xhc3MgSW5pdGlhbGl6ZXIuc2l6ZVxuICAgIGNvbnN0cnVjdG9yOiAoc3lzdGVtLCBwYXJhbXMpLT5cbiAgICAgICAgQHNpemVWYWwgPSByYW5nZVZhbHVlIHBhcmFtcy5zaXplXG5cbiAgICBpbml0UGFydGljbGU6IChwKSAtPlxuICAgICAgICBwLnNpemUgPSBAc2l6ZVZhbCgpXG5cbmNsYXNzIEluaXRpYWxpemVyLmNvbG9yXG4gICAgY29uc3RydWN0b3I6IChzeXN0ZW0sIHBhcmFtcyktPlxuICAgICAgICBAY29sb3JWYWwgPSBjb2xvclV0aWxzLmNvbG9yUmFuZ2VWYWx1ZShwYXJhbXMuY29sb3IpXG5cbiAgICBpbml0UGFydGljbGU6IChwKSAtPlxuICAgICAgICBwLmNvbG9yID0gQGNvbG9yVmFsKClcblxuY2xhc3MgSW5pdGlhbGl6ZXIuYXR0YWNoX25vZGVfcG9zXG4gICAgY29uc3RydWN0b3I6IChAc3lzdGVtLCBwYXJhbXMpLT5cbiAgICAgICAgQGF0dGFjaFRvTm9kZSA9IHBhcmFtcy5ub2RlXG5cbiAgICBpbml0UGFydGljbGU6IChwKSAtPlxuICAgICAgICBnbG9iYWxQb3MgPSBAYXR0YWNoVG9Ob2RlLmxvY2FsVG9HbG9iYWwobmV3IExQb2ludChAc3lzdGVtLngsIEBzeXN0ZW0ueSkpXG4gICAgICAgIGxvY2FsUG9zID0gQHN5c3RlbS5nbG9iYWxUb0xvY2FsKGdsb2JhbFBvcylcbiAgICAgICAgcC54ID0gbG9jYWxQb3MueFxuICAgICAgICBwLnkgPSBsb2NhbFBvcy55XG5cbm1vZHVsZS5leHBvcnRzID0gSW5pdGlhbGl6ZXJcbiIsIiMgQ3JlYXRlZCBieSB5YW9jaHVuaHVpIG9uIDE2LzEvNC5cbkFmZmVjdG9yICAgID0gcmVxdWlyZSAnLi9hZmZlY3RvcnMnXG5FbWl0dGVyICAgICA9IHJlcXVpcmUgJy4vZW1pdHRlcnMnXG5SZW5kZXJlciAgICA9IHJlcXVpcmUgJy4vcmVuZGVyZXJzJ1xuSW5pdGlhbGl6ZXIgPSByZXF1aXJlICcuL2luaXRpYWxpemVycydcblxuY2xhc3MgUGFydGljbGVTeXN0ZW1cbiAgICBjb25zdHJ1Y3RvcjogKHBhcmFtcyktPlxuICAgICAgICBMRXh0ZW5kcyhALCBMU3ByaXRlLCBbXSlcbiAgICAgICAgQHJlbW92ZU9uRmluaXNoID0gdHJ1ZVxuXG4gICAgICAgIEBlbWl0dGVycyA9IEBfY3JlYXRlQ29tcG9uZW50cyhcImVtaXR0ZXJzXCIsIEVtaXR0ZXIsIHBhcmFtcylcbiAgICAgICAgQGluaXRpYWxpemVycyA9IEBfY3JlYXRlQ29tcG9uZW50cyhcImluaXRpYWxpemVyc1wiLCBJbml0aWFsaXplciwgcGFyYW1zKVxuICAgICAgICBAYWZmZWN0b3JzID0gQF9jcmVhdGVDb21wb25lbnRzKFwiYWZmZWN0b3JzXCIsIEFmZmVjdG9yLCBwYXJhbXMpXG4gICAgICAgIEByZW5kZXJlcnMgPSBAX2NyZWF0ZUNvbXBvbmVudHMoXCJyZW5kZXJlcnNcIiwgUmVuZGVyZXIsIHBhcmFtcylcblxuICAgICAgICBAcGFydGljbGVzID0gW11cbiAgICAgICAgQGdyYXBoaWNzLmFkZCAoY3R4KSA9PlxuICAgICAgICAgICAgY3R4LnNhdmUoKVxuICAgICAgICAgICAgaWYgKEBibGVuZE1vZGUpXG4gICAgICAgICAgICAgICAgY3R4Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9IEBibGVuZE1vZGVcbiAgICAgICAgICAgIGZvciBwIGluIEBwYXJ0aWNsZXMgd2hlbiBwLmxpZmUgPiAwXG4gICAgICAgICAgICAgICAgZm9yIHJlbmRlcmVyIGluIEByZW5kZXJlcnNcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyZXIuZHJhd1BhcnRpY2xlKGN0eCwgcClcbiAgICAgICAgICAgIGN0eC5yZXN0b3JlKClcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICBjdXJUaW1lID0gRGF0ZS5ub3coKVxuICAgICAgICBAYWRkRXZlbnRMaXN0ZW5lcihMRXZlbnQuRU5URVJfRlJBTUUsID0+XG4gICAgICAgICAgICBuZXdUaW1lID0gRGF0ZS5ub3coKVxuICAgICAgICAgICAgZGVsdGFUaW1lID0gbmV3VGltZSAtIGN1clRpbWVcbiAgICAgICAgICAgIGN1clRpbWUgPSBuZXdUaW1lXG4gICAgICAgICAgICBkZWx0YVRpbWUgPSBNYXRoLm1pbihkZWx0YVRpbWUsIDEwMClcbiAgICAgICAgICAgIEB1cGRhdGUoZGVsdGFUaW1lIC8gMTAwMClcbiAgICAgICAgKTtcblxuICAgIF9jcmVhdGVDb21wb25lbnRzOiAoY29tcFR5cGUsIGNvbXBDb2xsZWN0aW9uLCBwYXJhbXNPYmopIC0+XG4gICAgICAgIHBhcmFtc0xpc3QgPSBwYXJhbXNPYmpbY29tcFR5cGVdXG4gICAgICAgIHJldHVybiBbXSB1bmxlc3MgcGFyYW1zTGlzdCBhbmQgcGFyYW1zTGlzdC5sZW5ndGggPiAwXG4gICAgICAgIGZvciBwYXJhbXMgaW4gcGFyYW1zTGlzdFxuICAgICAgICAgICAgY2xzID0gY29tcENvbGxlY3Rpb25bcGFyYW1zLm5hbWVdXG4gICAgICAgICAgICB1bmxlc3MgdHlwZW9mIGNscyBpcyBcImZ1bmN0aW9uXCJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yIFwiI3tjb21wVHlwZX0uI3twYXJhbXMubmFtZX0gaXMgdW5kZWZpbmVkIVwiXG4gICAgICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICAgIG5ldyBjbHMoQCwgcGFyYW1zKVxuXG4gICAgc3Bhd25QYXJ0aWNsZTogKHAgPSB7fSktPlxuICAgICAgICBmb3IgaW5pdGlhbGl6ZXIgaW4gQGluaXRpYWxpemVyc1xuICAgICAgICAgICAgaW5pdGlhbGl6ZXIuaW5pdFBhcnRpY2xlKHApXG4gICAgICAgIGZvciBhZmZlY3RvciBpbiBAYWZmZWN0b3JzXG4gICAgICAgICAgICBhZmZlY3Rvci5pbml0UGFydGljbGU/KHApXG4gICAgICAgIGZvciByZW5kZXJlciBpbiBAcmVuZGVyZXJzXG4gICAgICAgICAgICByZW5kZXJlci5pbml0UGFydGljbGU/KHApXG4gICAgICAgIHAubWF4TGlmZSA9IHAubGlmZVxuICAgICAgICBAcGFydGljbGVzLnB1c2ggcFxuICAgICAgICBwXG5cbiAgICBpc0FsaXZlOiAtPlxuICAgICAgICBmb3IgZW1pdHRlciBpbiBAZW1pdHRlcnNcbiAgICAgICAgICAgIHJldHVybiB0cnVlIGlmIGVtaXR0ZXIuaXNBbGl2ZSgpXG4gICAgICAgIGZvciBwIGluIEBwYXJ0aWNsZXNcbiAgICAgICAgICAgIHJldHVybiB0cnVlIGlmIHAubGlmZSA+IDBcbiAgICAgICAgZmFsc2VcblxuICAgIHVwZGF0ZTogKGR0KSAtPlxuICAgICAgICBpc0FsaXZlID0gZmFsc2VcbiAgICAgICAgZm9yIGVtaXR0ZXIgaW4gQGVtaXR0ZXJzIHdoZW4gZW1pdHRlci5pc0FsaXZlKClcbiAgICAgICAgICAgIGlzQWxpdmUgPSB0cnVlXG4gICAgICAgICAgICBlbWl0dGVyLnVwZGF0ZShkdClcblxuICAgICAgICBwcyA9IEBwYXJ0aWNsZXNcbiAgICAgICAgaWYgcHMubGVuZ3RoID4gMFxuICAgICAgICAgICAgYWxpdmVQYXJ0aWNsZXMgPSAwXG4gICAgICAgICAgICBmb3IgcCBpbiBwcyB3aGVuIHAubGlmZSA+IDBcbiAgICAgICAgICAgICAgICBhbGl2ZVBhcnRpY2xlcysrXG4gICAgICAgICAgICAgICAgaXNBbGl2ZSA9IHRydWVcbiAgICAgICAgICAgICAgICBmb3IgYWZmZWN0b3IgaW4gQGFmZmVjdG9yc1xuICAgICAgICAgICAgICAgICAgICBhZmZlY3Rvci51cGRhdGVQYXJ0aWNsZShkdCwgcClcbiAgICAgICAgICAgICAgICBwLmxpZmUgLT0gZHRcblxuICAgICAgICAgICAgaWYgYWxpdmVQYXJ0aWNsZXMgPT0gMFxuICAgICAgICAgICAgICAgIHBzLmxlbmd0aCA9IDBcbiAgICAgICAgICAgIGVsc2UgaWYgQHBhcnRpY2xlcy5sZW5ndGggLSBhbGl2ZVBhcnRpY2xlcyA+IDEwXG4gICAgICAgICAgICAgICAgQHBhcnRpY2xlcyA9IHBzLmZpbHRlciAocCkgLT4gcC5saWZlID4gMFxuXG4gICAgICAgIGlmIEByZW1vdmVPbkZpbmlzaCBhbmQgbm90IGlzQWxpdmVcbiAgICAgICAgICAgIGNvbnNvbGUubG9nIFwicmVtb3ZlXCJcbiAgICAgICAgICAgIEByZW1vdmUoKVxuICAgICAgICByZXR1cm5cblxuICAgIHJlc2V0OiAtPlxuICAgICAgICBmb3IgZW1pdHRlciBpbiBAZW1pdHRlcnNcbiAgICAgICAgICAgIGVtaXR0ZXIucmVzZXQ/KClcbiAgICAgICAgQHBhcnRpY2xlcy5sZW5ndGggPSAwXG5cbm1vZHVsZS5leHBvcnRzID0gUGFydGljbGVTeXN0ZW1cblxuIiwiIyBDcmVhdGVkIGJ5IHlhb2NodW5odWkgb24gMTYvMS80LlxuY29sb3JVdGlscyA9IHJlcXVpcmUgJy4uL3V0aWxzL2NvbG9yVXRpbHMnXG5jb2xvclRvU3R5bGUgPSBjb2xvclV0aWxzLmNvbG9yVG9TdHlsZVxuXG5SZW5kZXJlciA9IHt9XG5cbmNsYXNzIFJlbmRlcmVyLmRvdFxuICAgIGNvbnN0cnVjdG9yOiAtPlxuICAgIGluaXRQYXJ0aWNsZTogKHApIC0+XG4gICAgICAgIHAueCA/PSAwXG4gICAgICAgIHAueSA/PSAwXG4gICAgICAgIHAuc2l6ZSA/PSAxXG4gICAgICAgIHAuY29sb3IgPz0gWzI1NSwgMCwgMF1cblxuICAgIGRyYXdQYXJ0aWNsZTogKGN0eCwgcCktPlxuICAgICAgICBjdHguYmVnaW5QYXRoKClcbiAgICAgICAgY3R4LmFyYyhwLngsIHAueSwgcC5zaXplLCAwLCAyICogTWF0aC5QSSlcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yVG9TdHlsZShwLmNvbG9yKVxuICAgICAgICBjdHguZmlsbCgpXG5cbmNsYXNzIFJlbmRlcmVyLmJveFxuICAgIGNvbnN0cnVjdG9yOiAtPlxuICAgIGluaXRQYXJ0aWNsZTogKHApIC0+XG4gICAgICAgIHAueCA/PSAwXG4gICAgICAgIHAueSA/PSAwXG4gICAgICAgIHAuc2l6ZSA/PSAxXG4gICAgICAgIHAuY29sb3IgPz0gWzI1NSwgMCwgMF1cblxuICAgIGRyYXdQYXJ0aWNsZTogKGN0eCwgcCktPlxuICAgICAgICBjdHguYmVnaW5QYXRoKClcbiAgICAgICAgcm90ID0gcC5yb3RhdGlvblxuICAgICAgICBzaXplID0gcC5zaXplXG5cbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yVG9TdHlsZShwLmNvbG9yKVxuICAgICAgICBpZiByb3RcbiAgICAgICAgICAgIGN0eC5zYXZlKClcbiAgICAgICAgICAgIGN0eC50cmFuc2xhdGUocC54LCBwLnkpXG4gICAgICAgICAgICBjdHgucm90YXRlKHJvdClcbiAgICAgICAgICAgIGN0eC5maWxsUmVjdCgtc2l6ZSwgLXNpemUsIHNpemUgKiAyLCBzaXplICogMilcbiAgICAgICAgICAgIGN0eC5yZXN0b3JlKClcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgY3R4LmZpbGxSZWN0KC1zaXplICsgcC54LCAtc2l6ZSArIHAueSwgc2l6ZSAqIDIsIHNpemUgKiAyKVxuXG5jbGFzcyBSZW5kZXJlci5kb3RfZmFkZVxuICAgIGNvbnN0cnVjdG9yOiAtPlxuICAgIGluaXRQYXJ0aWNsZTogKHApIC0+XG4gICAgICAgIHAueCA/PSAwXG4gICAgICAgIHAueSA/PSAwXG4gICAgICAgIHAuc2l6ZSA/PSAxXG4gICAgICAgIHAuY29sb3IgPz0gWzEwMCwgMTAwLCAxMDBdXG5cbiAgICBkcmF3UGFydGljbGU6IChjdHgsIHApLT5cbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpXG4gICAgICAgIHJvdCA9IHAucm90YXRpb25cbiAgICAgICAgc2l6ZSA9IHAuc2l6ZVxuXG4gICAgICAgIGN0eC5zYXZlKClcbiAgICAgICAgcmFkID0gY3R4LmNyZWF0ZVJhZGlhbEdyYWRpZW50KDAsIDAsIDAsIDAsIDAsIHNpemUpO1xuICAgICAgICBhID0gcC5jb2xvclszXVxuICAgICAgICByYWQuYWRkQ29sb3JTdG9wKDAsIGNvbG9yVG9TdHlsZShwLmNvbG9yKSk7XG4gICAgICAgIHAuY29sb3JbM10gPSAwXG4gICAgICAgIHJhZC5hZGRDb2xvclN0b3AoMSwgY29sb3JUb1N0eWxlKHAuY29sb3IpKTtcbiAgICAgICAgcC5jb2xvclszXSA9IGFcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHJhZFxuICAgICAgICBjdHgudHJhbnNsYXRlKHAueCwgcC55KVxuICAgICAgICBpZiByb3RcbiAgICAgICAgICAgIGN0eC5yb3RhdGUocm90KVxuXG4gICAgICAgIGN0eC5maWxsUmVjdCgtc2l6ZSwgLXNpemUsIHNpemUgKiAyLCBzaXplICogMilcbiAgICAgICAgY3R4LnJlc3RvcmUoKVxuXG5cbmNsYXNzIFJlbmRlcmVyLmltYWdlXG4gICAgY29uc3RydWN0b3I6IChzeXN0ZW0sIHBhcmFtcyktPlxuICAgICAgICBAaW1hZ2UgPSBwYXJhbXMuaW1hZ2VcblxuICAgIGluaXRQYXJ0aWNsZTogKHApIC0+XG4gICAgICAgIHAueCA/PSAwXG4gICAgICAgIHAueSA/PSAwXG4gICAgICAgIHAuc2l6ZSA/PSAxXG4gICAgICAgIHAuYWxwaGEgPz0gMVxuXG4gICAgZHJhd1BhcnRpY2xlOiAoY3R4LCBwKS0+XG4gICAgICAgIHJvdCA9IHAucm90YXRpb25cbiAgICAgICAgc2l6ZSA9IHAuc2l6ZVxuICAgICAgICBjdHguZ2xvYmFsQWxwaGEgPSBwLmFscGhhXG4gICAgICAgIGlmIHJvdFxuICAgICAgICAgICAgY3R4LnNhdmUoKVxuICAgICAgICAgICAgY3R4LnRyYW5zbGF0ZShwLngsIHAueSlcbiAgICAgICAgICAgIGN0eC5yb3RhdGUocm90KVxuICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShAaW1hZ2UsIDAsIDAsIEBpbWFnZS53aWR0aCwgQGltYWdlLmhlaWdodCxcbiAgICAgICAgICAgICAgICAtc2l6ZSwgLXNpemUsIHNpemUgKiAyLCBzaXplICogMilcbiAgICAgICAgICAgIGN0eC5yZXN0b3JlKClcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShAaW1hZ2UsIDAsIDAsIEBpbWFnZS53aWR0aCwgQGltYWdlLmhlaWdodCxcbiAgICAgICAgICAgICAgICBwLngtc2l6ZSwgcC55LXNpemUsIHNpemUgKiAyLCBzaXplICogMilcblxubW9kdWxlLmV4cG9ydHMgPSBSZW5kZXJlclxuIiwiIyBDcmVhdGVkIGJ5IHlhb2NodW5odWkgb24gMTYvMS82LlxucmFuZ2VWYWx1ZSA9IHJlcXVpcmUgJy4vcmFuZ2VWYWx1ZSdcblxubW9kdWxlLmV4cG9ydHMgPVxuICAgIGNvbG9yUmFuZ2VWYWx1ZTogKGNvbG9yKSAtPlxuICAgICAgICByID0gcmFuZ2VWYWx1ZSBjb2xvclswXVxuICAgICAgICBnID0gcmFuZ2VWYWx1ZSBjb2xvclsxXVxuICAgICAgICBiID0gcmFuZ2VWYWx1ZSBjb2xvclsyXVxuICAgICAgICBhID0gcmFuZ2VWYWx1ZSBjb2xvclszXVxuXG4gICAgICAgIC0+IFtyKCksIGcoKSwgYigpLCBhKCldXG5cbiAgICBjb2xvclRvU3R5bGU6IChjb2xvcikgLT5cbiAgICAgICAgciA9IH5+Y29sb3JbMF1cbiAgICAgICAgZyA9IH5+Y29sb3JbMV1cbiAgICAgICAgYiA9IH5+Y29sb3JbMl1cbiAgICAgICAgYSA9IGNvbG9yWzNdXG4gICAgICAgIGlmIGE/XG4gICAgICAgICAgICBcInJnYmEoI3tyfSwje2d9LCN7Yn0sI3thfSlcIlxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBcInJnYigje3J9LCN7Z30sI3tifSlcIiIsIiMgQ3JlYXRlZCBieSB5YW9jaHVuaHVpIG9uIDE2LzEvNS5cblxubW9kdWxlLmV4cG9ydHMgPSAodmFsKSAtPlxuICAgIGlmIHZhbC5sZW5ndGggPiAxXG4gICAgICAgIC0+ICh2YWxbMV0gLSB2YWxbMF0pICogTWF0aC5yYW5kb20oKSArIHZhbFswXVxuICAgIGVsc2VcbiAgICAgICAgLT4gdmFsXG4iXX0=
