'use strict';

var fs = require('fs');
var path = require('path');
var util = require('util');
var chalk = require('chalk');
var maxmin = require('maxmin');
var luamin = require('luamin');

module.exports = function(grunt) {
  
  var getAvailableFiles = function(filesArray) {
    return filesArray.filter(function(filepath) {
      if (!grunt.file.exists(filepath)) {
        grunt.log.warn('Source file '+chalk.cyan(filepath)+' not found');
        return false;
      }
      return true;
    });
  };
  
  grunt.registerMultiTask('luamin', 'Minify LUA', function() {
    var created = {
      files: 0
    };
    
    var size = {
      before: 0,
      after: 0
    };
    
    this.files.forEach(function(file) {
      
      var availableFiles = getAvailableFiles(file.src);
      var compiled = '';
      
      try {
        compiled = luamin.minify(grunt.file.read(availableFiles));
        
        var compiledLuaString = compiled;
        var unCompiledLuaString = availableFiles.map(function(f) {
          return grunt.file.read(f);
        }).join('');
        
        size.before += unCompiledLuaString.length;
        size.after += compiledLuaString.length;
        
        grunt.file.write(file.dest, compiledLuaString);
        created.files++;
        
      } catch (err) {
        grunt.log.error(err);
        grunt.warn('LUA minification failed at ' + availableFiles + '.');
      }
    }, this);
    
    if (created.files > 0) {
      grunt.log.ok(created.files+' '+grunt.util.pluralize(this.files.length, 'file/files')+' created. '+chalk.dim(maxmin(size.before, size.after)));
    } else {
      grunt.log.warn('No files created.');
    }
  });
};
