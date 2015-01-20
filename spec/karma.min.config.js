module.exports = function(config){
    var karmaConfig = require('./karma.config.json');
    
    karmaConfig.files = [
        '../dist/jfp.min.js',
        './**/*.spec.js'
    ];
    
    karmaConfig.preprocessors = {
        '../dist/jfp.min.js': ["coverage"]
    };
    
    config.set(karmaConfig);
}