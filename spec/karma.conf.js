module.exports = function(config){
    config.set({
        basePath: '',

        frameworks: ['jasmine'],

        reporters: ['progress', 'coverage'],

        browsers: ['PhantomJS'],

        files: [
            '../src/jfp.js',
            'jfp.spec.js'
        ],

        preprocessors: {
            '../src/jfp.js': ['coverage']
        },

        coverageReporter: {
            type: 'text-summary'
        },

        colors: true,

        autoWatch: true,
        singleRun: false
    });


}