module.exports = function(config){
    config.set({
        basePath: '',

        frameworks: ['jasmine'],

        reporters: ['progress', 'coverage'],

        browsers: ['PhantomJS'],

        files: [
            '../src/jisp.js',
            'jisp.spec.js'
        ],

        preprocessors: {
            '../src/jisp.js': ['coverage']
        },

        coverageReporter: {
            type: 'text-summary'
        },

        colors: true,

        autoWatch: true,
        singleRun: false
    });


}