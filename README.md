# LParticle

A component-based particle system library for HTML5 game engine [Lufylegend.js](https://github.com/lufylegend/lufylegend.js).

## Description
I'm writing HTML5 games with Lufylegend.js, which is a powerful and easy-to-use HTML5 game engine.
But this engine does not have a convenience particle systems class.
So I wrote this LParticle.js to create particle effects in HTML5 games. Hope it can help you.

## Usage
There are two ways to use this library:

1.  **Import by [coffeeify](https://github.com/substack/coffeeify).**
    You can directly require the file `coffee/particle/particleSysrem.coffee`, and use the `ParticleSystem` class.

2.  **Use global export.**
    Import the generated bundle .js file in your html:

    ` <script type="text/javascript" src="lparticle.min.js"></script>`

    The particle system class is exported as  `LParticle.ParticleSystem`.


## Structure

The main class, `LParticle.ParticleSystem`, is derived from `LSprite`.
Properties of LSprite such as x, y, scaleX, scaleY and blendMode, are available to ParticleSystem.
You can add the particle system to any place in the scene graph.
This particle system class is designed as a component-based pattern.
An instance of `LParticle.ParticleSystem` keeps four types of components:

*  **Emitters**: handle the emission of particles;
*  **Initializers**: set initial properties of particles once they are created;
*  **Affectors**: update properties of particles every frame;
*  **Renderers**: implement draw particles every frame.


## Sample Code

Pass a description of the components as the parameter of the constructor of ParticleSystem.

To create a particle effect and add it to the stage:

    var pa = new LParticle.ParticleSystem(
        {
            emitters: [
                {
                    name: "once",     // emit all particles at once
                    count: 50,        // emit totally 50 particles
                    life: [0.3, 0.7]  // each particle has a random life from 0.3 to 0.7 seconds
                }
            ],
            initializers: [
                {
                    name: "radius",   // initialize position and velocity on the edge of a circle
                    radius: [0, 2],   // random radius of the circle from 0 to 2
                    speed: [50, 180]  // random speed from 50 to 180
                },
                {
                    name: "rotation", // initialize rotation
                    angle: [0, 100]   // random angle from 0 to 100 radians
                },
                {
                    name: "color",    // initialize color
                    color: [200, [100, 150], 100, 1]  // r = 200, g = random from 100 to 150, b = 100, alpha = 1
                }
            ],
            affectors: [
                {
                    name: "move"      // update the position according to velocity
                },
                {
                    name: "size",     // update the size
                    from: [5, 9],     // start size is random from 5 to 9
                    to: 0             // end size is 0
                }
            ],
            renderers: [
                {
                    name: "box"       // draw each particle as a rectangle
                }
            ]
        }
    );
    pa.x = 100;
    pa.y = 100;
    pa.blendMode = LBlendMode.LIGHTER;
    addChild(pa);

## Random Properties

As shown in the above example, a number property can be expressed as a single number, which means the exact value,
or as a two-element array, `[a, b]`, which means a random value from a to b.


## Auto Removing

By default, a ParticleSystem object will be removed automatically from its parent when the effect is finished.
The condition is all the emitters have no future emissions and all the particles are disappeared.
To prevent this behavior, set the `removeOnFinish` property to `false`:

```
particleObject.removeOnFinish = false;
```

## Built-in Components

### Emitters


    {
        name: "once"  // emit all particles at once
        count: 100    // total emission count
        life: 0.5     // particle life, in seconds
    }

    {
        name: "infinite"    // emit particles continuously
        rate: 100           // emission per second
        life: 0.5           // particle life, in seconds
    }

### Initializers

    {
        name: "radius"      // initialize position and velocity on the edge of a circle
        radius: 10          // radius of the circle
        speed: 5            // speed of particles, positive is towards outside of the circle
    }

    {
        name: "position"    // initialize position
        x: 10               // x
        y: 50               // y
    }

    {
        name: "delta_speed" // add extra speed to velocity
        x: 10               // x
        y: 50               // y
        mul: 10             // multiplier, *optional*
    }

    {
        name: "force"       // apply a constant force
        x: 10               // x acceleration
        y: 20               // y acceleration
    }

    {
        name: "rotation"    // initial rotation
        angle: 0.1          // radians
    }

    {
        name: "size"        // initial size
        size: 10            // size
    }

    {
        name: "color"               // initial color
        color: [255, 255, 255, 1]   // color, [r,g,b,a], rgb in [0, 255], a in [0, 1]
    }

    {
        name: "attach_node_pos"     // set particles' position by another node's position, to create tailing effect
        node: rootSprite            // a node object in the scene graph, such as LSprite, LShape, etc.
    }

### Affectors

    {
        name: "move"        // move particles by their velocity and acceleration
    }

    {
        name: "size"        // change size during lifetime
        from: 10            // size at start
        to: 0               // size when then particle dies
    }

    {
        name: "color"               // change color linearly
        from: [255, 200, 100, 1]    // color at start, [r,g,b,a], rgb in [0, 255], a in [0, 1]
        to: [0, 0, 0, 0]            // color when then particle dies, [r,g,b,a], rgb in [0, 255], a in [0, 1]
    }

    {
        name: "alpha"       // change alpha during lifetime
        from: 0.5           // alpha at start
        to: 0               // alpha when then particle dies
    }

    {
        name: "rotation"    // change rotation angle during lifetime
        from: 10            // rotation at start
        to: 0               // rotation when then particle dies
    }

### Renderers

    {
        name: "box"           // draw a rectangle for each particle
    }

    {
        name: "dot"           // draw a dot for each particle
    }

    {
        name: "dot_fade"      // draw a dot for each particle, with radial gradient
    }

    {
        name: "image"         // draw an image for each particle
        image: img          // image object
    }

## Custom Components

You can use your own emitters, initializers, affectors and renderers.
You need to create a class implementing following interface,
and the class assign to the name:

For emitter:

    // system: the particle system object,
    // param: properties in description object
    function MyEmitter(system, param) {}

    // called per frame
    MyEmitter.prototype.update = function(deltaTime) {}

    // whether has future emissions
    MyEmitter.prototype.isAlive = function() { return false; }

    // register
    LParticle.Emitter.my_emitter = MyEmitter

For initializer:

    // system: the particle system object,
    // param: properties in description object
    function MyInitializer(system, param) {}

    // called per particle once it's created
    // p: particle object
    MyInitializer.prototype.initParticle = function(p) {}

    // register
    LParticle.Initializer.my_initializer = MyInitializer

For affector:

    // system: the particle system object,
    // param: properties in description object
    function MyAffector(system, param) {}

    // called per particle once it's created
    // p: particle object
    MyAffector.prototype.initParticle = function(p) {}

    // called per particle per frame
    // p: particle object
    MyAffector.prototype.updateParticle = function(deltaTime, p) {}

    // register
    LParticle.Affector.my_affector = MyAffector

For renderer:

    // system: the particle system object,
    // param: properties in description object
    function MyRenderer(system, param) {}

    // called per particle once it's created
    // p: particle object
    MyRenderer.prototype.initParticle = function(p) {}

    // draw a particle
    // ctx: canvas context
    // p: particle object
    MyRenderer.prototype.drawParticle = function(ctx, p) {}

    // register
    LParticle.Renderer.my_renderer = MyRenderer



