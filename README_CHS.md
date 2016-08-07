[English Version](https://github.com/redclock/LParticle/blob/master/README.md)

# LParticle.js

一个 HTML5 版粒子系统库， 基于 [Lufylegend.js](https://github.com/lufylegend/lufylegend.js)，
采用组件式设计。

## 项目描述
Lufylegend.js 是一个简单易用并且十分强大的 HTML5 游戏引擎。但是由于引擎本身缺少好用的粒子特效功能，我在使用过程中感到不很方便，
因此写了这个轻量级的粒子系统库 LParticle.js。这个库可以用于创建 HTML5 游戏中的粒子特效，无缝插入到 Lufylegend 的结点树中。
希望能够帮助到你的游戏 ：）

### 在线例子

* [火焰](http://redclock.github.io/LParticle/examples/fire.html):
火焰特效.
* [烟花](http://redclock.github.io/LParticle/examples/spark.html):
点击屏幕生成一个烟花特效，展示自动删除无用粒子对象功能
* [渲染器](http://redclock.github.io/LParticle/examples/renderer.html):
用不同的渲染器组件显示同一个粒子系统，展示了如何写自定义渲染器组件
* [拖尾](http://redclock.github.io/LParticle/examples/trail.html):
拖尾特效, 展示使用 attach_node_pos 初始化组件.


## 使用方法

LParticle 使用 coffeeScript 编写，也自带打包生成好的 js 文件。

有两种方法可以让你在游戏中使用 LParticle:

1.  **模块化：用 [coffeeify](https://github.com/substack/coffeeify) 载入 coffee 文件**

    在需要的代码中 `require` 文件 `coffee/particle/particleSysrem.coffee`, 就可以使用 `ParticleSystem` 类.

2.  **全局引用：使用生成好的 js**

    在 html 引入打包生成好的 js 文件

    ` <script type="text/javascript" src="lparticle.min.js"></script>`

    然后使用全局的  `LParticle.ParticleSystem`.


## 代码结构

主要的粒子系统类是 `LParticle.ParticleSystem`, 它继承了引擎的 `LSprite`.
LSprite 的所有属性，比如 x, y, scaleX, scaleY, blendMode 等，都保留原来的功能.
粒子系统的对象可以和普通 sprite 一样插入到场景结点树里。

LParticle 采用组件化的设计模式.
一个 `LParticle.ParticleSystem` 对象有四种类型的组件:

*  **发射器 (Emitters)**: 处理粒子的发射;
*  **初始化 (Initializers)**: 设置每个粒子的初始属性;
*  **效果器 (Affectors)**: 每帧更新粒子属性;
*  **渲染器 (Renderers)**: 每帧渲染粒子.


## 示例代码

构造 ParticleSystem 对象的时候用一个 object 描述粒子系统包含的组件和参数。


下面代码展示如何建立一个粒子对象并插入到场景里:

    var pa = new LParticle.ParticleSystem(
        {
            emitters: [
                {
                    name: "once",     // 一次发射所有粒子
                    count: 50,        // 一共发射 50 个粒子
                    life: [0.3, 0.7]  // 每个粒子的持续生命为 0.3 秒到 0.7 秒
                }
            ],
            initializers: [
                {
                    name: "radius",   // 在一个圆周上初始化位置和速度
                    radius: [0, 2],   // 圆的半径为 0 到 2
                    speed: [50, 180]  // 速度为 50 到 180
                },
                {
                    name: "rotation", // 初始化旋转
                    angle: [0, 100]   // 角度为 0 到 100 度
                },
                {
                    name: "color",    // 初始化颜色
                    color: [200, [100, 150], 100, 1]  // r = 200, g = 随机 100 到 150, b = 100, alpha = 1
                }
            ],
            affectors: [
                {
                    name: "move"      // 每帧根据速度更新位置
                },
                {
                    name: "size",     // 每帧更新尺寸
                    from: [5, 9],     // 初始尺寸为 5 到 9
                    to: 0             // 结束尺寸为 0
                }
            ],
            renderers: [
                {
                    name: "box"       // 每个粒子画一个方框
                }
            ]
        }
    );
    pa.x = 100;
    pa.y = 100;
    pa.blendMode = LBlendMode.LIGHTER;
    addChild(pa);

## 随机属性

如上面示例代码所示，数值的属性有两种表达方式，既可以写为一个数字，表示单独的数值，
也可以写为一个2元素数组 \[a, b\], 表示 a 到 b 之间的随机值.


## 自动移除

默认情况下 ParticleSystem 对象如果不会再发射新粒子并且所有老粒子都消失了，这个对象就会自动被从场景树中删除，
因此不需要手动删除结束的粒子特效对象。

如果不想要这种自动删除的行为, 要设置 removeOnFinish 属性为 false:

```
particleObject.removeOnFinish = false;
```

## 自带组件

只使用自带的组件可以满足大多数用途的粒子特效

### Emitters


    {
        name: "once"  // 一次发射所有粒子
        count: 100    // 发射粒子总数
        life: 0.5     // 粒子生命时间，单位秒
    }

    {
        name: "infinite"    // 连续发射粒子
        rate: 100           // 每秒发射的粒子数
        life: 0.5           //  粒子生命时间，单位秒
    }

### Initializers

    {
        name: "radius"      // 在一个圆周上初始化位置和速度
        radius: 10          // 圆的半径
        speed: 5            // 粒子速度，朝向圆外面
    }

    {
        name: "position"    // 初始化位置
        x: 10               // x
        y: 50               // y
    }

    {
        name: "delta_speed" // 在当前速度属性加一个增量
        x: 10               // x
        y: 50               // y
        mul: 10             // 倍数，可选项，默认为1
    }

    {
        name: "force"       // 受到一个固定力的作用
        x: 10               // x 方向加速度
        y: 20               // y 方向加速度
    }

    {
        name: "rotation"    // 初始化旋转
        angle: 0.1          // 角度
    }

    {
        name: "size"        // 初始化尺寸
        size: 10            // 尺寸
    }

    {
        name: "color"               // 初始化颜色
        color: [255, 255, 255, 1]   // 颜色, [r,g,b,a], rgb 范围 [0, 255], a 范围 [0, 1]
    }

    {
        name: "attach_node_pos"     // 根据其他结点的位置初始化粒子, 可以产生拖尾效果
        node: rootSprite            // 参考结点的对象，可以是 LSprite, LShape 等.
    }

### Affectors

    {
        name: "move"        // 根据粒子的速度和加速度移动。如果不加这个，即使有速度粒子也不会移动
    }

    {
        name: "size"        // 每帧改变尺寸
        from: 10            // 开始尺寸
        to: 0               // 结束尺寸
    }

    {
        name: "color"               // 每帧改变颜色
        from: [255, 200, 100, 1]    // 开始颜色, [r,g,b,a], rgb in [0, 255], a in [0, 1]
        to: [0, 0, 0, 0]            // 结束颜色, [r,g,b,a], rgb in [0, 255], a in [0, 1]
    }

    {
        name: "alpha"       // 每帧改变颜色 alpha
        from: 0.5           // 开始 alpha
        to: 0               // 结束 alpha
    }

    {
        name: "rotation"    // 每帧改变旋转
        from: 10            // 开始角度
        to: 0               // 结束角度
    }

### Renderers

    {
        name: "box"           // 每个粒子画为一个方块
    }

    {
        name: "dot"           // 每个粒子画为一个实心圆
    }

    {
        name: "dot_fade"      // 每个粒子画为一个圆, 从圆心到边沿逐渐变淡
    }

    {
        name: "image"         // 每个粒子画为一个图像
        image: img            // 图像对象
    }

## 自定义组件

你可以新建自己的自定义的组件实现特殊功能。新建组件需要建立实现特定接口的类，并且将名字注册到 LParticle 的对应组件类型中。

发射器组件:

    // system: 粒子系统对象
    // param:  属性对象
    function MyEmitter(system, param) {}

    // 每帧调用
    MyEmitter.prototype.update = function(deltaTime) {}

    // 是否还会发射新粒子
    MyEmitter.prototype.isAlive = function() { return false; }

    // 注册名字为 “my_emitter”
    LParticle.Emitter.my_emitter = MyEmitter

初始化组件:

    // system: 粒子系统对象
    // param:  属性对象
    function MyInitializer(system, param) {}

    // 每个粒子生成时调用
    // p: 粒子对象
    MyInitializer.prototype.initParticle = function(p) {}

    // 注册名字为 “my_initializer”
    LParticle.Initializer.my_initializer = MyInitializer

效果器组件:

    // system: 粒子系统对象
    // param:  属性对象
    function MyAffector(system, param) {}

    // 每个粒子生成时调用
    // p: 粒子对象
    MyAffector.prototype.initParticle = function(p) {}

    // 每帧调用
    // p: 粒子对象
    MyAffector.prototype.updateParticle = function(deltaTime, p) {}

    // 注册名字为 “my_affector”
    LParticle.Affector.my_affector = MyAffector

渲染器组件:

    // system: 粒子系统对象
    // param:  属性对象
    function MyRenderer(system, param) {}

    // 每个粒子生成时调用
    // p: 粒子对象
    MyRenderer.prototype.initParticle = function(p) {}

    // 画一个粒子
    // ctx: canvas 上下文
    // p: 粒子对象
    MyRenderer.prototype.drawParticle = function(ctx, p) {}

    // 注册名字为 “my_renderer”
    LParticle.Renderer.my_renderer = MyRenderer



