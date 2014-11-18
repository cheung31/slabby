define(['jquery', 'slabby/stream', 'slabby/slab'],
function($, Stream, Slab) {
    var ProjectsStream = function(name, opts) {
        Stream.apply(this, arguments);
        this.name = name;
        this._items = [];
    };
    $.extend(ProjectsStream.prototype, Stream.prototype);

    ProjectsStream.prototype._startStream = function() {
        var projects = [
            {
                name: 'gridit',
                image_url: 'http://slabby.ryancheung.com/images/gridit.png',
                link: 'http://gridit.ca'
            },
            {
                name: 'tablets',
                image_url: 'http://slabby.ryancheung.com/images/tablets.png',
                link: 'http://ryancheung.com/tablets'
            },
            {
                name: 'ctrl-games',
                image_url: 'http://slabby.ryancheung.com/images/ctrl-games.png',
                link: 'http://ryancheung.com/games'
            }
        ];
        for (var i=0; i < projects.length; i++) {
            var project = projects[i];
            this._items.push(
                new Slab(project['image_url'], project['name'], {
                    link: project['link']
                })
            );
        }
        // Emit readable
        this.trigger('readable');
    };

    return ProjectsStream;
});
