# **grunt-contrib-luamin**

Minify lua scripts with grunt.

## **Installation**

To install this package, use `npm install --save-dev grunt-contrib-luamin`.

## **Gruntfile.js**

``` {.javascript filename="Gruntfile.js"}
module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-luamin');

  grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
    luamin: {
			dist: {
				files: {
          'src/example.lua': ['dist/example.lua'],
        },
      },
    },
  });

  grunt.registerTask('default', ['luamin:dist']);
};
```