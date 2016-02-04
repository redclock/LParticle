# LParticle

A component-based particle system library for HTML5 game engine [Lufylegend.js](https://github.com/lufylegend/lufylegend.js).

## Description
I'm writing HTML5 games with Lufylegend.js, which is a powerful and easy-to-use HTML5 game engine.
But there is not a particle systems class.
So I wrote this LParticle.js to create particle effects in HTML5 games. Hope it can help you.

## Structure

LParticle is designed as a component-based pattern.
The main class, `LParticle.ParticleSystem`, is derived from `LSprite`.
So you can use the particle system in any place in the scene graph.


An instance of `LParticle.ParticleSystem` keeps four types of components:

*  **Emitters**: handle the emission of particles;
*  **Initializers**: set initial properties of particles once they are created;
*  **Affectors**: update properties of particles every frame;
*  **Renderers**: implement draw particles every frame.


## Example

Pass a description of the components to the constructor of ParticleSystem.

To create a particle effect and add it to the stage:

```

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
    pa.x = evt.offsetX;
    pa.y = evt.offsetY;
    pa.blendMode = LBlendMode.LIGHTER;
    addChild(pa);

```

For example, you may want to create a particle effect that:

1. emits 10 particles per second continuously
2. each particle has a random position on the edge of a circle and the speed
3. the size of each particle changes from 5 to 0 in its life time
4. the color of each particle changes from yellow to black
5. draw each particle as rectangle according to the


 for type There is a ParticleSystem class and a set of built-in components
## Features
* Component based


