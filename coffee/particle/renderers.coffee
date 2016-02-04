# Created by yaochunhui on 16/1/4.
colorUtils = require '../utils/colorUtils'
colorToStyle = colorUtils.colorToStyle

Renderer = {}

class Renderer.dot
    constructor: ->
    initParticle: (p) ->
        p.x ?= 0
        p.y ?= 0
        p.size ?= 1
        p.color ?= [255, 0, 0]

    drawParticle: (ctx, p)->
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, 2 * Math.PI)
        ctx.fillStyle = colorToStyle(p.color)
        ctx.fill()

class Renderer.box
    constructor: ->
    initParticle: (p) ->
        p.x ?= 0
        p.y ?= 0
        p.size ?= 1
        p.color ?= [255, 0, 0]

    drawParticle: (ctx, p)->
        ctx.beginPath()
        rot = p.rotation
        size = p.size

        ctx.fillStyle = colorToStyle(p.color)
        if rot
            ctx.save()
            ctx.translate(p.x, p.y)
            ctx.rotate(rot)
            ctx.fillRect(-size, -size, size * 2, size * 2)
            ctx.restore()
        else
            ctx.fillRect(-size + p.x, -size + p.y, size * 2, size * 2)

class Renderer.dot_fade
    constructor: ->
    initParticle: (p) ->
        p.x ?= 0
        p.y ?= 0
        p.size ?= 1
        p.color ?= [100, 100, 100]

    drawParticle: (ctx, p)->
        ctx.beginPath()
        rot = p.rotation
        size = p.size

        ctx.save()
        rad = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
        a = p.color[3]
        rad.addColorStop(0, colorToStyle(p.color));
        p.color[3] = 0
        rad.addColorStop(1, colorToStyle(p.color));
        p.color[3] = a
        ctx.fillStyle = rad
        ctx.translate(p.x, p.y)
        if rot
            ctx.rotate(rot)

        ctx.fillRect(-size, -size, size * 2, size * 2)
        ctx.restore()


class Renderer.image
    constructor: (system, params)->
        @image = params.image

    initParticle: (p) ->
        p.x ?= 0
        p.y ?= 0
        p.size ?= 1
        p.alpha ?= 1

    drawParticle: (ctx, p)->
        rot = p.rotation
        size = p.size
        ctx.globalAlpha = p.alpha
        if rot
            ctx.save()
            ctx.translate(p.x, p.y)
            ctx.rotate(rot)
            ctx.drawImage(@image, 0, 0, @image.width, @image.height,
                -size, -size, size * 2, size * 2)
            ctx.restore()
        else
            ctx.drawImage(@image, 0, 0, @image.width, @image.height,
                p.x-size, p.y-size, size * 2, size * 2)

module.exports = Renderer
