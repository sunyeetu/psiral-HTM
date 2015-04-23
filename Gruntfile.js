/*global module:false*/

var path = require('path')
  , util = require('util')
  , isWindows = process.env.OS && process.env.OS.indexOf("Windows") != -1;

var sources = [
    'js/howlerAudio.js',
    'js/common/globals.js',
    'js/common/l10n.js',
    'js/common/persistence.js',
    'js/game.js',
    'js/backbone/map.js',
    'js/backbone/gamemaster.js',
    'js/resources.js',
    'js/scenes/splash.js',
    'js/scenes/menu.js',
    'js/scenes/play.js',
    'js/hud/widgets.js',
    'js/hud/menu.js',
    'js/hud/play.js',
    'js/entities/animations.js',
    'js/entities/board.js',
    'js/entities/wizards.js'
];

module.exports = function(grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

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
                            match: /isDebug:\strue/g,
                            replacement: 'isDebug: false',
                            expression: true
                        },                        
                    ]
                },                
                files: [
                    {expand: true, flatten: true, src: ['build/index.html', '<%= concat.dist.dest %>'], dest: 'build/'},
                    {expand: true, flatten: true, src: ['build/bootstrap.js', 'bootstrap.js'], dest: 'build/'}
                ]
            },
            urchin: {
                options: {
                    patterns: [
                        {
                            match: 'URCHIN',
                            replacement: '<%= grunt.file.read("urchin") %>',
                            expression: false
                        }
                    ]
                },                
                files: [
                    {expand: true, flatten: true, src: ['build/index.html', '<%= concat.dist.dest %>'], dest: 'build/'}
                ]                
            },
            nourchin: {
                options: {
                    patterns: [
                        {
                            match: 'URCHIN',
                            replacement: '',
                            expression: false
                        }
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
                preserveComments: false,
                banner: '<%= grunt.file.read("header.txt") %>'
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
                    {expand: true, src: ['libs/**'], dest: 'build/'},
                    {expand: true, src: ['js/bootstrap.js'], dest: 'build/', flatten: true},
                    {expand: true, src: ['favicon.ico'], dest: 'build/', filter: 'isFile'},
                    {expand: true, src: ['index.php'], dest: 'build/', filter: 'isFile'},
                    {expand: true, src: ['index-prod.html'], dest: 'build/index.html', filter: 'isFile', 
                        rename: function(dest, src) {
                            return dest;
                        }
                    },
                    // {expand: true, src: ['package.json'], dest: 'build/',  filter: 'isFile'},
                    {expand: true, src: ['icon_16.png', 'icon_48.png', 'icon_128.png'], dest: 'build/', filter: 'isFile'},
                    {expand: true, src: ['manifest.json'], dest: 'build/',  filter: 'isFile'}
                ]
            },
            crx: {
                files: [
                    {expand: true, src: ['js/chrome.js'], dest: 'build/', flatten: true},
                ]
            },
            desktop: {
                files: [
                    {expand: true, src: ['package.json'], dest: 'build/', flatten: true},
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
                'build/libs/melonJS-0.9.11.js',
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
                mac: true, // We want to build it for mac
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
    grunt.registerTask('build', ['clean:dist', 'lint', 'bump:build', 'concat', 'copy', 'replace:dist', 'uglify', 'cssmin', 'clean:striplibs']);
    grunt.registerTask('desktop', ['build', 'copy:desktop', 'nodewebkit']);
    grunt.registerTask('web', ['build', 'replace:urchin', 'aconv']);
    grunt.registerTask('crx', ['build', 'replace:nourchin', 'copy:crx', 'aconv']);
    grunt.registerTask('lint', ['jshint:beforeConcat']);
    grunt.registerTask('default', ['build']);
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

        require('child_process').exec(exec.join(' && '), function (error, stdout, stderr) {
            console.log(stdout);
            console.error(stderr);
        }).on('exit', function () {
            done(true);
        });
    });    
};