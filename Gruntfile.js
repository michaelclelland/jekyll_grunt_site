module.exports = function(grunt) {

  // Load all NPM grunt tasks
  require('matchdep').filterAll('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    meta: {
      scripts: [
        'js/**/*.js'
      ],
      styles: [
        'less/**/*.less',
        'css/**/*.css'
      ]
    },

    browserify: {
      debug: {
        src: ['js/*.js'],
        dest: 'debug/main.js',
        options: {
          debug: true
        }
      },
      build: {
        src: ['js/main.js'],
        dest: 'build/main.js'
      }
    },

    less: {
      debug: {
        options: {
          paths: ["./less"],
          yuicompress: false
        },
        files: {
          "./css/compiled.less.css": "./less/manifest.less"
        }
      },
      build: {
        options: {
          paths: ["./less"],
          yuicompress: true
        },
        files: {
          "./css/compiled.less.css": "./less/manifest.less"
        }
      }
    },

    // Concatenate files
    concat: {
      debug: {
        files: {
          'debug/style.css': ['css/*.css']
        }
      },
      build: {
        files: {
          'build/style.css': ['css/*.css']
        }
      }
    },

    // Minify CSS files
    cssmin: {
      build: {
        files: {
          'build/style.min.css': ['build/style.css']
        }
      }
    },

    uglify: {
      build: {
        files: {
          'build/main.min.js': ['build/main.js'] 
        }
      }
    },

    // Watch files for changes
    watch: {
      scripts: {
        files: ['<%= meta.scripts %>'],
        tasks: ['browserify:debug']
      },
      styles: {
        files: ['<%= meta.styles %>'],
        tasks: ['less','concat:debug']
      }
    },

    // Clean target directories
    clean: {
      debug: ['debug'],
      buildTemp: [
        'build/main.css',
        'build/style.css',
        'build/app.js'
      ],
      all: ['debug', 'build']
    },

     // Run Jekyll commands
    jekyll: {
      server: {
        options: {
          serve: true,
          // Add the --watch flag, i.e. rebuild on file changes
          watch: true
        }
      },
      build: {
        options: {
          serve: false
        }
      }
    }

  });

  grunt.registerTask('debug', function() {
    grunt.task.run([
      'clean:debug',
      'browserify:debug',
      'less:debug',
      'concat:debug'
    ]);
    grunt.task.run('watch');
  });

  grunt.registerTask('server', 'jekyll:server');

  // Run Jekyll build with environment set to production
  grunt.registerTask('jekyll-production', function() {
    grunt.log.writeln('Setting environment variable JEKYLL_ENV=production');
    process.env.JEKYLL_ENV = 'production';
    grunt.task.run('jekyll:build');
  });

  grunt.registerTask('build', function() {
    grunt.task.run([
      'clean:all',
      'browserify:build',
      'less:build',
      'concat:build',
      'cssmin',
      'uglify',
      'clean:buildTemp',
      'jekyll-production'
    ]);
    grunt.task.run('watch');
  });

  // Default task(s).
  grunt.registerTask('default', ['debug']);

}