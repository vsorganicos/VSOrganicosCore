'use strict';

const Joi = require('joi');
const fornecedor = require('../controller/fornecedor');
const health = require('../util/system-health');

var routes = [];

routes.push(
	{
		method: 'GET',
		path: '/health',
		handler: health.health
	},
	{
		method: 'GET',
		path: '/vsorganicos/v1/fornecedor',
		config: {
			auth: 'simple',
			handler: fornecedor.findAll
		}
	},
	{
		method: 'GET',
		path: '/vsorganicos/v1/fornecedor/{id}',
		config: {
			auth: 'simple',
			handler: fornecedor.findById
		}

	},
	{
		method: 'GET',
		path: '/vsorganicos/v1/fornecedor/status/{status}',
		config: {
			auth: 'simple',
			handler: fornecedor.findByStatus
		}
	},
	{
		method: 'DELETE',
		path: '/vsorganicos/v1/fornecedor',
		config: {
			auth: 'simple',
			validate: {
				payload: Joi.object().keys({
					fornecedor: Joi.object().keys({
						id: Joi.number().required()
					})
				})
			}
		},
		handler: fornecedor.delete

	},
	{
		method: 'PUT',
		path: '/vsorganicos/v1/fornecedor',
		config: {
			auth: 'simple',
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
			auth: 'simple',
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