/*
 * Normalized hide address bar for iOS & Android
 * (c) Scott Jehl, scottjehl.com
 * MIT License
 */
(function( win ){
 var doc = win.document;

 // If there's a hash, or addEventListener is undefined, stop here
 if( !location.hash && win.addEventListener ){

 //scroll to 1
 window.scrollTo( 0, 1 );
 var scrollTop = 1,
 getScrollTop = function(){
 return win.pageYOffset || doc.compatMode === "CSS1Compat" && doc.documentElement.scrollTop || doc.body.scrollTop || 0;
 },

 //reset to 0 on bodyready, if needed
 bodycheck = setInterval(function(){
     if( doc.body ){
     clearInterval( bodycheck );
     scrollTop = getScrollTop();
     win.scrollTo( 0, scrollTop === 1 ? 0 : 1 );
     }   
     }, 15 );

win.addEventListener( "load", function(){
        setTimeout(function(){
            //at load, if user hasn't scrolled more than 20 or so...
            if( getScrollTop() < 20 ){
            //reset to hide addr bar at onload
            win.scrollTo( 0, scrollTop === 1 ? 0 : 1 );
            }
            }, 0);
        } );
 }
})( this );

var _s = {
    Router : Backbone.Router.extend({
        routes: {
            '*actions': 'defaultRoute'
        },

        defaultRoute: function (target_action) {
            if (target_action == 'tunes') {
                Slabby.setupTunes(function () {
                    Slabby.showSlab(target_action);
                });
            }
            else if (target_action == 'photos' || target_action == '') {
                Slabby.setupPhotos(function () {
                    Slabby.showSlab(target_action);
                });
            }
            else {
                Slabby.showSlab(target_action);
            }
        }
    })
};

$(document).ready(function () {
    var i,
        $slabbies,
        slab,
        $nav_links,
        $current_link,
        $target_link,
        _router;

    $slabbies = $('#projects, #tweets, #about');
    for (i=0; i < $slabbies.length; i++) {
        slab = new Slabby($slabbies.eq(i));
        _s[slab.$slabby_div.attr('id')] = slab;
        slab.setup();
    }

    _s['_router'] = new _s.Router;
    Backbone.history.start();
});


////////////////////////
// Slab
function Slab(image_url, id) {
    this.image_url = image_url;
    if (id)
        this.id = id;
}


////////////////////////
// Slabby
function Slabby(slabby_div) {
    this.$slabby_div = $(slabby_div)
    this.page = 0;
    this.$slab = $('.slabby', this.$slabby_div);
    this.$slabs = $('.slab', this.$slab);
    this.$slider = $('.slider', this.$slabby_div);
    this.$knob = $('.knob', this.$slider);
    this.$focused_slab = $('#focused_slab', this.$slabby_div);
};

Slabby.showSlab = function (target_action) {
        var $current_link,
            $target_link,
            current_action;
        target_action = target_action ? target_action : 'photos';
        $target_link = $('a[href$='+target_action+']', '#nav_links');

        $current_link = $('a', '.selected');
        if ($current_link.length) {
            current_action = $current_link.attr('href').substring(2);
            

            $current_link.parent().removeClass('selected');
            if (_s[current_action] !== undefined && current_action != target_action) {
                _s[current_action].deactivate();
            }
        }

        $target_link.parent().addClass('selected');
        if (_s[target_action] !== undefined) {
            _s[target_action].activate();
        }

        $('title').html('recently. ' + target_action + '.');
    };

Slabby.setupPhotos = function (callback) {
    var i,
        slabs = [],
        slab,
        recent_photos_url = 'https://api.instagram.com/v1/users/13865411/media/recent/?access_token=13865411.8167e48.b43836f60d6d4d53a28b996418e31d17',
        recent_photos;

    if (_s['photos']) {
        if (callback)
            callback();
        return;
    }

    $.ajax(recent_photos_url, {
        type: 'GET',
        dataType: 'jsonp',
        success: function (response) {
            recent_photos = response.data;
            for (i=0; i < recent_photos.length; i++) {
                var image_url = recent_photos[i]['images']['standard_resolution']['url'];
                var image_id = recent_photos[i]['id'];
                if (image_url) {
                    slabs.push(new Slab(image_url,
                                        image_id));
                }
            }

            Slabby.buildSlabs(slabs, 'photos');
            slab = new Slabby($('#photos'));
            _s[slab.$slabby_div.attr('id')] = slab;
            slab.setup();
            if (callback) {
                callback();
            }
        }
    });
};

Slabby.setupTunes = function (callback) {
    var i,
        slabs = [],
        slab,
        recent_tracks_url = 'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=cheung31&api_key=9bea97674bc0b61b9d6807055313155e&format=json',
        recent_tracks,
        album_art_url;

    if (_s['tunes']) {
        if (callback)
            callback();
        return;
    }

    $.ajax(recent_tracks_url, {
         type: 'GET',
         dataType: 'json',
         success: function (data) {
            recent_tracks = data.recenttracks.track;
            for (i=0; i < recent_tracks.length; i++) {
                album_art_url = recent_tracks[i]['image'][3]['#text'];
                if (album_art_url) {
                    album_art_url = album_art_url.replace('300x300','_');
                    slabs.push(new Slab(album_art_url));
                }
            }

            Slabby.buildSlabs(slabs, 'tunes');
            slab = new Slabby($('#tunes'));
            _s[slab.$slabby_div.attr('id')] = slab;
            slab.setup();
            if (callback) {
                callback();
            }
         }
    });
};

Slabby.buildSlabs = function (slabs, slabby_name) {
    var i;
    for (i=0; i < slabs.length; i++) {
       Slabby.appendSlab(slabs[i], slabby_name);
    }
};

Slabby.appendSlab = function (slab, slabby_name) {
    var html = '<div ';
    if (slab.id)
        html += 'id="' + slab.id + '" ';
    html += 'class="slab" style=""><div class="focused_frame"><img class="full_photo" src="' + slab.image_url + '">';
    html += '<div class="thumb"><svg xmlns:svg="http://www.w3.org/2000/svg" version="1.1" baseProfile="full"><defs xmlns="http://www.w3.org/2000/svg"><filter id="gaussian_blur"><feGaussianBlur in="SourceGraphic" stdDeviation="4"></feGaussianBlur></filter></defs><image x="7" y="7" width="235" height="235" xlink:href="' + slab.image_url + '" style="filter:url(#gaussian_blur)"></image></svg>';
    html += '</div></div></div>';
    $('.slabby', '#'+slabby_name).append(html);
};

Slabby.prototype = {
    setup:  function () {
        var _slabby = this;
        this.setupSlider();
        this.setupKnob();
        this.setupKeyboard();
        this.setupPaging();

        $(window).resize(function () {
            _slabby.$slider = $('.slider', _slabby.$slabby_div);
            _slabby.setupSlider();
        });
    },

    setupSlider: function () {
        // center slider
        this.$slider.css('margin-left', (-1*(this.$slider.width()/2))+'px');
    },


    setupKnob: function () {
        var knob_width,
            slabs_width;

        // set knob width based on num slabs
        slabs_width = this.$slabs.length * this.$slabs.eq(0).width();
        
        knob_width = (this.$slider.width() * this.$slabs.eq(0).width()) / slabs_width;
        this.$knob.css('width', knob_width);
        this.$knob._dragging = false;

        this.$knob.knob_increment = (this.$slider.width()-this.$knob.width()) / (this.$slabs.length-1);
    },

    setupKeyboard: function () {
        var _slabby = this;
        $(document).keydown(function (e) {
            if(!_slabby.isActive())
                return;

            if (e.which == 39) {
                if(_slabby.page < _slabby.$slabs.length-1) {
                    _slabby._jumping = true;
                    _slabby.page += 1;
                    _slabby.jumpPage(_slabby.page);
                } else {
                    _slabby._jumping = false;
                }
            } else if (e.which == 37 && _slabby.page > 0) {
                _slabby._jumping = true;
                _slabby.page -= 1;
                if(_slabby.page>=0)
                    _slabby.jumpPage(_slabby.page);
            } else {
                _slabby._jumping = false;
            }
        });
    },

    setupMouse: function () {
        var _slabby = this;
        // setup draggable knob
        this.$knob.mousedown(function (e) {
            //console.log('mousedown');
            _slabby.zoomOutFocused();
            _slabby.$knob._dragging = true;
            _slabby.$knob._mouseOffset = [e.pageX, e.pageY];
        });
        $(window).mousemove(function (e) {
            var d,
                knob_left,
                knob_min_left,
                knob_max_left;
            if (!_slabby.$knob._dragging)
                return;

            knob_min_left = _slabby.$slider.offset().left;
            knob_max_left = _slabby.$slider.width() - _slabby.$knob.width();

            d = e.pageX - _slabby.$knob._mouseOffset[0];
            knob_left = parseInt(_slabby.$knob.css('left')) || 0;
            if (knob_left >= 0 && knob_left <= knob_max_left) {
                if (knob_left + d > 0 && knob_left <= knob_max_left)
                    _slabby.$knob.css('left', d);
            } else {
                return;
            }
        });
        $(window).mouseup(function (e) {
            //console.log('mouseup');
            _slabby.$knob._dragging = false;
        });
    },

    setupPaging: function () {
        var i,
            _slabby;
        _slabby = this;
        for (i=0; i < this.$slabs.length; i++) {
            this.$slabs[i].onclick = (function (index) {
                return function () {
                    if(!_slabby.isActive())
                        return;
                    if (index == _slabby.page)
                        return;
                    _slabby._jumping = true;
                    _slabby.page = index;
                    _slabby.jumpPage(index);
                };
            })(i);
        }
    },

    isActive: function () {
        if(this.$slabby_div.hasClass('active'))
            return true;
        return false;
    },
    
    jumpPage: function (page, callback) {
        var i,
            $centered,
            $focused_frame,
            new_margin;
       
        new_margin = -272 * (page+1) - 10;
        if (new_margin <= -272) {
            // Shift slab strip
            this.$slab.animate({'margin-left': new_margin+'px'},
                                 200,
                                 'linear');

            this.zoomOutFocused();
        }
        this._jumping = false;
        this.focusSlab(this.page);
        //var image_id = $('.centered', '.active').attr('id');
        //if (image_id)
        //    _s['_router'].navigate('/'+ this.$slabby_div.attr('id') + '/' + image_id);

        // shift knob relative to page
        this.$knob.animate({'left': this.$knob.knob_increment * this.page+'px'}, 200, 'linear');

        if (callback)
            callback();
    },

    focusSlab: function (page) {
        var $new_centered,
            $focused_frame;

        if (!this._jumping) {
            $new_centered = this.$slabs.eq(page);
            $new_centered.animate({'margin-left': '160px',
                                   'margin-right': '145px'},
                                  20);

            $focused_frame = $('.focused_frame', $new_centered);
            $focused_frame.animate({'width': '612px',
                                    'height': '612px',
                                    'margin-left': '-188px',
                                    'margin-top': '-211px'},
                                   200,
                                   'linear');
            $('.full_photo', $focused_frame).animate({'z-index': '10'},
                                                     20,
                                                     'linear',
                                                     function () {
                                                         $new_centered.addClass('centered');
                                                         $('.ext_link', $focused_frame).css({'display': 'block'});
                                                     });
        }
    },

    zoomOutFocused: function () {
        var $centered;

        $centered = $('.centered');
        $centered.animate({'margin-left': '10px',
                           'margin-right': '10px'},
                          20,
                          'linear');

        $focused_frame = $('.focused_frame', $centered);
        $focused_frame.animate({'width': '252px',
                                'height': '252px',
                                'margin-left': '0px',
                                'margin-top': '0px'},
                               200,
                               'linear');
        $('.full_photo', $focused_frame).animate({'z-index': '0'},
                                                200,
                                                'linear',
                                                function () {
                                                    $centered.removeClass('centered');
                                                    $('.ext_link', $focused_frame).hide();
                                                });
    },

    deactivate: function () {
        var _slabby = this;
        _slabby.$slabby_div.fadeOut(500, function () {
            _slabby.$slabby_div.removeClass('active').addClass('inactive');
        });
    },

    activate: function () {
        var _slabby = this;
        _slabby.$slabby_div.fadeIn(500, function () {
            _slabby.$slabby_div.addClass('active');
            _slabby.jumpPage(_slabby.page);
        });
    }
};

