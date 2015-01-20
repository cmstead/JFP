var cleanConfig = require('./grunt/clean.json'),
    concatConfig = require('./grunt/concat.json'),
    copyConfig = require('./grunt/copy.json'),
    jshintConfig = require('./grunt/jshint.json'),
    karmaConfig = require('./grunt/karma.json'),
    uglifyConfig = require('./grunt/uglify.json');

module.exports = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: cleanConfig,
        concat: concatConfig,
        copy: copyConfig,
        jshint: jshintConfig,
        karma: karmaConfig,
        uglify: uglifyConfig
    });

    /* Load grunt task adapters */

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-karma');

    /* Register composite grunt tasks */

    grunt.registerTask('test', ['jshint', 'karma:dev']);
    grunt.registerTask('test-concat', ['karma:concat']);
    grunt.registerTask('test-min', ['karma:min']);
    grunt.registerTask('test-build', ['karma:concat', 'karma:min']);

    grunt.registerTask('buildjs', ['concat', 'uglify']);
    grunt.registerTask('build', ['clean', 'test', 'buildjs', 'copy', 'test-build']);

    grunt.registerTask('default', ['test']);
};
