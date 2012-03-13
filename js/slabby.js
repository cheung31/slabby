$(document).ready(function(){
    slabby.pageSetup();
});

var slabby = {
    pageSetup: function(){
        slabby.$slab = $('.slabby:visible');
        slabby.$slider = null;
        slabby.$knob = null;

        slabby.setupSlider();
        slabby.setupKnob();
        slabby.setupKeyboard();
        slabby.setupMouse();

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
            $slabs,
            slabs_width;

        // set knob width based on num slabs
        $knob = $('#knob');

        $slabs = $('li.slab');
        slabs_width = $slabs.length * $slabs.eq(0).width();
        
        knob_width = (slabby.$slider.width() * $slabs.eq(0).width()) / slabs_width;
        $knob.css('width', knob_width);
        $knob._dragging = false;

        slabby.$knob = $knob;
    },


    setupKeyboard: function(){

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
