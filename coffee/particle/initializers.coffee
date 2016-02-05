# Created by yaochunhui on 16/1/4.
rangeValue = require '../utils/rangeValue'
colorUtils = require '../utils/colorUtils'
Initializer = {}

class Initializer.radius
    constructor: (system, params)->
        @radiusVal = rangeValue params.radius
        @speedVal = rangeValue params.speed

    initParticle: (p) ->
        orgX = p.x or 0
        orgY = p.y or 0
        theta = Math.random() * Math.PI * 2
        sinTheta = Math.sin theta
        cosTheta = Math.cos theta
        radius = @radiusVal()
        speed = @speedVal()
        p.x = cosTheta * radius + orgX
        p.y = sinTheta * radius + orgY
        p.dx = cosTheta * speed
        p.dy = sinTheta * speed

class Initializer.position
    constructor: (system, params)->
        @xVal = rangeValue params.x
        @yVal = rangeValue params.y

    initParticle: (p) ->
        orgX = p.x or 0
        orgY = p.y or 0
        x = @xVal()
        y = @yVal()
        p.x = x + orgX
        p.y = y + orgY

class Initializer.delta_speed
    constructor: (system, params)->
        @speedXVal = rangeValue params.x
        @speedYVal = rangeValue params.y
        @mulVal = rangeValue (params.mul ? 1)

    initParticle: (p) ->
        dx = p.dx or 0
        dy = p.dy or 0
        mul = @mulVal()
        p.dx = (dx + @speedXVal()) * mul
        p.dy = (dy + @speedYVal()) * mul

class Initializer.force
    constructor: (system, params)->
        @forceXVal = rangeValue params.x
        @forceYVal = rangeValue params.y

    initParticle: (p) ->
        p.accx = @forceXVal()
        p.accy = @forceYVal()

class Initializer.rotation
    constructor: (system, params)->
        @angleVal = rangeValue params.angle

    initParticle: (p) ->
        p.rotation = @angleVal()

class Initializer.size
    constructor: (system, params)->
        @sizeVal = rangeValue params.size

    initParticle: (p) ->
        p.size = @sizeVal()

class Initializer.color
    constructor: (system, params)->
        @colorVal = colorUtils.colorRangeValue(params.color)

    initParticle: (p) ->
        p.color = @colorVal()

class Initializer.attach_node_pos
    constructor: (@system, params)->
        @attachToNode = params.node

    initParticle: (p) ->
        globalPos = @attachToNode.localToGlobal(new LPoint(@system.x, @system.y))
        localPos = @system.globalToLocal(globalPos)
        p.x = localPos.x
        p.y = localPos.y

module.exports = Initializer
