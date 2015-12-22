'use strict';

const db = require('../database');
const os = require('os');
const Boom = require('boom');

var health = {
	database: {
	},
	system: {
		host: os.hostname(),
		cpus: os.cpus().length,
		platform: os.platform(),
		memory: {}
	}
};

exports.health = function(request, response) {
	status(function(err, result) {
		if(err)
			response(Boom.create(err));
		else
			response(result);	
	});
}

var status = function(callback) {
	try {
		console.info(os.uptime());
		health.system['uptime'] = parseFloat((process.uptime() / 60)).toFixed(2) + "m";
		health.system.memory = process.memoryUsage();
		
		db.getConnection(function(err, connection) {
			if(err) {
				console.error(err);
				health.database['status'] = 'error';
				health.database['error'] = err.message;
				callback(null, health);

			}else {
				health.database['host'] = connection.config['host'];
				health.database['port'] = connection.config['port'];
				health.database['database'] = connection.config['database'];
				
				db.testConnection(connection, function(result) {
					health.database['status'] = result===true ? 'ok' : 'error';
					health.database['error'] = '';
					callback(null, health);
				});
				connection.release();
			}
		});

	}catch(e) {
		console.error(e);
		callback(e, null);
	}
}