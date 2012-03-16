$(document).ready(function(){
    slabby.setup();
});

var slabby = {
    setup: function(){
        slabby.page = 0;
        slabby.$slab = $('.slabby:visible');
        slabby.$slabs = $('.slab', slabby.$slab);
        slabby.$slider = null;
        slabby.$knob = null;
        slabby.$focused_slab = $('#focused_slab');

        slabby.setupSlider();
        slabby.setupKnob();
        slabby.setupKeyboard();
        slabby.setupPaging();
        //slabby.setupMouse();
        //slabby.loadContent();

        $(window).resize(function(){
            slabby.$slider = null;
            slabby.setupSlider();
        });

        //slabby.focusSlab(0);
    },


    loadContent: function(){
        return;
    },


    updateSlabs: function(data){
        return;
    },

    setupSlider: function(){
        var $slider;

        // center slider
        $slider = $('#slider');
        $slider.css('margin-left', (-1*($slider.width()/2))+'px');
        slabby.$slider = $slider;
    },

    setupKnob: function(){
        var $knob,
            knob_width,
            slabs_width;

        // set knob width based on num slabs
        $knob = $('#knob');

        $slabs = slabby.$slabs;
        slabs_width = $slabs.length * $slabs.eq(0).width();
        
        knob_width = (slabby.$slider.width() * $slabs.eq(0).width()) / slabs_width;
        $knob.css('width', knob_width);
        $knob._dragging = false;

        slabby.$knob = $knob;
        slabby.$knob.knob_increment = (slabby.$slider.width()-$knob.width()) / ($slabs.length-1);
    },

    setupKeyboard: function(){ 
        $(document).keydown(function(e){
            if (e.which == 39){
                if(slabby.page < slabby.$slabs.length-1) {
                    slabby._jumping = true;
                    slabby.page += 1;
                    slabby.jumpPage(slabby.page, 1);
                } else {
                    slabby._jumping = false;
                }
            } else if (e.which == 37 && slabby.page > 0){
                slabby._jumping = true;
                slabby.page -= 1;
                if(slabby.page>=0)
                    slabby.jumpPage(slabby.page, 0);
            } else {
                slabby._jumping = false;
            }
        });
        $(document).keyup(function(e){
            if (e.which == 39 || e.which == 37)
                slabby._jumping = false;
            slabby.focusSlab(slabby.page);
        });
    },


    jumpPage: function(page, forward){
        var i,
            $centered,
            $focused_frame,
            new_margin;
       
        new_margin = -272 * (page+1);
        if (new_margin <= -272){
            $centered = $('.centered');
            $centered.animate({'margin-left': '10px',
                               'margin-right': '10px'},
                              200,
                              'linear');

            // If forward, shrink and blur
            $focused_frame = $('.focused_frame', $centered);
            $focused_frame.animate({'width': '250px',
                                    'height': '250px',
                                    'margin-left': '0px',
                                    'margin-top': '0px'},
                                   200,
                                   'linear');
            $('.full_photo', $focused_frame).animate({'z-index': '0',
                                                     'opacity': '0'},
                                                    200,
                                                    'linear');
            $('.thumb', $focused_frame).show();
            $centered.removeClass('centered');

            // Shift slab strip
            slabby.$slab.animate({'margin-left': new_margin+'px'},
                                 200,
                                 'linear');
        }

        // shift knob relative to page
        slabby.$knob.animate({'left': slabby.$knob.knob_increment * slabby.page+'px'}, 200, 'linear');
        slabby._jumping = false;
    },


    focusSlab: function(page){
        var $new_centered,
            $focused_frame;

        if (!slabby._jumping){
            $new_centered = slabby.$slabs.eq(page);
            $new_centered.animate({'margin-left': '160px',
                                   'margin-right': '145px'},
                                  20);
            $new_centered.addClass('centered');

            $focused_frame = $('.focused_frame', $new_centered);
            $focused_frame.animate({'width': '612px',
                                    'height': '612px',
                                    'margin-left': '-188px',
                                    'margin-top': '-211px'},
                                   200,
                                   'linear');
            $('.full_photo', $focused_frame).show().css('opacity','1').animate({'z-index': '10'},
                                                                                200,
                                                                                'linear');
            $('.thumb', $focused_frame).hide();
        }
    },


    setupPaging: function(){
        for(var i=0; i < slabby.$slabs.length; i++){
            slabby.$slabs[i].onclick = (function(index){
                return function() {
                    var forward;
                    if (index == slabby.page)
                        return;
                    slabby._jumping = true;
                    if (index > slabby.page)
                        forward = 1;
                    else if (index < slabby.page)
                        forward = 0;
                    slabby.page = index;
                    slabby.jumpPage(index, forward);
                    slabby.focusSlab(slabby.page);
                };
            })(i);
        }
    },


    setupMouse: function(){
        // setup draggable knob
        slabby.$knob.mousedown(function(e){
            //console.log('mousedown');
            slabby.$knob._dragging = true;
            slabby.$knob._mouseOffset = [e.pageX, e.pageY];
        });
        $(window).mousemove(function(e){
            var d,
                knob_left,
                knob_min_left,
                knob_max_left;
            if (!slabby.$knob._dragging)
                return;

            knob_min_left = slabby.$slider.offset().left;
            knob_max_left = slabby.$slider.width() - slabby.$knob.width();

            d = e.pageX - slabby.$knob._mouseOffset[0];
            knob_left = parseInt(slabby.$knob.css('left')) || 0;
            if (knob_left >= 0 && knob_left <= knob_max_left) {
                if (knob_left + d > 0 && knob_left <= knob_max_left)
                    slabby.$knob.css('left', d);
            } else {
                return;
            }
        });
        $(window).mouseup(function(e){
            //console.log('mouseup');
            slabby.$knob._dragging = false;
        });
    }
};
