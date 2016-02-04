# Created by yaochunhui on 16/1/5.

module.exports = (val) ->
    if val.length > 1
        -> (val[1] - val[0]) * Math.random() + val[0]
    else
        -> val
