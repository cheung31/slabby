define([], function() {

    function cssFiltersSupported() {
        var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
        var el = document.createElement('div');
        el.style.cssText = prefixes.join('filter:blur(2px); ');
        return !!el.style.length && ((document.documentMode === undefined || document.documentMode > 9));
    }

    var Slab = function(image_url, image_id, opts) {
        this._image_url = image_url;
        this._image_id = image_id;
        this._link = opts.link;
    };

    Slab.prototype.render = function() {
        var $slabEl = $('<div class="slab"></div>');
        if (this.id) {
            $slabEl.attr('id', this.id);
        }

        var html = '<div class="focused_frame"><img class="full_photo" src="' + this._image_url + '">';
        if (this._link) {
            html += '<a href="' + this._link + '" class="ext_link" target="_blank"></a>';
        }
        if (cssFiltersSupported()) {
            html += '<div class="thumb"><div class="css-blur" style="background-image:url(' + this._image_url + ');"></div>';
        } else {
            html += '<div class="thumb"><svg xmlns:svg="http://www.w3.org/2000/svg" version="1.1" baseProfile="full"><defs xmlns="http://www.w3.org/2000/svg"><filter id="gaussian_blur"><feGaussianBlur in="SourceGraphic" stdDeviation="4"></feGaussianBlur></filter></defs><image x="7" y="7" width="235" height="235" xlink:href="' + this._image_url + '" style="filter:url(#gaussian_blur)"></image></svg>';
        }
        html += '</div></div>';

        $slabEl.append($(html));
        return $slabEl;
    };

    return Slab;
});
