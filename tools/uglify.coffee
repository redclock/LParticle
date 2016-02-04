# Created by yaochunhui on 15/4/13.
UglifyJS = require('uglify-js')
fs = require('fs')

doUglify = (srcFile, dstFile)->
    result = UglifyJS.minify(srcFile,
        mangle: true
        compress:
            sequences: true
            dead_code: true
            conditionals: true
            booleans: true
            unused: true
            if_return: true
            join_vars: true
            drop_console: false
    )
    fs.writeFileSync dstFile, result.code

argv = process.argv

for i in [2...argv.length] by 1
    name = argv[i]
    srcFile = __dirname + "/../js/#{name}.js"
    dstFile = __dirname + "/../js/#{name}.min.js"
    console.log "Compress: " + name
    doUglify(srcFile, dstFile)

