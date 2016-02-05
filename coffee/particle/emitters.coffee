# Created by yaochunhui on 16/1/4.
rangeValue = require '../utils/rangeValue'
Emitter = {}

class Emitter.once
    constructor: (@system, params)->
        @count = rangeValue(params.count)()
        @lifeVal = rangeValue params.life
        @emitted = false

    update: ->
        unless @emitted
            for i in [1..@count]
                @system.spawnParticle(life: @lifeVal())
            @emitted = true

        true

    isAlive: -> !@emitted

class Emitter.infinite
    constructor: (@system, params)->
        @rateVal = rangeValue params.rate
        @lifeVal = rangeValue params.life
        @emitted = false
        @timer = 0
        @_updateDuration()

    _updateDuration: ->
        rate = @rateVal()
        if rate > 0.001
            @duration = 1 / rate
        else
            @duration = 10e10

    update: (dt)->
        @timer += dt
        while @timer > @duration
            @timer -= @duration
            @system.spawnParticle(life: @lifeVal())
            @_updateDuration()
        true

    isAlive: -> true

module.exports = Emitter
