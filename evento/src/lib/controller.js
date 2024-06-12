import { APIError, BaseError, getExecuteArgs } from './helpers';
// eslint-disable-next-line no-unused-vars
import { Config, Method, Controller, executeParams, Res } from './typeDefs';

import Logger from './logger';

const logger = new Logger('core');

/**
 *
 * @param {*} response
 * @param {number} status
 */
const createApiResponse = (response, status) => {
  return {
    httpStatus: status,
    data: response || null,
  };
};

/**
 *
 * @param {Error} error
 * @param {import("express").Response} res
 */
const handleApiError = (error, res) => {
  if (error instanceof BaseError) {
    const errorResponse = {
      httpStatus: error.httpCode,
      error: {
        name: error.name,
        message: error.message,
      },
    };
    return res.status(error.httpCode).send(errorResponse);
  }

  const err = new APIError(error.message);
  const errorResponse = {
    httpStatus: err.httpCode,
    error: {
      name: err.name,
      message: err.message,
    },
  };
  return res.status(err.httpCode).send(errorResponse);
};

/**
 *
 *
 * @param {function(typeof getExecuteArgs, Res ): Promise<object|string>} execute
 * @param {number} status
 * @returns
 */
const createExecutionHandler =
  (execute, status = 200) =>
  async (req, res) => {
    try {
      const executeArgs = getExecuteArgs(req);
      console.log(" .. createExecutionHandler .. executeArgs .. ", executeArgs);
      const response = await Promise.resolve(execute(executeArgs, res));
      console.log(" .. createExecutionHandler .. response .. ", response);
      const apiResponse = createApiResponse(response, status);
      res.status(status).send(apiResponse);
    } catch (error) {
      console.log(" .. createExecutionHandler .. error .. ", error);
      logger.info(error);
      handleApiError(error, res);
    }
  };

/**
 *
 * @param {Config} config
 * @return {Controller}
 */
const createController =
  (
    config = {
      basePath: '',
      handlers: [],
      middlewares: [],
    }
  ) =>
  (router) => {
    const { handlers, basePath } = config;

    handlers.forEach((handler) => {
      const {
        path: handlerPath,
        middlewares: handlerMiddleware,
        ...methods
      } = handler;

      let path = '';
      if (basePath) {
        path += `/${basePath}`;
      }
      if (handlerPath) {
        path += `/${handlerPath}`;
      }

      const middlewares = [
        ...(config?.middlewares || []),
        ...(handlerMiddleware || []),
      ];

      if (methods.GET) {
        logger.info(`Binding GET ${path}`);
        const { status, execute } = methods.GET;
        router.get(
          path,
          ...middlewares,
          ...(methods.GET.middlewares || []),
          createExecutionHandler(execute, status)
        );
      }
      if (methods.POST) {
        logger.info(`Binding POST ${path}`);
        const { status, execute } = methods.POST;
        router.post(
          path,
          ...middlewares,
          ...(methods.POST.middlewares || []),
          createExecutionHandler(execute, status)
        );
      }

      if (methods.PUT) {
        logger.info(`Binding PUT ${path}`);
        const { status, execute } = methods.GET;
        router.get(
          path,
          ...middlewares,
          ...(methods.GET.middlewares || []),
          createExecutionHandler(execute, status)
        );
      }
      if (methods.PATCH) {
        logger.info(`Binding PATCH ${path}`);
        const { status, execute } = methods.POST;
        router.post(
          path,
          ...middlewares,
          ...(methods.POST.middlewares || []),
          createExecutionHandler(execute, status)
        );
      }
      if (methods.DELETE) {
        logger.info(`Binding DELETE ${path}`);
        const { status, execute } = methods.POST;
        router.post(
          path,
          ...middlewares,
          ...(methods.POST.middlewares || []),
          createExecutionHandler(execute, status)
        );
      }
    });

    return router;
  };

export default createController;


// import { APIError, BaseError, getExecuteArgs } from './helpers';
// // eslint-disable-next-line no-unused-vars
// import { Config, Method, Controller, executeParams, Res } from './typeDefs';

// import Logger from './logger';

// const logger = new Logger('core');

// /**
//  *
//  * @param {*} response
//  * @param {number} status
//  */
// const createApiResponse = (response, status) => {
//   return {
//     httpStatus: status,
//     data: response || null,
//   };
// };

// /**
//  *
//  * @param {Error} error
//  * @param {import("express").Response} res
//  */
// const handleApiError = (error, res) => {
//   if (error instanceof BaseError) {
//     const errorResponse = {
//       httpStatus: error.httpCode,
//       error: {
//         name: error.name,
//         message: error.message,
//       },
//     };
//     return res.status(error.httpCode).send(errorResponse);
//   }

//   const err = new APIError(error.message);
//   const errorResponse = {
//     httpStatus: err.httpCode,
//     error: {
//       name: err.name,
//       message: err.message,
//     },
//   };
//   return res.status(err.httpCode).send(errorResponse);
// };

// /**
//  *
//  *
//  * @param {function(typeof getExecuteArgs, Res ): Promise<object|string>} execute
//  * @param {number} status
//  * @returns
//  */
// const createExecutionHandler =
//   (execute, status = 200) =>
//   async (req, res) => {
//     try {
//       // console.log(req);
//       const executeArgs = getExecuteArgs(req);
//       const response = await Promise.resolve(execute(executeArgs, res));
//       const apiResponse = createApiResponse(response, status);
//       // console.log(" .. createExecutionHandler .. >> ", res)
//       res.status(status).send(apiResponse);
//     } catch (error) {
//       // logger.info(error);
//       handleApiError(error, res);
//     }
//   };

// /**
//  *
//  * @param {Config} config
//  * @return {Controller}
//  */
// const createController =
//   (
//     config = {
//       basePath: '',
//       handlers: [],
//       middlewares: [],
//     }
//   ) =>
//   (router) => {
//     const { handlers, basePath } = config;

//     handlers.forEach((handler) => {
//       const {
//         path: handlerPath,
//         middlewares: handlerMiddleware,
//         ...methods
//       } = handler;

//       let path = '';
//       if (basePath) {
//         path += `/${basePath}`;
//       }
//       if (handlerPath) {
//         path += `/${handlerPath}`;
//       }

//       const middlewares = [
//         ...(config?.middlewares || []),
//         ...(handlerMiddleware || []),
//       ];

//       if (methods.GET) {
//         logger.info(`Binding GET ${path}`);
//         const { status, execute } = methods.GET;
//         router.get(
//           path,
//           ...middlewares,
//           ...(methods.GET.middlewares || []),
//           createExecutionHandler(execute, status)
//         );
//       }
//       if (methods.POST) {
//         logger.info(`Binding POST ${path}`);
//         const { status, execute } = methods.POST;
//         router.post(
//           path,
//           ...middlewares,
//           ...(methods.POST.middlewares || []),
//           createExecutionHandler(execute, status)
//         );
//       }

//       if (methods.PUT) {
//         logger.info(`Binding PUT ${path}`);
//         const { status, execute } = methods.GET;
//         router.get(
//           path,
//           ...middlewares,
//           ...(methods.GET.middlewares || []),
//           createExecutionHandler(execute, status)
//         );
//       }
//       if (methods.PATCH) {
//         logger.info(`Binding PATCH ${path}`);
//         const { status, execute } = methods.POST;
//         router.post(
//           path,
//           ...middlewares,
//           ...(methods.POST.middlewares || []),
//           createExecutionHandler(execute, status)
//         );
//       }
//       if (methods.DELETE) {
//         logger.info(`Binding DELETE ${path}`);
//         const { status, execute } = methods.POST;
//         router.post(
//           path,
//           ...middlewares,
//           ...(methods.POST.middlewares || []),
//           createExecutionHandler(execute, status)
//         );
//       }
//     });

//     return router;
//   };

// export default createController;
