var stream = require('stream');
var util = require('util');
var Transform = require('stream').Transform;

var common = require('fin-common');
var parameterHelper = common.util.parameterHelper;

function Classification(classification) {
    this._classification = parameterHelper.isSet(classification);

    Transform.call(this, {objectMode: true});
}

util.inherits(Classification, Transform);

Classification.prototype._transform = function (position, enc, callback) {
    var classi = this._classification.classify(position.purpose());

    if (classi) {
        position.classification(classi);
        this.push(position);
    }

    callback();
};

module.exports = Classification;