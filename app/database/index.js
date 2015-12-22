'use strict';

const mysql = require('mysql');

var pool = null;

function openConnection() {
	try {
		if(pool==null) {
			pool = mysql.createPool({
				connectionLimit : 5,
				waitForConnections: true,
				queueLimit: 5,
				host: '192.168.99.100',
				localAddress: '192.168.99.100',
				database: 'vidasaudavelorganicos',
				user: 'root',
				password: 'administrator'
			});
		}

	}catch(e) {
		console.error('Error on open MySQL Connection: ' + e);
		throw e;
	}
}

module.exports.testConnection = function(connection, callback) {
	connection.ping(function (err) {
  		if (err) {
  			console.error(err);
  			return callback(false);
  		}
 
  		console.log('Connection ok!');

  		callback(true);
	});
}

module.exports.closeConnections = function(callback) {
	pool.end(function(err) {
		callback(err);
	});
	console.info('###### Connections closed ######');
}

module.exports.beginTransaction = function(callback) {
	openConnection();

	pool.getConnection(function(err, connection) {
		if(err) {
			callback(err, null);

		}else {
			connection.beginTransaction(function(err) {
				if(err)
					callback(err, null);
				else
					callback(null, connection);
			});
		}
	});
}

module.exports.getConnection = function(callback) {
	openConnection();

	pool.getConnection(function(err, connection) {
		if(err)
			callback(err, null);
		else
			callback(null, connection);
	});
}