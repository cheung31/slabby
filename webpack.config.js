var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: path.join(__dirname, 'src/main.js'),
    output: {
        path: __dirname + '/dist/',
        filename: "bundle.js"
    },
    plugins:  [
        // this chunks the commonly used modules.
        //new webpack.optimize.CommonsChunkPlugin({
        //    name: 'common',
        //    filename: 'common.js',
        //    chunks: [
        //    ]
        //}),
        // This replaces shim stuff in RequireJS. 
        //new webpack.ProvidePlugin({
        //    $: "jquery",
        //    jQuery: "jquery",
        //    "window.jQuery": "jquery",
        //    "root.jQuery": "jquery"
        //})
    ],
    module: {
        loaders: [
            { test: /\.(html|mustache)$/, loader: 'mustache' },
            { test: /\.css$/, loader: "style!css" }
        ]
    },
    resolve: {
        root: path.join(__dirname, 'src'),
        modulesDirectories: ['public/js', 'node_modules'],
        alias: {
            'jquery': path.join(__dirname, 'lib/jquery/dist/jquery'),
            'text': path.join(__dirname, 'lib/requirejs-text/text'),
            'hgn': path.join(__dirname, 'lib/requirejs-hogan-plugin/hogan'),
            'hogan': path.join(__dirname, 'lib/hogan/web/builds/2.0.0/hogan-2.0.0.amd'),
            'underscore': path.join(__dirname, 'lib/underscore-amd/underscore'),
            'eventEmitter': path.join(__dirname, 'lib/eventEmitter/EventEmitter'),
            'slabby': path.join(__dirname, 'src')
        }
    }
};

