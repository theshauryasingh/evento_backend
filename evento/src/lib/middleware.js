const { getExecuteArgs } = require('./helpers');

/**
 *
 * @param {*} middlewareFunction
 * @param {*} contextExtractor
 */
const createMiddleware =
  (middlewareFunction, contextExtractor) => async (req, res, next) => {
    try {
      const result = await middlewareFunction(getExecuteArgs(req));
      const context = contextExtractor(result);
      req.ctx = { ...req.context, ...context };
      next();
    } catch (error) {
      res.status(400).send({ error });
    }
  };

export default createMiddleware;
