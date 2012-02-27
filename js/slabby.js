$(document).ready(function(){
    slabby.pageSetup();
});

var slabby = {
    pageSetup: function(){
        slabby.$slab = $('.slabby:visible');

        slabby.setupSlider();
    },

    setupSlider: function(){
        var $slider;

        // center slider
        $slider = $('#slider');
        $slider.css('margin-left', (-1*($slider.width()/2))+'px');

        // set knob width based on num slabs
        $('#knob', $slider).css('width', slabby.$slab.width() / $('.slab').length);
    }
};
