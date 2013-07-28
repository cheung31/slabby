define(['jquery', 'slabby/stream', 'slabby/slab'],
function($, Stream, Slab) {
    var LastFmStream = function(name, opts) {
        Stream.apply(this, arguments);
        this.name = name;
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
                var recent_tracks = response.recenttracks.track;
                for (i=0; i < recent_tracks.length; i++) {
                    var album_art_url = recent_tracks[i]['image'][3]['#text'];
                    if (!album_art_url) {
                        continue;
                    }
                    album_art_url = album_art_url.replace('300x300','_');
                    self._items.push(new Slab(album_art_url));
                }
                // Emit readable
                self.trigger('readable');
            }
        });
    };

    return LastFmStream;
});
