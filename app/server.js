'use strict';

const Hapi = require('hapi');
const AuthBearer = require('hapi-auth-bearer-token');
const route = require('./route');

var server = new Hapi.Server();

server.connection({
    port: process.env.PORT || 3000
});

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
server.register(
    [
        {register: require('good'), options: options},
        {register: AuthBearer}
    ], 
    function (err) {
    if(err) {
        console.error(err);

    }else {
        server.auth.strategy('simple', 'bearer-access-token', {
            allowQueryToken: false,              // optional, true by default 
            allowMultipleHeaders: true,        // optional, false by default 
            accessTokenName: 'access_token',    // optional, 'access_token' by default 
            validateFunc: function (token, callback) {
                // For convenience, the request object can be accessed 
                // from `this` within validateFunc. 
                var request = this;
                // Use a real strategy here, 
                // comparing with a token from your database for example 
                if (token === "3449e0ce49b3fd08b8d2d5e6cb74574bea896e3864f469c673d85771ecea2bb4") {
                   return callback(null, true, { token: token });
                }
                
                return callback(null, false, { token: token });
            }
        });
    }
    server.route(route);
});

// Add the route


server.start(function (err) {
    console.info('Server started at ' + server.info.uri);
});