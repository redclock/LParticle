# Created by yaochunhui on 16/1/6.
rangeValue = require './rangeValue'

module.exports =
    colorRangeValue: (color) ->
        r = rangeValue color[0]
        g = rangeValue color[1]
        b = rangeValue color[2]
        a = rangeValue color[3]

        -> [r(), g(), b(), a()]

    colorToStyle: (color) ->
        r = ~~color[0]
        g = ~~color[1]
        b = ~~color[2]
        a = color[3]
        if a?
            "rgba(#{r},#{g},#{b},#{a})"
        else
            "rgb(#{r},#{g},#{b})"