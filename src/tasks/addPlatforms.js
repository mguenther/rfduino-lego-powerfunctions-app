'use strict';

const
	fs = require('fs'),
	path = require('path'),
	sys = require('sys'),
	exec = require('child_process').exec,
	packageJson = require('../package.json');
	
let command = process.argv[2] || 'add';

packageJson.platforms.forEach(function(platform) {
	var platformCmd = 'cordova platform ' + command + ' ' + platform;
	exec(platformCmd);
});