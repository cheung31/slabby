$(document).ready(function(){
    slabby.pageSetup();
});

var slabby = {
    pageSetup: function(){
        slabby.$slab = $('.slabby:visible');

        slabby.setupSlider();
        slabby.setupKnob();
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
        console.log(slabs_width);
        
        knob_width = (slabby.$slider.width() * $slabs.eq(0).width()) / slabs_width;
        $knob.css('width', knob_width);
        slabby.$knob = $knob;
    }
};
