'use strict';
const chalk = require('chalk');
const maxmin = require('maxmin');
const luamin = require('luamin');

module.exports = function(grunt) {
  
  const getAvailableFiles = (filesArray) => {
    return filesArray.filter((filepath) => {
      if (!grunt.file.exists(filepath)) {
        grunt.log.warn(`Source file ${chalk.cyan(filepath)} not found`);
        return false;
      }
      return true;
    });
  };
  
  grunt.registerMultiTask('luamin', 'Minify LUA', function() {
    const created = { files: 0 };
    const size = { before: 0, after: 0 };
    
    this.files.forEach((file) => {
      const availableFiles = getAvailableFiles(file.src);
      
      try {
        const compiled = luamin.minify(grunt.file.read(availableFiles));
        
        const compiledLuaString = compiled;
        const unCompiledLuaString = availableFiles.reduce((acc, f) => `${acc}${grunt.file.read(f)}`, '');
        
        size.before += unCompiledLuaString.length;
        size.after += compiledLuaString.length;
        
        grunt.file.write(file.dest, compiledLuaString);
        created.files += 1;
        
      } catch (err) {
        grunt.log.error(err);
        grunt.warn(`LUA minification failed at ${availableFiles}.`);
      }
    }, this);
    
    if (created.files > 0) {
      grunt.log.ok(`${created.files} ${grunt.util.pluralize(this.files.length, 'file/files')} created. ${chalk.dim(maxmin(size.before, size.after))}`);
    } else {
      grunt.log.warn('No files created.');
    }
  });
};
