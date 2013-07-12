require.config({
    baseUrl: "/",
    paths: {
        jquery: 'lib/jquery/jquery',
        text: 'lib/requirejs-text/text',
        hgn: 'lib/requirejs-hogan-plugin/hgn',
        hogan: 'lib/hogan/web/builds/2.0.0/hogan-2.0.0.amd',
        backbone: 'lib/backbone-amd/backbone',
        underscore: 'lib/underscore-amd/underscore',
        'jquery-throttle-debounce': 'lib/jquery-throttle-debounce/jquery.ba-throttle-debounce',
        eventEmitter: 'lib/eventEmitter/EventEmitter'
    },
    shim: {
        jquery: {
            exports: '$'
        },
        'jquery-throttle-debounce': {
            deps: ['jquery']
        }
    }
});
