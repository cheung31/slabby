define(['jquery', 'slabby/stream', 'slabby/slab'],
function($, Stream, Slab) {
    var InstagramStream = function(name, opts) {
        Stream.apply(this, arguments);
        this.name = name;
        this._items = [];
        this.access_token = opts.access_token;
        this.user_id = opts.user_id;
    };
    $.extend(InstagramStream.prototype, Stream.prototype);

    InstagramStream.prototype._startStream = function() {
        var recent_photos_url = 'https://api.instagram.com/v1/users/' + this.user_id + '/media/recent/?access_token=' + this.access_token;

        var self = this;
        $.ajax(recent_photos_url, {
            type: 'GET',
            dataType: 'jsonp',
            success: function (response) {
                var recent_photos = response.data;
                for (i=0; i < recent_photos.length; i++) {
                    var image_url = recent_photos[i]['images']['standard_resolution']['url'];
                    var image_id = recent_photos[i]['id'];
                    if (!image_url) {
                        continue;
                    }
                    self._items.push(
                        new Slab(image_url, image_id)
                    );
                }
                // Emit readable
                self.trigger('readable');
            }
        });
    };

    return InstagramStream;
});
