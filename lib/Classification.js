var common = require('fin-common');
var parameterHelper = common.util.parameterHelper;

function Classification(data) {
    this._data = this._init(parameterHelper.isSet(data));
}

Classification.prototype._init = function(data) {
    var result = {};

    Object.keys(data).forEach(function(key) {
        var phrases = data[key];

        phrases.forEach(function(phrase) {
            result[phrase] = key;
        });
    });

    return result;
};

Classification.prototype.classify = function (purpose) {
    purpose = purpose.toLowerCase();
    var keys = Object.keys(this._data);

    for(var i = 0; i < keys.length; i++) {
        if (purpose.indexOf(keys[i]) > -1) return this._data[keys[i]];
    }

    return null;
};

module.exports = Classification;