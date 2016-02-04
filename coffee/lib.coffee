# Created by yaochunhui on 16/1/27.
LParticle = {}
LParticle.ParticleSystem    = require './particle/particleSystem'
LParticle.Emitter           = require './particle/emitters'
LParticle.Initializer       = require './particle/initializers'
LParticle.Affector          = require './particle/affectors'
LParticle.Renderer          = require './particle/renderers'
LParticle.colorUtils        = require './utils/colorUtils'

# Expose the class either via AMD, CommonJS or the global object
if typeof define == 'function' and define.amd
    define -> LParticle
else if typeof module == 'object' and module.exports
    module.exports = LParticle
else
    global.LParticle = LParticle

