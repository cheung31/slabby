define(['slabby/slabby', 'slabby/streams/projects', 'slabby/streams/lastfm'],
function(Slabby, ProjectsStream, LastFmStream) {
    var containerEl = document.getElementById('slabby');
    var title = 'recently.';
    var slabby = new Slabby(containerEl, title, {
        renderDelay: 250
    });
    slabby.addStream(
        new LastFmStream('tunes', {
            api_key: '9bea97674bc0b61b9d6807055313155e',
            user: 'cheung31'
        })
    );
    slabby.addStream(
        new ProjectsStream('projects')
    );
    slabby.start();
});
