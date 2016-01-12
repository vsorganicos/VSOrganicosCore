'use strict';

const fs = require('fs');
const archive = require('../../config.json');

exports.securityCredentials = function(callback) {
	console.log('Config File::Security ' + archive);
	
	callback(archive.security);
};

