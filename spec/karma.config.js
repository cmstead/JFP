module.exports = function(config){
    config.set({
        basePath: '',

        frameworks: ['jasmine'],

        reporters: ['progress', 'coverage'],

        browsers: ['PhantomJS'],

        files: [
            '../scripts/src/jfp.js',
            '../scripts/src/modules/core/core.js',
            '../scripts/src/modules/core/array.js',
            '../scripts/src/modules/predicate.js',
            '../scripts/src/modules/convert.js',
            '../scripts/src/modules/array.js',
            '../scripts/src/modules/object.js',
            '../scripts/src/modules/composite.js',
            '../scripts/src/jfp.expose.js',
            './**/*.spec.js'
        ],

        preprocessors: {
            '../scripts/src/modules/*.js': ['coverage']
        },

        coverageReporter: {
            type: 'text-summary'
        },

        colors: true,

        autoWatch: false,
        singleRun: true
    });


}