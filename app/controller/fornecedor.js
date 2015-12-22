'use strict';

const model = require('../model/fornecedor');
const db = require('../database');
const Boom = require('boom');

module.exports.findAll = function(request, response) {
	model.findAll(function(err, result) {
		if(err)
			response(Boom.create(500, err));
		else
			response(result);
	});
};

module.exports.findById = function(request, response) {
	model.findById(request.params.id, function(err, result) {
		if(err)
			response(Boom.create(500, err));
		else
			response(result);
	});
};

module.exports.findByStatus = function(request, response) {
	model.findByStatus(request.params.status, function(err, result) {
		if(err)
			response(Boom.create(500, err));
		else
			response(result);
	});
};

module.exports.persist = function(request, response) {
	var payload = null;

	try {
		payload = JSON.stringify(request.payload);

		db.beginTransaction(function(err, connection) {
			model.insert(request.payload, connection, function(err, result) {
				if(err) {
					console.error('Erro ao tentar gravar o fornecedor: ' + payload, err);

					connection.rollback(function() {
						console.error('######## Tracing: ' + err.message);
					});
					return response(Boom.create(500, 'Erro ao tentar gravar o fornecedor: ' + payload, err.message));

				}else {
					connection.commit(function(e) {
						connection.release();

						if(e) {
							connection.rollback(function() {
								console.error('Erro ao fechar a transação de gravar o fornecedor: ' + payload, e);
							});
							return response(Boom.create(500, 'Erro ao tentar gravar o fornecedor: ' + payload, e.mesage));
						}

						response(result);
					});
				}
			});
		})

	}catch(e) {
		console.error(e);
		response(Boom.create(500, 'Erro ao tentar gravar o fornecedor: ' + payload, e.mesage));
	}
};

module.exports.update = function(request, response) {
	var payload = null;

	try {
		payload = JSON.stringify(request.payload);

		db.beginTransaction(function(err, connection) {
			model.update(request.payload, connection, function(err, result) {
				if(err) {
					console.error('Erro ao tentar atualizar o fornecedor: ' + payload, err);

					connection.rollback(function() {
						console.error('######## Tracing: ' + err.message);
					});
					return response(Boom.create(500, 'Erro ao tentar atualizar o fornecedor: ' + payload, err.message));

				}else {
					connection.commit(function(e) {
						connection.release();

						if(e) {
							connection.rollback(function() {
								console.error('Erro ao fechar a transação de atualizar o fornecedor: ' + payload, e);
							});
							return response(Boom.create(500, 'Erro ao tentar atualizar o fornecedor: ' + payload, e.mesage));
						}

						response(result);
					});
				}
			});
		})

	}catch(e) {
		console.error(e);
		response(Boom.create(500, 'Erro ao tentar ataulizar o fornecedor: ' + payload, e.mesage));
	}
};

module.exports.delete = function(request, response) {
	var payload = null;

	try {
		payload = JSON.stringify(request.payload);

		db.beginTransaction(function(err, connection) {
			model.delete(request.payload, connection, function(err, result) {
				if(err) {
					console.error('Erro ao tentar excluir o fornecedor: ' + payload, err);

					connection.rollback(function() {
						console.error('######## Tracing: ' + err.message);
					});
					return response(Boom.create(500, 'Erro ao tentar excluir o fornecedor: ' + payload, err.message));

				}else {
					connection.commit(function(e) {
						connection.release();

						if(e) {
							connection.rollback(function() {
								console.error('Erro ao fechar a transação de excluir o fornecedor: ' + payload, e);
							});
							return response(Boom.create(500, 'Erro ao tentar excluir o fornecedor: ' + payload, e.mesage));
						}
						response(result);
					});
				}
			});
		});

	}catch(e) {
		console.error(e);
		response(Boom.create(500, 'Erro ao tentar excluir o fornecedor: ' + payload, e.message));
	}
};