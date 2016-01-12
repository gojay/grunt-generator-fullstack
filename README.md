# grunt-generator-fullstack

> Generator crud templates for angular-fullstack

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-generator-fullstack --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-generator-fullstack');
```

## The "generator" task

### Overview
In your project's Gruntfile, add a section named `generator_fullstack` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  generator_fullstack: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.moduleName
Type: `String`

Your angular module name

#### options.routes
Type: `Object`

Your fullstack routes file & pattern


### Usage Examples

#### Gruntfile.js

```js
grunt.initConfig({
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
  }
});

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

```

#### Create generator templates

[sample generator templates](https://github.com/gojay/grunt-generator-fullstack/tree/master/generator)

## Run

```js
grunt generator:example:name=name,required=true:name=price,type=number,required=true:name=description,input=textarea
```

data

```js
{
  moduleName: 'testApp',
  name: 'example',
  fields:[ 
    { 
      name: 'name',
      title: 'Name',
      required: 'true',
      type: 'String',
      input: 'text' 
    },
    { name: 'price',
      title: 'Price',
      type: 'Number',
      input: 'number',
      required: 'true' 
    },
    { 
      name: 'description',
      title: 'Description',
      input: 'textarea',
      type: 'String' 
    } 
  ]
}
```


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
- 0.1.0 - first version
