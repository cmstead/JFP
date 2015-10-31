'use strict';

var exec = require('child_process').exec;

exec('grunt build', function () {
	exec('node build-scripts/nuget-build.js', function(){});	
});
