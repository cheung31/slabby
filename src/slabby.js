define(['jquery', 'backbone', 'slabby/view', 'lodash.throttle'],
function($, Backbone, View, throttle) {
    var Slabby = function(el, title, opts) {
        this.$el = $(el);
        this.title = title;
        this._streams = opts.streams || [];
        this._views = {};
        this._router = opts.router || this._setupRouter();
        this.renderDelay = opts.renderDelay;
        this.render();
        this.setupKeyboard();
    };

    Slabby.prototype._setupRouter = function() {
        return new Backbone.Router;
    };

    Slabby.prototype.addStream = function(stream) {
        this._streams.push(stream);

        var $navItemEl = $('<li><a href="#/' + stream.name + '">' + stream.name + '</a></li>');
        this.$navEl.append($navItemEl);

        var self = this;
        function startStream(stream) {
            if (stream.started) {
                var view = self._views[stream.name];
                self.showStream(stream, view);
                return;
            }
            var view = new View(self.$el, stream, {
                renderDelay: self.renderDelay
            });
            self.showStream(stream, view);
            self._views[stream.name] = view;
        };

        // Immediately start the first stream that is added
        if (this._streams.length == 1) {
            this._router.route('', 'blah', function() { startStream(self._streams[0]) });
        }
        // Add a route for each additional stream
        this._router.route(stream.name, stream.name, function() { startStream(stream) });
    };


    Slabby.prototype.showStream = function (stream, view) {
        var $current_link,
            $target_link;
        $target_link = $('a[href$='+stream.name+']', '#nav_links');

        $current_link = $('a', '.selected');
        if ($current_link.length) {
            $current_link.parent().removeClass('selected');
        }
        $target_link.parent().addClass('selected');

        // Deactivate active view
        var activeView = this.getActiveView();
        if (activeView) {
            activeView.deactivate();
        }
        // Activate target view
        if (stream.started) {
            view.activate();
        }

        // Update title
        $('title').html('recently. ' + stream.name + '.');
    };

    Slabby.prototype.render = function() {
        // Navigation
        this.$navEl = $('<ul id="nav_links"></ul');
        this.$el.append(this.$navEl); 

        // Title
        var $titleEl = $('<li id="title">' + this.title + '</li>');
        this.$navEl.append($titleEl);
        $('title').html(this.title);

        // Focused slab
        this.$focusedSlab = $('<div id="focused_slab"></div>');
        this.$el.append(this.$focusedSlab);

        // This is kind of gross
        var self = this;
        $(window).resize(function (e) {
            for (var streamName in self._views) {
                var view = self._views[streamName];
                view.setupSlider();
            }
        });
    };

    Slabby.prototype.start = function() {
        Backbone.history.start();
    };

    Slabby.prototype.getActiveView = function() {
        for (var streamName in this._views) {
            if (this._views[streamName].isActive()) {
                return this._views[streamName];
            }
        }
    };

    Slabby.prototype.setupKeyboard = function () {
        var self = this;
        $(document).keydown(throttle(function (e) {
            var activeView = self.getActiveView();
            if (e.which == 39) {
                if(activeView.page < activeView.getSlabs().length-1) {
                    activeView._jumping = true;
                    activeView.page += 1;
                    activeView.jumpPage(activeView.page);
                } else {
                    activeView._jumping = false;
                }
            } else if (e.which == 37 && activeView.page > 0) {
                activeView._jumping = true;
                activeView.page -= 1;
                if(activeView.page>=0)
                    activeView.jumpPage(activeView.page);
            } else {
                activeView._jumping = false;
            }
        }, 200));
    };

    return Slabby;
});
