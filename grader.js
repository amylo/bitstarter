#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development and basic DOM parsing.

References:

 + cheerio
    - https://github.com/MatthewMueller/cheerio
    - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
    - http://maxogden.com/scaping-with-node.html

 + commander.js
    - https://github.com/visionmedia/commander.js
    - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var rest = require('restler');

var HTMLFILE_DEFAULT = 'index.html';
var CHECKSFILE_DEFAULT = 'checks.json';

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
	console.log('%s does not exist. Exiting.', instr);
	process.exit(1);
    }
    return instr;
};

var cheerioHtmlFile = function(htmlfile) {
    if (program.url) {
	return cheerio.load(htmlfile);
    } else {
	return cheerio.load(fs.readFileSync(htmlfile));
    }
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for (var ii in checks) {
	var present = $(checks[ii]).length > 0;
	out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) {
    return fn.bind({});
};

var runChecks = function(htmlfile, checksfile) {
	var checkJson = checkHtmlFile(htmlfile, checksfile);
	var outJson = JSON.stringify(checkJson, null, 4);
	console.log(outJson);
};

if (require.main == module) {
    program
	.option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
	.option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
	.option('-u, --url <url>', 'Url to webpage')
	.parse(process.argv);
    
    var file = program.file;
    if (program.url) {
    	rest.get(program.url).on('complete', function(data) {
	    runChecks(data, program.checks);
	});
    } else {
    	runChecks(file, program.checks);
    }
} else {
    exports.checkHtmlFile = checkHtmlFile
}	
