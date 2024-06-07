// eslint-disable-next-line no-unused-vars
import { RequestHandler } from 'express';

/**
 * @typedef {object} executeParams
 * @property {object} params
 * @property {object} query
 * @property {object} body
 * @property {object} ctx
 * @property {object} cookies
 * @property {object} headers
 */

/**
 * @typedef {object} Method
 * @property {Array<RequestHandler>} middlewares
 * @property {function(executeParams, Res): Promise<object|string>} execute
 * @property {number} status
 */

/**
 * @typedef {object} handler
 * @property {string} path
 * @property {Array<RequestHandler>} middlewares
 * @property {Method} GET
 * @property {Method} POST
 * @property {Method} PUT
 * @property {Method} DELETE
 * @property {Method} PATCH
 */

/**
 * @typedef {object} Config
 * @property {string} basePath
 * @property {handler[]} handlers
 * @property {Array<RequestHandler>} middlewares
 */

/**
 *
 * @callback Controller
 * @param {Router} router
 * @return {Router}
 */

/**
 *
 * @typedef {object} ServerOptions
 * @property {Array<RequestHandler>} useMiddleware,
 * @property {string} globalApiBasePath,
 * @property {Controller[]} controllers
 */

/**
 *
 *  @typedef {import("express").Response} Res
 */

/**
 *
 * @typedef {{ OK: number; CERATED: number; BAD_REQUEST: number; UNAUTHORIZED: number; FORBIDDEN: number; NOT_FOUND: number; INTERNAL_SERVER: number; }} HttpStatus
 */

export default {};
