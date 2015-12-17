'use strict';

const db = require('../database');

var queries = {
	findById : "SELECT ID, NOME, CNPJ, FLAG_ATIVO, LAYOUT_ARQUIVO_PRODUTO, " +
				" EMAIL_CONTATO, EMAIL_VENDAS, INFO_ADICIONAL, CONTATO_COMERCIAL " +
				" FROM FORNECEDOR " +
				" WHERE ID = ?",
	findByStatus : "SELECT ID, NOME, CNPJ, FLAG_ATIVO, LAYOUT_ARQUIVO_PRODUTO, " +
				" EMAIL_CONTATO, EMAIL_VENDAS, INFO_ADICIONAL, CONTATO_COMERCIAL " +
				" FROM FORNECEDOR " +
				" WHERE FLAG_ATIVO = ?",
	update : "UPDATE FORNECEDOR " +
			 "SET NOME = ?, CNPJ = ?, FLAG_ATIVO = ?, LAYOUT_ARQUIVO_PRODUTO = ?, " +
			 "EMAIL_CONTATO = ?, EMAIL_VENDAS = ?, INFO_ADICIONAL = ?, " +
			 "CONTATO_COMERCIAL = ? " +
			 "WHERE ID = ?",
	insert : "INSERT INTO FORNECEDOR " +
			 "(NOME, CNPJ, FLAG_ATIVO, LAYOUT_ARQUIVO_PRODUTO, EMAIL_CONTATO, EMAIL_VENDAS, INFO_ADICIONAL, CONTATO_COMERCIAL, ID) " +
			 "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
};

var schema = function(row){
	var fornecedor = {
		id : row.ID,
		nome: row.NOME,
		cnpj: row.CNPJ,
		ativo: row.FLAG_ATIVO[0]==0 ? false : true,
		layoutArquivo: row.LAYOUT_ARQUIVO_PRODUTO,
		emailContato: row.EMAIL_CONTATO,
		emailVendas: row.EMAIL_VENDAS,
		informacoesAdicionais: row.INFO_ADICIONAL,
		contatoComercial: row.CONTATO_COMERCIAL
	}
	return fornecedor;
};

module.exports.findById = function(id, callback) {
	var result = null;

	try {
		db.getConnection(function(error, conn) {
			if(error)
				return callback(error, null);

			conn.query(queries.findById, [id], function(err, results, fields) {
				if(err) {
					console.error('Ocorreu um erro na consulta do Fornecedor: ' + id, err);
					callback(err, null);
				}

				conn.release();

				results.forEach(function(row) {
					result = schema(row);	
				});
				
				callback(null, result);
			});
		});

	}catch(e) {
		console.error(e);
		callback(e, null);
	}
};

//Transacation Propagation
module.exports.insert = function(jSon, connection, callback) {
	var status = {
		result : false
	};
	try {
		console.info('####### Inserir o fornecedor: ' + JSON.stringify(jSon.fornecedor) + ' ########');

		connection.query(queries.insert, [jSon.fornecedor.nome,
									jSon.fornecedor.cnpj,
									jSon.fornecedor.ativo==null ? true : jSon.fornecedor.ativo,
									jSon.fornecedor.layoutArquivo==null ? null :jSon.fornecedor.layoutArquivo,
									jSon.fornecedor.emailContato,
									jSon.fornecedor.emailVendas==null ? null : jSon.fornecedor.emailVendas,
									jSon.fornecedor.informacoesAdicionais==null ? null: jSon.fornecedor.informacoesAdicionais ,
									jSon.fornecedor.contatoComercial==null ? null : jSon.fornecedor.contatoComercial,
									jSon.fornecedor.id==null ? null : jSon.fornecedor.id], 
						function(err, result) {
			if(err) 
				callback(err, null);
			else {
				status.result = true;
				
				callback(null, status);
			}
		});

	}catch(e) {
		console.error(e);
		callback(e, null);
	}
};

//Transaction Propagation
module.exports.update = function(jSon, connection, callback) {
	var func;

	try {
		connection.query(queries.findById, [jSon.fornecedor.id], function(err, results, fields) {
			if(err) {
				callback(err, null);

			}else {
				if(results.length==0) {
					return callback(new Error('Fornecedor não encontrado'), null);

				}else {
					results.forEach(function(row) {
						func = schema(row);
					});

					for(var prop in func) {
						func[prop] = jSon.fornecedor[prop];
					}

					connection.query(queries.update, [func.nome,
												func.cnpj,
												func.ativo,
												func.layoutArquivo,
												func.emailContato,
												func.emailVendas,
												func.informacoesAdicionais,
												func.contatoComercial,
												func.id], 
									function(err, result) {

						if(err) {
							console.error('Erro ao atualizar o fornecedor: ' + jSon.fornecedor.id, err);
							callback(err, null);
						}else
							callback(null, func);
					});
				}
			}
		});

	}catch(e) {
		console.error(e);
		callback(e, null);
	}
};

module.exports.findByStatus = function(status, callback) {
	var result = [];

	try {
		db.getConnection(function(error, conn) {
			if(error)
				return callback(error, null);

			conn.query(queries.findByStatus, [status], function(err, results, fields) {
				if(err) {
					console.error('Ocorreu um erro na consulta do Fornecedor: ' + status, err);
					callback(err, null);
				}

				conn.release();

				results.forEach(function(row) {
					result.push( schema(row) );
				});

				callback(null, result);
			});
		});

	}catch(e) {
		console.error(e);
		callback(e, null);
	}
};