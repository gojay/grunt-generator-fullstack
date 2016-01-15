/*
 * grunt-generator-fullstack
 * https://github.com/User/grunt-generator-fullstack
 *
 * Copyright (c) 2016 Gojay
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('lodash');

var gruntTextReplace = require('../lib/grunt-text-replace');

function Generator(options) {
  this.typeData = ['string', 'number', 'date', 'boolean'];
  this.errors = [];

  this.options = options;
  if(!options.args || !_.isArray(options.args)) {
    grunt.log.warn('options args undefined or not an Array!');
    return false;
  }
  this.options.name = options.args.shift();
  this.options.className = _.capitalize(_.camelCase(this.options.name));
  this.options.path = 'app/'+ this.options.name;
  // build fields
  this.options.fields = this.buildFields();
  var dateField = _.find(this.options.fields, 'type', 'Date');
  this.options.hasDate = dateField ? dateField.name : null ;
  var selectField = _.find(this.options.fields, 'input', 'select');
  this.options.selectOptions = selectField ? selectField.options : [] ;
};

Generator.prototype.buildFields = function (dest, files) {
  var self = this;
  var fields = this.options.args.filter(function (field) {
    if(/type=select/.test(field) && !/options/.test(field)) {
      self.errors.push({
        str: field,
        message: 'options (separated by \'/\') required for SELECT!'
      });
      return false;
    }
    return true;
  }).map(function (field) {
    field = field.toLowerCase();
    if(!/type=/.test(field)) {
      field += ',type=string';
    } 
    return field.split(',').reduce(function(obj, item) {
      var split = item.split('=');
      var key = split[0];
      var value = split[1];

      switch(key) {
        case 'name':
          obj[key] = value;
          obj['title'] = _.startCase(value);
          break;
        case 'type':
          var type = self.typeData.indexOf(value) > -1 ? value : 'String';
          obj['type'] = obj.model.type = _.startCase(type);
          switch(type) {
            case 'number':
              obj['input'] = 'number';
              // obj.test.post = [obj.name, 10];
              // obj.test.put = [obj.name, 20];
              break;
            case 'date':
              obj['input'] = 'date';
              // obj.test.post = [obj.name, new Date()];
              // var tomorrow = new Date();
              // tomorrow.setDate(tomorrow.getDate() + 1);
              // obj.test.put = [obj.name, tomorrow];
              break;
            case 'boolean':
              obj['input'] = 'radio';
              obj['options'] = [{
                title: 'Yes',
                value: true
              }, {
                title: 'No',
                value: false
              }];
              // obj.test.post = [obj.name, true];
              // obj.test.put = [obj.name, false];
              break;
            default:
            case 'string':
              if(!obj.hasOwnProperty('input')) {
                obj['input'] = 'text';
              }
              // obj.test.post = [obj.name, 'new '+ obj.name];
              // obj.test.put = [obj.name, 'updated '+ obj.name];
              break;
          }
          break;
        case 'options':
          obj.model.enum = value.split('/');
          obj[key] = value.split('/').map(function(v) {
            return {
              title: _.startCase(v),
              value: v
            }
          });
          break;
        default:
          obj[key] = value;
          break;
      }

      if(obj.required === 'true') {
        obj.model['required'] = true;
      }
      if(obj.default) {
        if(obj.default === 'true') 
          obj.default = true;
        else if(obj.default === 'false') 
          obj.default = false;

        obj.model['default'] = obj.default;
      }

      obj.schemaType = JSON.stringify(obj.model).replace(/\"([^(\")"]+)\":/g,"$1:");
      return obj;
    }, { model: {}/*, test: { post: [], put: [] }*/ });
  });
  return fields;
};
Generator.prototype.buildFiles = function (dest, files) {
  var prefix = 'generator/'+ dest;
  var replaceObj = {
    temp: this.options.name
  };
  replaceObj[prefix] = this.options.unprefixDest.indexOf(dest) > -1 ? dest : dest + '/' + this.options.name;

  return _.reduce(files, function (obj, file) {
    var regex = new RegExp(prefix+'|temp', 'gi');
    var dest = file.replace(regex, function(matched){
      return replaceObj[matched];
    });
    obj[_.trimLeft(dest, '/')] = file;
    return obj;
  }, {});
};

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  var extensions = {
    jade: ['css', 'js', 'jade'],
    html: ['css', 'js', 'html']
  };

  grunt.registerMultiTask('generator_fullstack', 'Generator crud templates for angular-fullstack', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    
    // default, jade template
    var options = this.options({
      unprefixDest: [],
      jade: grunt.option('html') === true ? false : true,
      skip: []
    });

    var g = new Generator(options);
    // grunt.log.writeln('options', JSON.stringify(g.options, null, 2));

    if(g.errors.length) {
      g.errors.forEach(function (e) {
        grunt.log.warn(e.message);
      });
      return false;
    }

    // routes.js
    if(g.options.routes) {
      if(!grunt.file.exists(g.options.routes.file)) {
        grunt.log.warn('Route file "' + g.options.routes.file + '" not found.');
        return false;
      }
      
      if(g.options.routes.pattern) {
        var appRoute = "app.use('/api/"+ g.options.name +"s', require('./api/"+ g.options.name +"'));"
        gruntTextReplace.replace({
          src: g.options.routes.file,
          overwrite: true,
          replacements: [{
            from: appRoute,
            to: ''
          },{
            from: g.options.routes.pattern,
            to: function(match) {
              return match + "\n\t" + appRoute
            }
          }]
        });
      } 
      else {
        grunt.log.warn('Route pattern undefined. skip!');
      }
    }

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      })
      // filter is file
      .filter(function(filepath) {
        return grunt.file.isFile(filepath) && options.skip.indexOf(f.dest) == -1;
      })
      // filter jade/html
      .filter(function(filepath) {
        var ext = options.jade ? extensions.jade : extensions.html;
        var regexExt = new RegExp('.('+ ext.join("|") +')$', 'i');
        return regexExt.test(filepath);
      });

      // console.log(f.dest, JSON.stringify(src, null, 2));

      if (!src.length) {
        grunt.log.warn(
          'Destination `' + f.dest +
          '` not written because `src` files were empty or skipped.'
        );
      }

      var files = g.buildFiles(f.dest, src);

      _.forEach(files, function (src, dest) {
        var template = grunt.file.read(src);
        var result = grunt.template.process(template, { data: g.options });
        // Write the destination file
        grunt.file.write(dest, result);
        // Print a success message
        grunt.log.writeln('File `' + dest + '` created.');
      });
    });
  });

};
