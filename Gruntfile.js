'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('scrollyeah.jquery.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    clean: {
      files: ['<%= pkg.name %>']
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      js: {
        src: ['src/<%= pkg.name %>.js'],
        dest: '<%= pkg.name %>/<%= pkg.name %>.js'
      },
      css: {
        src: ['<%= pkg.name %>/<%= pkg.name %>.css'],
        dest: '<%= pkg.name %>/<%= pkg.name %>.css'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      scrollyeah: {
        src: '<%= concat.js.dest %>',
        dest: '<%= pkg.name %>/<%= pkg.name %>.min.js'
      }
    },
    compass: {
      dev: {
        options: {
          sassDir: 'src',
          cssDir: '<%= pkg.name %>',
          outputStyle: 'expanded',
          environment: 'production',
          noLineComments: true,
          force: true
        }
      }
    },
    cssmin: {
      scrollyeah: {
        src: '<%= concat.css.dest %>',
        dest: '<%= pkg.name %>/<%= pkg.name %>.min.css'
      }
    },
    watch: {
      scrollyeah: {
        files: 'src/*',
        tasks: ['compass', 'concat']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', ['clean', 'compass', 'concat', 'uglify', 'cssmin']);

};
