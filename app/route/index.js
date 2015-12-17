'use strict';

const Joi = require('joi');
const fornecedor = require('../controller/fornecedor');

var routes = [];

routes.push(
	{
		method: 'GET',
		path: '/vsorganicos/v1/fornecedor/{id}',
		handler: fornecedor.findById

	},
	{
		method: 'GET',
		path: '/vsorganicos/v1/fornecedor/status/{status}',
		handler: fornecedor.findByStatus

	},
	{
		method: 'PUT',
		path: '/vsorganicos/v1/fornecedor',
		config: {
			validate: {
				payload: Joi.object().keys({
					fornecedor: Joi.object().keys({
						id: Joi.number().optional(),
						nome: Joi.string().max(180).required(),
						cnpj: Joi.string().max(15).required(),
						ativo: Joi.boolean().optional(),
						emailContato: Joi.string().email(),
						emailVendas: Joi.string().email().optional(),
						informacoesAdicionais: Joi.string().max(300).optional(),
						contatoComercial: Joi.string().max(60).optional()
					})
				})
			}
		},
		handler: fornecedor.persist
	},
	{
		method: 'POST',
		path: '/vsorganicos/v1/fornecedor',
		config: {
			validate: {
				payload: Joi.object().keys({
					fornecedor: Joi.object().keys({
						id: Joi.number().required(),
						nome: Joi.string().max(180).optional(),
						cnpj: Joi.string().max(15).optional(),
						emailContato: Joi.string().email().optional(),
						ativo: Joi.boolean().optional(),
						emailVendas: Joi.string().email().optional(),
						informacoesAdicionais: Joi.string().max(300).optional(),
						contatoComercial: Joi.string().max(60).optional()
					})
				})
			}
		},
		handler: fornecedor.update
	}
);

module.exports = routes;