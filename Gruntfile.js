var cleanConfig = require('./grunt/clean.json'),
    concatConfig = require('./grunt/concat.json'),
    copyConfig = require('./grunt/copy.json'),
    jsdocConfig = require('./grunt/jsdoc.json'),
    jshintConfig = require('./grunt/jshint.json'),
    karmaConfig = require('./grunt/karma.json'),
    uglifyConfig = require('./grunt/uglify.json');

module.exports = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: cleanConfig,
        concat: concatConfig,
        copy: copyConfig,
        jsdoc : jsdocConfig,
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
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-karma');

    /* Register composite grunt tasks */

    grunt.registerTask('test', ['jshint', 'karma']);
    grunt.registerTask('document', ['jsdoc']);

    grunt.registerTask('buildjs', ['uglify']);
    grunt.registerTask('build', ['clean', 'test', 'buildjs', 'document']);

    grunt.registerTask('default', ['test']);
};
