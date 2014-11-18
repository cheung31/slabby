({
  mainConfigFile: 'requirejs.conf.js',
  baseUrl: '.',
  name: "slabby",
  out: "slabby.min.js",
  paths: {
    almond: 'lib/almond/almond'
  },
  include: [
    'almond'
  ],
  stubModules: ['text', 'hgn'],
  namespace: 'Slabby',
  pragmasOnSave: {
    excludeHogan: true
  },
  preserveLicenseComments: false,
  optimize: 'uglify2',
  uglify2: {
    compress: {
      unsafe: true
    },
    mangle: true
  }
})
