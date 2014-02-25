/*global module:false*/

var path = require('path');
var util = require('util');
var isWindows = process.env.OS && process.env.OS.indexOf("Windows") != -1;

module.exports = function(grunt) {
    var sources = [
        'js/howlerAudio.js',
        'js/common/globals.js',
        'js/common/l10n.js',
        'js/game.js',
        'js/backbone/map.js',
        'js/backbone/gamemaster.js',
        'js/resources.js',
        'js/scenes/splash.js',
        'js/scenes/menu.js',
        'js/scenes/play.js',
        'js/hud/menu.js',
        'js/hud/play.js',
        'js/entities/animations.js',
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
                    {expand: true, src: ['icon.png'], dest: 'build/',  filter: 'isFile'},
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
        /**
         * Create node-webkit based Desktop distros
         */
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
        aconv: {
            options: {
                ffmpegLib: isWindows ? 'libvo_aacenc' : 'libfdk_aac',
                outFormat: '.m4a'
            },
            files: [
                {src: 'assets/sfx/*.ogg', dest: 'build/assets/sfx', overwrite: true},
                {src: 'assets/muzik/*.ogg', dest: 'build/assets/muzik', overwrite: true}
            ]
        }
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
    grunt.registerTask('web', ['default', 'aconv']);
    grunt.registerTask('lint', ['jshint:beforeConcat']);

    // test
    grunt.registerTask('ac', ['aconv']);

    /**
     * Custom tasks
     */
    
    grunt.registerMultiTask('aconv', 'Convert audio files using ffmpeg', function() {
        var ffmpeg = grunt.config('aconv.options.ffmpeg') || 'ffmpeg';
        var ffmpeg_lib = grunt.config('aconv.options.ffmpegLib');
        var outFormat = grunt.config('aconv.options.outFormat');
        var files = grunt.config('aconv.files');

        // Force task into async mode and grab a handle to the "done" function.
        var done = this.async();
        var exec = [];

        for(var i = 0; i < files.length; i++) {
            var o = files[i];
            
            grunt.log.writeln('Converting files in %s to %s format ...', o.src, outFormat);

            grunt.file.expand(o.src).forEach(function (file) {
                var overwrite = o.overwrite === false ? '-n' : '-y';
                var cmd = util.format('%s %s -i %s -c:a %s %s/%s%s',
                    ffmpeg, overwrite, file, ffmpeg_lib, o.dest, path.basename(file, path.extname(file)), outFormat);
                // grunt.log.writeln(cmd);
                exec.push(cmd);
            });
        }

        require('child_process').exec(exec.join(' && ')).on('exit', function () {
            done(true);
        });
    });    
};