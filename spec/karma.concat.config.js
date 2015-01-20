module.exports = function(config){
    var karmaConfig = require('./karma.config.json');
    
    karmaConfig.files = [
        '../dist/jfp.js',
        './**/*.spec.js'
    ];
    
    karmaConfig.preprocessors = {
        '../dist/jfp.js': ["coverage"]
    };
    
    config.set(karmaConfig);
}