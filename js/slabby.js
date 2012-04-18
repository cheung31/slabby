var _s = {
    _router : Backbone.Router.extend({
        routes: {
            '*actions': 'defaultRoute'
        },

        defaultRoute: function (target_action) {
            var $current_link,
                $target_link,
                current_action;

            $('.active').removeClass('active').addClass('inactive').hide();
            target_action = target_action ? target_action : 'photos';
            console.log(target_action);

            $current_link = $('a', '.selected');
            current_action = $current_link.attr('href').substring(2);
            console.log(current_action);
            $target_link = $('a[href$='+target_action+']', '#nav_links');
            

            $current_link.parent().removeClass('selected');
            console.log(_s[current_action]);
            if (_s[current_action] !== undefined && current_action != target_action) {
                _s[current_action].deactivate();
            }

            $target_link.parent().addClass('selected');
            console.log(_s[target_action]);
            if (_s[target_action] !== undefined) {
                _s[target_action].activate();
            }

            $('title').html('recently. ' + target_action + '.');
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

    Slabby.setupTunes();
    $slabbies = $('#photos, #projects, #tweets');
    for (i=0; i < $slabbies.length; i++) {
        slab = new Slabby($slabbies.eq(i));
        _s[slab.$slabby_div.attr('id')] = slab;
        slab.setup();
    }

    _router = new _s._router;
    Backbone.history.start();
});


////////////////////////
// Slab
function Slab(image_url) {
    this.image_url = image_url;
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

Slabby.setupTunes = function () {
        var i,
            slabs = [],
            slab,
            recent_tracks_url = 'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=cheung31&api_key=b25b959554ed76058ac220b7b2e0a026&format=json',
            recent_tracks,
            album_art_url;

        $.ajax(recent_tracks_url, {
             type: 'GET',
             dataType: 'json',
             success: function (data) {
                 recent_tracks = data.recenttracks.track;
                 for (i=0; i < recent_tracks.length; i++) {
                     album_art_url = recent_tracks[i]['image'][3]['#text'];
                     if (album_art_url) {
                         slabs.push(new Slab(album_art_url));
                     }
                 }

                 Slabby.buildSlabs(slabs);
                 slab = new Slabby($('#tunes'));
                 _s[slab.$slabby_div.attr('id')] = slab;
                 slab.setup();
             }
        });
    };

Slabby.buildSlabs = function (slabs) {
        var i;
        for (i=0; i < slabs.length; i++) {
           Slabby.appendSlab(slabs[i]);
        }
    };

Slabby.appendSlab = function (slab) {
        var html = '<div class="slab" style=""><div class="focused_frame"><img class="full_photo" src="' + slab.image_url + '">';
        html += '<div class="thumb"><svg xmlns:svg="http://www.w3.org/2000/svg" version="1.1" baseProfile="full"><defs xmlns="http://www.w3.org/2000/svg"><filter id="gaussian_blur"><feGaussianBlur in="SourceGraphic" stdDeviation="4"></feGaussianBlur></filter></defs><image x="7" y="7" width="235" height="235" xlink:href="' + slab.image_url + '" style="filter:url(#gaussian_blur)"></image></svg>';
        html += '</div></div></div>';

        $('.slabby', '#tunes').append(html);
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
       
        new_margin = -272 * (page+1);
        if (new_margin <= -272) {
            // Shift slab strip
            this.$slab.animate({'margin-left': new_margin+'px'},
                                 200,
                                 'linear');

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
        }
        this._jumping = false;
        this.focusSlab(this.page);

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

