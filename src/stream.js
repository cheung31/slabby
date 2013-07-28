define(['jquery', 'eventEmitter'],
function($, EventEmitter) {
    var Stream = function(name, opts) {
        EventEmitter.call(this);
        this.started = false;
        this._items = [];
        var self = this;
        this.on('readable', function() {
            console.log ('>>> start stream: ' + name);
            self.started = true;
        });
    };
    $.extend(Stream.prototype, EventEmitter.prototype);

    Stream.prototype.start = function() {};

    Stream.prototype.read = function() {
        return this._items.shift();
    };

    return Stream;
});
