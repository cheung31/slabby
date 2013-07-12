define(['jquery', 'slabby/stream', 'slabby/slab'],
function($, Stream, Slab) {
    var ProjectsStream = function(name, opts) {
        Stream.apply(this, arguments);
        this.name = name;
        this._items = [];
    };
    $.extend(ProjectsStream.prototype, Stream.prototype);

    ProjectsStream.prototype.start = function() {
        this.started = true;
        var projects = [
            {
                name: 'gridit',
                image_url: 'http://slabby.ryancheung.com/images/gridit.png'
            },
            {
                name: 'tablets',
                image_url: 'http://slabby.ryancheung.com/images/tablets.png'
            },
            {
                name: 'ctrl-games',
                image_url: 'http://slabby.ryancheung.com/images/ctrl-games.png'
            }
        ];
        for (var i=0; i < projects.length; i++) {
            this._items.push(
                new Slab(projects[i]['image_url'], projects[i]['name'])
            );
        }
        // Emit readable
        self.trigger('readable');
    };

    return ProjectsStream;
});
