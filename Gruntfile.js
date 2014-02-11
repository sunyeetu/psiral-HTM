/*global module:false*/
module.exports = function(grunt) {
    var sources = [
        'js/howlerAudio.js',
        'js/globals.js',
        'js/l10n.js',
        'js/game.js',
        'js/map.js',
        'js/gamemaster.js',
        'js/resources.js',
        'js/scenes/splash.js',
        'js/scenes/menu.js',
        'js/scenes/menu_hud.js',
        'js/scenes/play.js',
        'js/scenes/play_hud.js',
        'js/entities/gfx.js',
        'js/entities/board.js',
        'js/entities/wizards.js'
    ];

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        /**
         * Combine all sources into one big js chunk
         */
        concat: {
            dist: {
                src: sources,
                dest: 'build/<%= pkg.name %>-<%= pkg.version %>.js'
            }
        },
        /**
         * Put version info, lib names & urchin in production index.html
         */
        replace: {
            dist: {
                options: {
                    patterns: [
                        {
                            match: 'VERSION',
                            replacement: '<%= pkg.version %>',
                            expression: false  // simple variable lookup
                        },
                        {
                            match: 'MINIFIED',
                            replacement: '<%= pkg.name %>-min.js',
                            expression: false 
                        },
                        {
                            match: 'TITLE',
                            replacement: '<%= pkg.description %>',
                            expression: false 
                        },
                        {
                            match: 'URCHIN',
                            replacement: '<%= grunt.file.read("urchin") %>',
                            expression: false
                        },
                        {
                            match: /isDebug:\strue/g,
                            replacement: 'isDebug: false',
                            expression: true
                        },                        
                    ]
                },                
                files: [
                    {expand: true, flatten: true, src: ['build/index.html', '<%= concat.dist.dest %>'], dest: 'build/'}
                ]
            }
        },
        /**
         * Rules of how to minify & obfuscate game sources
         */
        uglify: {
            options: {
                report: 'min',
                preserveComments: false
            },
            dist: {
                files: {
                    'build/<%= pkg.name %>-min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        cssmin: {
            minify: {
                expand: true,
                cwd: 'build/css/',
                src: ['*.css', '!*.min.css'],
                dest: 'build/css/',
                ext: '.min.css'
            }
        }, 
        /**
         * Specifies targets that prep. a release build
         */
        copy: {
            main: {
                files: [
                    {expand: true, src: ['assets/**'], dest: 'build/'},
                    {expand: true, src: ['css/*'], dest: 'build/'},
                    {expand: true, src: ['vendor/**'], dest: 'build/'},
                    {expand: true, src: ['favicon.ico'], dest: 'build/',  filter: 'isFile'},
                    {expand: true, src: ['index.php'], dest: 'build/',  filter: 'isFile'},
                    {expand: true, src: ['index-prod.html'], dest: 'build/index.html',  filter: 'isFile', 
                        rename: function(dest, src) {
                            return dest;
                        }
                    },
                    {expand: true, src: ['package.json'], dest: 'build/',  filter: 'isFile'},
                    {expand: true, src: ['.htaccess'], dest: 'build/',  filter: 'isFile'}
                ]
            }
        },
        /**
         * Clean-up of built/copied resources
         */
        clean: {
            dist: [
                'build/*'
            ],
            striplibs: [
                '<%= concat.dist.dest %>',
                'build/vendor/melonJS-0.9.11.js',
                'build/css/main.css',
            ]
        },
        /**
         * Bump version
         */
        bump: {
            options: {
                files: ['package.json'],
                updateConfigs: ['pkg'],
                commit: false,
                createTag: false,
                push: false
            }
        },
        /**
         * JSHint config
         */
        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },

            beforeConcat: {
                files: {
                    src: sources
                }
            }
        },

        nodewebkit: {
            options: {
                version: '0.8.4',
                build_dir: './webkitbuilds', // Where the build version of my node-webkit app is saved
                mac: false, // We want to build it for mac
                win: true, // We want to build it for win
                linux32: false, // We don't need linux32
                linux64: true // We don't need linux64
            },
            src: ['./build/**/*'] // Your node-wekit app
        },        
    });

    // Load JSHint task
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-node-webkit-builder');

    // Default task.
    // grunt.registerTask('default', ['bump:build', 'concat', 'copy', 'replace', 'uglify']);
    grunt.registerTask('default', ['bump:build', 'concat', 'copy', 'replace', 'uglify', 'cssmin', 'clean:striplibs']);
    grunt.registerTask('rls', ['default', 'nodewebkit']);
    grunt.registerTask('lint', ['jshint:beforeConcat']);
};