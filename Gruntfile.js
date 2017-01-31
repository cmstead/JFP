var cleanConfig = require('./grunt/clean.json'),
    concatConfig = require('./grunt/concat.json'),
    copyConfig = require('./grunt/copy.json'),
    jasmine = require('./grunt/jasmine.json'),
    uglifyConfig = require('./grunt/uglify.json'),
    
    testRuntimes = require('./spec/test-runtimes');

module.exports = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: cleanConfig,
        concat: concatConfig,
        copy: copyConfig,
        jasmine_nodejs: jasmine,
        uglify: uglifyConfig
    });

    /* Load grunt task adapters */

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-jasmine-nodejs');

    /* Register composite grunt tasks */

    grunt.registerTask('build-only', ['clean', 'concat', 'uglify']);
    grunt.registerTask('test', ['build-only', 'jasmine_nodejs']);
    grunt.registerTask('test-runtimes', testRuntimes);
    grunt.registerTask('build', ['test', 'copy:nuget']);

    grunt.registerTask('default', ['build']);
};
