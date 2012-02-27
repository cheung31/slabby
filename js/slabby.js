$(document).ready(function(){
    slabby.pageSetup();
});

var slabby = {
    pageSetup: function(){
        slabby.setupSlider();
    },

    setupSlider: function(){
        var $slider;

        $slider = $('#slider');
        $slider.css('margin-left', (-1*($slider.width()/2))+'px');
    }
};
