define(['jquery', 'eventEmitter'],
function($, EventEmitter) {
    var Stream = function(name, opts) {
        EventEmitter.call(this);
        this.started = false;
        this._items = [];
        var self = this;
    };
    $.extend(Stream.prototype, EventEmitter.prototype);

    Stream.prototype.start = function() {
        this.started = true;
        this._startStream();
    };

    Stream.prototype.read = function() {
        return this._items.shift();
    };

    return Stream;
});
