define(['jquery'],
function($) {
    var Stream = function(name, opts) {
        this._items = [];
    };

    Stream.prototype.start() = function() {
    });

    Stream.prototype.read() = function() {
        return this._items.pop();
    });

    return Stream;
});
