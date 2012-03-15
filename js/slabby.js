$(document).ready(function(){
    slabby.pageSetup();
});

var slabby = {
    pageSetup: function(){
        slabby.page = 0;
        slabby.$slab = $('ul.slabby:visible');
        slabby.$slabs = $('li', slabby.$slab);
        slabby.$slider = null;
        slabby.$knob = null;

        slabby.setupSlider();
        slabby.setupKnob();
        slabby.setupKeyboard();
        //slabby.setupMouse();

        $(window).resize(function(){
            slabby.$slider = null;
            slabby.setupSlider();
        });
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
        console.log(slabby.$slider.width() - $knob.width());
        slabby.$knob.knob_increment = (slabby.$slider.width()-$knob.width()) / ($slabs.length-1);
        console.log(slabby.$knob.knob_increment);
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
            new_margin;
       
        new_margin = -272 * (page+1);
        if (new_margin <= -272){
            $centered = $('li.centered');
            $centered.animate({'margin-left': '10px',
                              'margin-right': '10px'},
                              65,
                              'linear');
            $centered.removeClass('centered');

            slabby.$slab.animate({'margin-left': new_margin+'px'},
                                 65,
                                 'linear');
        }

        // shift knob relative to page
        slabby.$knob.animate({'left': slabby.$knob.knob_increment * slabby.page+'px'}, 65, 'linear');
    },


    focusSlab: function(page){
        if (!slabby._jumping){
            $new_centered = slabby.$slabs.eq(page);
            $new_centered.animate({'margin-left': '145px',
                                   'margin-right': '145px'},
                                  110);
            $new_centered.addClass('centered');
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
