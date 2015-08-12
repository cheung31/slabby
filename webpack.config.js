var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './src/slabby.js',
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
        new webpack.ProvidePlugin({
            React: "react/addons",
            $: "jquery",
            jQuery: "jquery",
            "windows.jQuery": "jquery"
        })
    ],
    module: {
        loaders: [
            { test: /jquery/, loader: 'exports?$' },
            { test: /jquery-throttle-debounce/, loader: 'exports?$!imports?jquery' },
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
            'backbone': path.join(__dirname, 'lib/backbone-amd/backbone'),
            'underscore': path.join(__dirname, 'lib/underscore-amd/underscore'),
            'jquery-throttle-debounce': path.join(__dirname, 'lib/jquery-throttle-debounce/jquery.ba-throttle-debounce'),
            'eventEmitter': path.join(__dirname, 'lib/eventEmitter/EventEmitter'),
            'slabby': path.join(__dirname, 'src')
        }
    }
};

