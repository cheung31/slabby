define(['jquery', 'eventEmitter'],
function($, EventEmitter) {
    var Stream = function(name, opts) {
        EventEmitter.call(this);
        this.started = false;
        this._items = [];
    };
    $.extend(Stream.prototype, EventEmitter.prototype);

    Stream.prototype.start = function() {};

    Stream.prototype.read = function() {
        return this._items.pop();
    };

    return Stream;
});
