define(['jquery', 'backbone', 'slabby/view'],
function($, Backbone, View) {
    var Slabby = function(el, opts) {
        this.$el = $(el);
        this._streams = opts.streams || [];
        this._views = [];
        this._router = opts.router || this._setupRouter();
        this.renderDelay = opts.renderDelay;
        this.render();
    };

    Slabby.prototype._setupRouter = function() {
        var router = Backbone.Router.extend({
            routes: {
                '': 'defaultAction'
            },

            defaultAction: function() {}
        });
        return new router;
    };

    Slabby.prototype.addStream = function(stream) {
        this._streams.push(stream);
        if (this._streams.length == 1) {
            this._router.route('*all', 'default', startStream);
        }

        var self = this;
        function startStream() {
            var active = self._views.length ? false : true;
            var view = new View(self.$el, stream, {
                active: active,
                renderDelay: self.renderDelay
            });
            self._views.push(view);
        };
        this._router.route('/'+stream.name, stream.name, startStream);
    };

    Slabby.prototype.render = function() {
        // Navigation
        var $navEl = $('<ul id="nav_links"></ul');
        this.$el.append($navEl); 

        // Title
        var $titleEl = $('<li id="title">' + this.title + '</li>');
        $navEl.append($titleEl);
        $('title').html(this.title);

        // Focused slab
        this.$focusedSlab = $('<div id="focused_slab"></div>');
        this.$el.append(this.$focusedSlab);

        // This is kind of gross
        var self = this;
        $(window).resize(function (e) {
            for (var i=0; i < self._views.length; i++) {
                var view = self._views[i];
                view.setupSlider();
            }
        });
    };

    Slabby.prototype.start = function() {
        Backbone.history.start();
    };

    Slabby.prototype.getActiveView = function() {
        for (var i=0; i < this._views.length; i++) {
            if (this._views[i].isActive()) {
                return this._views[i];
            }
        }
    };

    Slabby.prototype.setupKeyboard = function () {
        var self = this;
        var activeView = self.getActiveView();
        $(document).keydown($.throttle(200, function (e) {
            if (e.which == 39) {
                if(activeView.page < activeView.getSlabs().length-1) {
                    activeView._jumping = true;
                    activeView.page += 1;
                    activeView.jumpPage(activeView.page);
                } else {
                    activeView._jumping = false;
                }
            } else if (e.which == 37 && _slabby.page > 0) {
                activeView._jumping = true;
                activeView.page -= 1;
                if(activeView.page>=0)
                    activeView.jumpPage(activeView.page);
            } else {
                activeView._jumping = false;
            }
        }));
    };

    return Slabby;
});


/*
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

};
*/
