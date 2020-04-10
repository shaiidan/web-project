
exports.soringArray = function(a){
    if (Array.isArray(a))
        return a.sort(function (a, b) { return a - b; });
    else
        return -1;
};