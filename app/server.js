'use strict';

const Hapi = require('hapi');
const AuthBearer = require('hapi-auth-bearer-token');
const route = require('./route');
const util = require('../app/util/index');

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
                
                util.securityCredentials(function(result) {
                    // Use a real strategy here, 
                    // comparing with a token from your database for example 
                    if (token === result.token) {
                       return callback(null, true, { token: token });
                    }
                    
                    return callback(null, false, { token: token });

                });
            }
        });
    }
    server.route(route);
});

// Add the route


server.start(function (err) {
    console.info('Server started at ' + server.info.uri);
});