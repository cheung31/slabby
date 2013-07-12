define(['slabby/slabby', 'slabby/streams/instagram', 'slabby/streams/projects', 'slabby/streams/lastfm'],
function(Slabby, InstagramStream, ProjectsStream, LastFmStream) {
    var containerEl = document.getElementById('slabby');
    var title = 'recently.';
    var slabby = new Slabby(containerEl, title, {
        renderDelay: 250
    });
    slabby.addStream(
        new InstagramStream('photos', {
            access_token: '13865411.8167e48.b43836f60d6d4d53a28b996418e31d17',
            user_id: '13865411'
        })
    );
    slabby.addStream(
        new ProjectsStream('projects')
    );
    slabby.addStream(
        new LastFmStream('tunes', {
            api_key: '9bea97674bc0b61b9d6807055313155e',
            user: 'cheung31'
        })
    );
    slabby.start();
});
