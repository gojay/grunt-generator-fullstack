# grunt-generator-fullstack

> Generate crud templates for angular-fullstack

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install gojay/grunt-generator-fullstack --save-dev
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
        },
        jade: false // use html template
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
  grunt.task.run(['generator_fullstack']);
});

```

#### Create templates

[sample generator templates](https://github.com/gojay/grunt-generator-fullstack/tree/master/generator)

## Run

By default use jade template

```js
grunt generator:example:name=name,required=true:name=price,type=number,required=true:name=description,input=textarea
```

Use html template

```js
grunt generator:example:name=name,required=true:name=price,type=number,required=true:name=description,input=textarea --html
```


template data:

```js
{
  moduleName: 'testApp',
  name: 'example',
  className: 'Example',
  path: 'app/example',
  jade: false,
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

Details:


```js
url: /clients
client 
  index ngTable
  form
     - name: name
       required: true
       input type: text (default)
     - name: price
       required: true
       input type: number
     - name: description
       input type: textarea
server    
  model:
     - name: name
       required: true
       type: String (default)
     - name: price
       type: Number
       required: true
     - name: description
       type: String (default)
  api: 
     GET /api/examples
     GET /api/examples/:id
     POST /api/examples
     PUT /api/examples/:id
     DELETE /api/examples/:id

```


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
- 0.1.0 - first version
