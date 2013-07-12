define(['jquery', 'hgn!slabby/templates/slabby'],
function($, SlabbyViewTemplate) {
    var View = function(el, stream, opts) {
        this.$containerEl = $(el);
        this.active = opts.active || false;
        this.renderDelay = opts.renderDelay || 0;
        this._stream = stream;
        this._rendered = false;

        this.page = 0;
        this.count = 0;
        this._jumping = false;

        var self = this;
        if (this.active && !this._rendered) {
            self.render();
        }
        this._stream.on('readable', function() {
            self.render();
        });
    };

    View.prototype.getSlabs = function() {
        return $('.slab', this.$slab);
    }

    View.prototype.setupSlider = function () {
        // center slider
        this.$slider.css('margin-left', (-1*(this.$slider.width()/2))+'px');
        this.setupKnob();
    };

    View.prototype.setupKnob = function() {
        var knob_width,
            slabs_width;

        // set knob width based on num slabs
        var $slabs = this.getSlabs();
        slabs_width = $slabs.length * $slabs.eq(0).width();
        
        knob_width = (this.$slider.width() * $slabs.eq(0).width()) / slabs_width;
        this.$knob.css('width', knob_width);
        this.$knob._dragging = false;

        this.$knob.knob_increment = (this.$slider.width()-this.$knob.width()) / ($slabs.length-1);
    };

    View.prototype.render = function() {
        if (!this._rendered) {
            this.$el = $(SlabbyViewTemplate({ name: this._stream.name }));
            this.$slab = $('.slabby', this.$el);
            this.$slider = $('.slider', this.$el);
            this.$knob = $('.knob', this.$slider);
            this.$containerEl.append(this.$el);
            this.setupSlider();
            this._rendered = true;
        }

        // LOAD CONTENT
        if (this.active && !this._stream.started) {
            this._stream.start();
            this.activate();
        }
        while (slab = this._stream.read()) {
            var $slabEl = slab.render();
            this.$slab.append($slabEl);
            this.setupSlider();

            // Attach jump handler on slab
            $slabEl.on('click', function(e) {
                (function(index) {
                    if (!this.isActive() || index == this.page) {
                        return;
                    }
                    this._jumping = true;
                    this.page = index;
                    this.jumpPage(index);
                })(this.count - 1);
            });
        }
    };

    View.prototype.isActive = function () {
        if(this.$el.hasClass('active'))
            return true;
        return false;
    };
    
    View.prototype.jumpPage = function(page, callback) {
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
    };
    
    View.prototype.focusSlab = function(page) {
        var $new_centered,
            $focused_frame;

        if (!this._jumping) {
            $new_centered = this.getSlabs().eq(page);
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
    };

    View.prototype.zoomOutFocused = function () {
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
    };


    View.prototype.deactivate = function () {
        this.$el.fadeOut(500, function () {
            $el.removeClass('active').addClass('inactive');
        });
    };

    View.prototype.activate = function () {
        var self = this;
        this.$el.fadeIn(500, function () {
            self.$el.addClass('active');
            self.jumpPage(self.page);
        });
    };

    return View;
});
