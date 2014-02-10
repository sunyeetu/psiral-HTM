/*global module:false*/
module.exports = function(grunt) {

    src: ['Gruntfile.js', 'js/*.js', 'vendor/plugins/holwerAudio.js'],

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // TODO
    });

    // JSHint
    grunt.initConfig({
        jshint: {
          src: ['Gruntfile.js', 'js/*.js', 'vendor/plugins/holwerAudio.js'],
          options: {
            curly: true,
            eqeqeq: true,
            immed: true,
            latedef: true,
            newcap: true,
            noarg: true,
            sub: true,
            undef: true,
            boss: true,
            eqnull: true,
            browser: true,
            globals: {
              require: true,
              define: true,
              requirejs: true,
              describe: true,
              expect: true,
              it: true
            }
          }
        }
    });

    // Load JSHint task
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-replace');    

    // Default task.
    grunt.registerTask('default', ['']);
    grunt.registerTask('lint', ['jshint']);
};