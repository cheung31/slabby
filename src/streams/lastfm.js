define(['jquery', 'slabby/stream', 'slabby/slab'],
function($, Stream, Slab) {
    var LastFmStream = function(name, opts) {
        Stream.apply(this, arguments);
        this._items = [];
        this.api_key = opts.api_key;
        this.user = opts.user;
    };
    $.extend(LastFmStream.prototype, Stream.prototype);

    LastFmStream.prototype.start = function() {
        var recent_tracks_url = 'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=' + this.user + '&api_key=' + this.api_key + '&format=json';

        var self = this;
        $.ajax(recent_tracks_url, {
            type: 'GET',
            dataType: 'jsonp',
            success: function (response) {
                recent_photos = response.data;
                for (i=0; i < recent_tracks.length; i++) {
                    album_art_url = recent_tracks[i]['image'][3]['#text'];
                    if (album_art_url) {
                        album_art_url = album_art_url.replace('300x300','_');
                        slabs.push(new Slab(album_art_url));
                    }
                }
                // Emit readable
            }
        });
    };

    return LastFmStream;
});
