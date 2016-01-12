const Code = require('code');   // assertion library 
const Lab = require('lab');
const db = require('../app/database');
const fornec = require('../app/model/fornecedor');
const crypto = require('crypto');
const util = require('../app/util/index');

const lab = exports.lab = Lab.script();

lab.describe('Loading config file', () => {

	lab.it('Load archive', (done) => {
		util.securityCredentials(function(result) {
			//none
			console.log(result.token);
		});

		done();
	});
});

lab.describe('Database Pool test', () => {
	//Force pool limit
	lab.it('Open many connections', (done) => {

		for(i=0; i<=7;) {
			db.getConnection(function(err, conn) {
				Code.expect(err).to.equal(null);

				conn.release();
			});
			i++;
		}
		done();
	});

});

lab.describe('Transaction test', () => {
	
	//Open connection
	lab.it('Open MySQL Connection', (done) => {
		db.beginTransaction(function(err, conn) {
			console.log('Connection: ' + conn.threadId);

			Code.expect(err).to.equal(null);

			db.testConnection(conn, function(result) {
				//None

			});

			conn.commit(function(err) {
				if(err)
					conn.rollback(function(){});

				console.log('Transaction commited');
			});

			done();
		});
	});

});

lab.describe('Database test', () => {
	
	//Open connection
	lab.it('Open MySQL Connection', (done) => {
		
		db.getConnection(function(err, conn) {
			Code.expect(err).to.equal(null);

			conn.release();

			done();
		});
	});

});

lab.describe('Cypher', () => {
	lab.it('Generate Keys', (done) => {
		var key = new Buffer(crypto.randomBytes(32));
		var cipher;

		console.log('Ciphers ', key.toString('hex'));

		done();
	})
});

lab.describe('Test Fornecedor', () => {
	lab.it('Consultar por Id', (done) => {
			fornec.findById(51, function(err, result) {
				Code.expect(err).to.equal(null);

				console.log('result Por Id: ' + JSON.stringify(result));

				done();	
			});
	});

	lab.it('Consultar Por Status', (done) => {
			fornec.findByStatus(false, function(err, result) {
				Code.expect(err).to.equal(null);

				console.log('result Por Status: ' + JSON.stringify(result));

				done();	
			});
	});

	//Atualizar
	lab.it(' Atualizar Fornecedor ', (done) => {
		var funcionario = {
			id : 4,
			cnpj: '90919090000190',
			ativo: true,
			layoutArquivo: 'CSV',
			emailContato: 'teste@teste.com.br',
			emailVendas: null,
			informacoesAdicionais: null,
			contatoComercial: null
		};

		// fornec.update(funcionario, function(err, result) {
		// 	Code.expect(err).to.equal(null);

		// 	console.log('Tentativa de atualizar fornecedor: ' + JSON.stringify(result));

			done();

		// });
	});

	//Inserir
	lab.it(' Inserir Fornecedor ', (done) => {
		var funcionario = {
			id : 54,
			nome: 'Teste JSON API',
			cnpj: '18614342000170',
			ativo: true,
			layoutArquivo: 'CSV',
			emailContato: null,
			emailVendas: null,
			informacoesAdicionais: null,
			contatoComercial: null
		};

		db.beginTransaction(function(err, conn) {
			console.log('Begin Transaction ...')

			fornec.insert(funcionario, conn, function(err, result) {
				console.log('Transaction Error? ' + err);

				if(err) {
					conn.rollback(function() {
        				//none
      				});
      				console.error('Transaction rolledback...');
				}else {
					conn.commit(function(err) {
	        			if (err) {
	          				conn.rollback(function() {
	            				throw err;
	          				});
	        			}
	        			console.log('success!');
	      			});
				}
				db.closeConnections(function(err){if(err) console.error(err);});

				Code.expect(err).to.equal(null);

				console.log('Tentativa de inserir fornecedor: ' + JSON.stringify(result));

				done();

			});
		});
	});

});
