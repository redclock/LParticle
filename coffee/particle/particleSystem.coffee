# Created by yaochunhui on 16/1/4.
Affector    = require './affectors'
Emitter     = require './emitters'
Renderer    = require './renderers'
Initializer = require './initializers'

class ParticleSystem
    constructor: (params)->
        LExtends(@, LSprite, [])
        @removeOnFinish = true

        @emitters = @_createComponents("emitters", Emitter, params)
        @initializers = @_createComponents("initializers", Initializer, params)
        @affectors = @_createComponents("affectors", Affector, params)
        @renderers = @_createComponents("renderers", Renderer, params)

        @particles = []
        @graphics.add (ctx) =>
            ctx.save()
            if (@blendMode)
                ctx.globalCompositeOperation = @blendMode
            for p in @particles when p.life > 0
                for renderer in @renderers
                    renderer.drawParticle(ctx, p)
            ctx.restore()
            return
        curTime = Date.now()
        @addEventListener(LEvent.ENTER_FRAME, =>
            newTime = Date.now()
            deltaTime = newTime - curTime
            curTime = newTime
            deltaTime = Math.min(deltaTime, 100)
            @update(deltaTime / 1000)
        );

    _createComponents: (compType, compCollection, paramsObj) ->
        paramsList = paramsObj[compType]
        return [] unless paramsList and paramsList.length > 0
        for params in paramsList
            cls = compCollection[params.name]
            unless typeof cls is "function"
                console.error "#{compType}.#{params.name} is undefined!"
                continue
            new cls(@, params)

    spawnParticle: (p = {})->
        for initializer in @initializers
            initializer.initParticle(p)
        for affector in @affectors
            affector.initParticle?(p)
        for renderer in @renderers
            renderer.initParticle?(p)
        p.maxLife = p.life
        @particles.push p
        p

    isAlive: ->
        for emitter in @emitters
            return true if emitter.isAlive()
        for p in @particles
            return true if p.life > 0
        false

    update: (dt) ->
        isAlive = false
        for emitter in @emitters when emitter.isAlive()
            isAlive = true
            emitter.update(dt)

        ps = @particles
        if ps.length > 0
            aliveParticles = 0
            for p in ps when p.life > 0
                aliveParticles++
                isAlive = true
                for affector in @affectors
                    affector.updateParticle(dt, p)
                p.life -= dt

            if aliveParticles == 0
                ps.length = 0
            else if @particles.length - aliveParticles > 10
                @particles = ps.filter (p) -> p.life > 0

        if @removeOnFinish and not isAlive
            console.log "remove"
            @remove()
        return

    reset: ->
        for emitter in @emitters
            emitter.reset?()
        @particles.length = 0

module.exports = ParticleSystem

