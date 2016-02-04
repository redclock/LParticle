# Created by yaochunhui on 15/12/29.
coffeeify    =  require 'coffeeify'
browserify   =  require 'browserify'
fs           =  require 'fs'
path         =  require 'path'
showProgress =  require 'show-stream-progress'
through      =  require 'through'
async        =  require 'async'
pathUtil     =  require 'path'

targets =
    'lparticle' : ['../coffee/lib', '../js/']

build = module.exports = (srcFile, outputPath, outputFile, report = false, debug = true, callback) ->

    process.chdir(outputPath)
    coffeeify.sourceMap = debug
    browserify({ debug: debug, extensions: [".coffee"] })
    .transform(coffeeify)
    .require(require.resolve(srcFile), entry: true)
    .bundle()
    .on('error', (err) ->
        console.log("\n" + err)
        throw err
    )
    .pipe(if report then showProgress() else through())
    .pipe(fs.createWriteStream  path.join(".", outputFile))
    .on 'finish', ->
        callback?(null)
    process.chdir(__dirname)

return if module.parent

argv = process.argv

tasks = []

makeTask = (name) ->
    (callback) ->
        srcFile = pathUtil.join(__dirname, targets[name][1], targets[name][0])
        outputPath = pathUtil.join(__dirname, targets[name][1])
        console.log srcFile
        console.log (new Date()).toLocaleTimeString(), name, 'build started.'
        build(srcFile, outputPath, name + '.js', true, true, ->
            console.log "\n" + (new Date()).toLocaleTimeString(), 'build done.'
            callback(null)
        )

for i in [0..argv.length]
    name = argv[i]
    if (targets[name])
        tasks.push makeTask name

async.series tasks