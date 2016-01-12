/*
 * grunt-generator-fullstack
 * https://github.com/gojay/grunt-generator-fullstack
 *
 * Copyright (c) 2016 Gojay
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('lodash');

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
      generator: ['client', 'server/api']
    },

    // Configuration to be run (and then tested).
    generator_fullstack: {
      default: {
        options: {
          moduleName: 'testApp',
          routes: {
            file: 'server/routes.js',
            pattern: '// Insert routes below'
          }
        },
        files: {
          'client/app': ['generator/client/app/**'],
          'client/components': ['generator/client/components/**'],
          'server/api': ['generator/server/api/**']
        }
      }
    },

    // Unit tests.
    // nodeunit: {
    //   tests: ['test/*_test.js']
    // }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'generator_fullstack']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'generator_fullstack']);

  // grunt generator:example:name=name,required=true:name=price,type=number,required=true:name=description,input=textarea
  grunt.registerTask('generator', function (target, options) {
    var args = Array.prototype.slice.call(arguments);

    grunt.config.merge({
      generator_fullstack: {
        default: {
          options: { 
            args: args 
          }
        }
      }
    });
    
    grunt.task.run(['clean', 'generator_fullstack']);
  });

};
