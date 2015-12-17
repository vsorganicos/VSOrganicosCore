'use strict';

const Hapi = require('hapi');
const route = require('./route');

var server = new Hapi.Server();

server.connection({
    port: process.env.PORT || 3000
});

// Add the route
server.route(route);

var options = {
    opsInterval: 20000,
	reporters: [{
        reporter: require('good-console'),
        events: { request: '*', response: '*' }
    },{
		reporter: require('good-file'),
		events: { ops: '*', error: '*' },
        config: './log/vidasaudavelorganicos.log'
	}]
};

// Start the server
server.register({
    register: require('good'),
    options: options
}, function (err) {
    if (err) {
        console.error(err);
    }
    else {
        server.start(function () {
            console.info('Server started at ' + server.info.uri);
        });
    }
});