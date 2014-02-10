/*global module:false*/
module.exports = function(grunt) {

    // src: ['Gruntfile.js', 'js/*.js', 'vendor/plugins/holwerAudio.js'],
    var sources = [
        'js/globals.js',
        'js/l10n.js',
        'js/map.js',
        'js/gamemaster.js',
        'js/game.js',
        'js/resources.js',
        'js/scenes/splash.js',
        'js/scenes/menu_hud.js',
        'js/scenes/menu.js',
        'js/scenes/play_hud.js',
        'js/scenes/play.js',
        'js/entities/gfx.js',
        'js/entities/board.js',
        'js/entities/wizards.js'
    ];

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            dist: {
                src: sources,
                dest: 'build/<%= pkg.name %>-<%= pkg.version %>.js'
            }
        },

        uglify: {
            options: {
                report: 'min',
                preserveComments: false
            },
            dist: {
                files:{
                    'build/<%= pkg.name %>-<%= pkg.version %>-min.js': ['<%= concat.dist.dest %>']
                }
            }
        },

        // TODO

        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },

            beforeConcat: {
                files: {
                    src: sources
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
    grunt.registerTask('default', ['concat', 'uglify']);
    grunt.registerTask('lint', ['jshint:beforeConcat']);
};