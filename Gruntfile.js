module.exports = function(grunt){
    grunt.initConfig({
        karma: {
            unit: {
                configFile: './spec/karma.conf.js'
            }
        },
        jsdoc : {
            dist : {
                src: ['src/*.js', 'test/*.js'],
                dest: 'doc'
            }
        }
    });

    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('test', ['karma']);
    grunt.registerTask('document', ['jsdoc']);
}