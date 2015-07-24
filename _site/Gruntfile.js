module.exports = function(grunt){
    var cleanConfig = require('./grunt/clean.json'),
        compassConfig = require('./grunt/compass.json'),
        concatConfig = require('./grunt/concat.json'),
        devserverConfig = require('./grunt/devserver'),
        jshintConfig = require('./grunt/jshint.json'),
        ngAnnotateConfig = require('./grunt/ngannotate.json'),
        uglifyConfig = require('./grunt/uglify.json');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: cleanConfig,
        compass: compassConfig,
        concat: concatConfig,
        devserver: devserverConfig,
        jshint: jshintConfig,
        ngAnnotate: ngAnnotateConfig,
        uglify: uglifyConfig
    });

    /* Load grunt task adapters */
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-devserver');
    grunt.loadNpmTasks('grunt-ng-annotate');

    /* Register composite grunt tasks */
    grunt.registerTask('run', ['devserver']);
    grunt.registerTask('test', ['jshint']);
    grunt.registerTask('build', ['clean', 'test', 'compass', 'ngAnnotate', 'uglify', 'concat']);

    grunt.registerTask('default', ['test']);
};