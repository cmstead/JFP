'use strict';

var packageData = require('../package.json'),

	fs = require('fs'),
	async = require('async');

function showFile (error, fileStr) {
	console.log(fileStr);
}

function writeFile (content, callback) {
	fs.writeFile('./nuget-package/Package.nuspec', content, 'utf8', callback);
}

function updateFile (content, callback) {
	callback(null, content.replace('{{version}}', packageData.version)
						  .replace('{{year}}', (new Date()).getFullYear()));
}

function readFile (callback) {
	fs.readFile('./templates/Package.nuspec', 'utf8', callback);
}

(function () {
	
	async.waterfall([
		readFile,
		updateFile,
		writeFile
	]);
	
	console.log('Nuget prep done!');
	
})();