# Created by yaochunhui on 16/1/4.
rangeValue = require '../utils/rangeValue'
colorUtils = require '../utils/colorUtils'

Affector = {}

class Affector.move
    constructor: ->
    initParticle: (p) ->
        p.x = p.x or 0
        p.y = p.y or 0
        if p.accx
            p.dx = p.dx or 0
        if p.accy
            p.dy = p.dy or 0
        return

    updateParticle: (dt, p) ->
        if p.dx
            p.x += p.dx * dt
        if p.dy
            p.y += p.dy * dt
        if p.accx
            p.dx += p.accx * dt
        if p.accy
            p.dy += p.accy * dt
        return

class Affector.size
    constructor: (system, params) ->
        @fromSizeVal = rangeValue params.from
        @toSizeVal = rangeValue params.to

    initParticle: (p) ->
        p.sizeFrom = @fromSizeVal()
        p.sizeTo = @toSizeVal()
        p.size = p.sizeFrom

    updateParticle: (dt, p) ->
        t = p.life / p.maxLife
        p.size = p.sizeFrom * t + p.sizeTo * (1 - t)

class Affector.color
    constructor: (system, params) ->
        @fromColorVal = colorUtils.colorRangeValue params.from
        @toColorVal = colorUtils.colorRangeValue params.to

    initParticle: (p) ->
        p.colorFrom = @fromColorVal()
        p.colorTo = @toColorVal()
        p.color = p.colorFrom.slice()

    updateParticle: (dt, p) ->
        t = p.life / p.maxLife
        p.color[0] = p.colorFrom[0] * t + p.colorTo[0] * (1 - t)
        p.color[1] = p.colorFrom[1] * t + p.colorTo[1] * (1 - t)
        p.color[2] = p.colorFrom[2] * t + p.colorTo[2] * (1 - t)
        p.color[3] = p.colorFrom[3] * t + p.colorTo[3] * (1 - t)

class Affector.alpha
    constructor: (system, params) ->
        @fromAlphaVal = rangeValue params.from
        @toAlphaVal = rangeValue params.to

    initParticle: (p) ->
        p.alphaFrom = @fromAlphaVal()
        p.alphaTo = @toAlphaVal()
        p.alpha = p.alphaFrom

    updateParticle: (dt, p) ->
        t = p.life / p.maxLife
        alpha = p.alphaFrom * t + p.alphaTo * (1 - t)
        if p.color
            p.color[3] = alpha
        p.alpha = alpha

class Affector.rotation
    constructor: (system, params) ->
        @fromAngleVal = rangeValue params.from
        @toAngleVal = rangeValue params.to

    initParticle: (p) ->
        p.angleFrom = @fromAngleVal()
        p.angleTo = @toAngleVal()
        p.angle = p.angleFrom

    updateParticle: (dt, p) ->
        t = p.life / p.maxLife
        p.rotation = p.angleFrom * t + p.angleTo * (1 - t)
module.exports = Affector
