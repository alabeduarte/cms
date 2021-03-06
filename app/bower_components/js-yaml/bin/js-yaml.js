#!/usr/bin/env node


'use strict';


// stdlib
var fs    = require('fs');


// 3rd-party
var argparse = require('argparse');


// internal
var yaml = require('..');


////////////////////////////////////////////////////////////////////////////////


var cli = new argparse.ArgumentParser({
  prog:     'js-yaml',
  version:  require('../package.json').version,
  addHelp:  true
});


cli.addArgument(['-c', '--compact'], {
  help:   'Display errors in compact mode',
  action: 'storeTrue'
});


// deprecated (not needed after we removed output colors)
// option suppressed, but not completely removed for compatibility
cli.addArgument(['-j', '--to-json'], {
  help:   argparse.Const.SUPPRESS,
  dest:   'json',
  action: 'storeTrue'
});


cli.addArgument(['-t', '--trace'], {
  help:   'Show stack trace on error',
  action: 'storeTrue'
});


cli.addArgument(['file'], {
  help:   'File to read, utf-8 encoded without BOM'
});


////////////////////////////////////////////////////////////////////////////////


var options = cli.parseArgs();


////////////////////////////////////////////////////////////////////////////////


fs.readFile(options.file, 'utf8', function (error, input) {
  var output, isYaml;

  if (error) {
    if ('ENOENT' === error.code) {
      console.error('File not found: ' + options.file);
      process.exit(2);
    }

    console.error(
      options.trace && error.stack ||
      error.message ||
      String(error));

    process.exit(1);
  }

  try {
    output = JSON.parse(input);
    isYaml = false;
  } catch (error) {
    if (error instanceof SyntaxError) {
      try {
        output = [];
        yaml.loadAll(input, function (doc) { output.push(doc); }, {});
        isYaml = true;

        if (0 === output.length) {
          output = null;
        } else if (1 === output.length) {
          output = output[0];
        }
      } catch (error) {
        if (options.trace && error.stack) {
          console.error(error.stack);
        } else {
          console.error(error.toString(options.compact));
        }

        process.exit(1);
      }
    } else {
      console.error(
        options.trace && error.stack ||
        error.message ||
        String(error));

      process.exit(1);
    }
  }

  if (isYaml) {
    console.log(JSON.stringify(output, null, '  '));
  } else {
    console.log(yaml.dump(output));
  }

  process.exit(0);
});
