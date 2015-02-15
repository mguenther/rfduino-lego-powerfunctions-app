'use strict';

const
	fs = require('fs'),
	path = require('path'),
	sys = require('sys'),
	exec = require('child_process').exec,
	packageJson = require('../package.json');
	
let command = process.argv[2] || 'add';

function createAddRemoveStatement(plugin) {
	var pluginCmd = 'cordova plugin ' + command + ' ';
	if (typeof(plugin) === 'string') {
		pluginCmd += plugin;
	} else {
		if (command === 'add') {
			pluginCmd += plugin.locator + ' ';
			if (plugin.variables) {
				Object.keys(plugin.variables).forEach(function(variable) {
					pluginCmd += '--variable ' + variable + '="' + plugin.variables[variable] + '" ';
				});
			}
		} else {
			pluginCmd += plugin.id;
		}
	}
	return pluginCmd;
}

packageJson.plugins.forEach(function(plugin) {

	let pluginCmd = createAddRemoveStatement(plugin);
	console.log('Executing: ' + pluginCmd);
	exec(pluginCmd);
});

