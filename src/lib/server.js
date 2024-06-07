// eslint-disable-next-line no-unused-vars
import express, { Router, Application } from 'express';
import { json } from 'body-parser';
// eslint-disable-next-line no-unused-vars
import { ServerOptions } from './typeDefs';
import * as rTracer from 'cls-rtracer';
import Logger from './logger';
import { getDurationInMilliseconds } from './helpers';

const logger = new Logger('core');

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const logRequest = (req, res, next) => {
  const start = process.hrtime();
  res.on('close', () => {
    const durationInMilliseconds = getDurationInMilliseconds(start);
    logger.http({
      ip: req.socket.remoteAddress,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime: durationInMilliseconds,
    });
  });

  next();
};

/**
 *
 * @param {ServerOptions} options
 * @returns {Application}
 */
export default function createServer(
  options = { useMiddlewares: [], globalApiBasePath: '', controllers: [] }
) {
  const app = express();
  const { controllers, globalApiBasePath } = options;
  let { useMiddlewares } = options;
  const router = Router();

  if (!useMiddlewares) {
    useMiddlewares = [];
  }
  useMiddlewares.push(json());
  useMiddlewares.push(rTracer.expressMiddleware());
  useMiddlewares.push(logRequest);

  useMiddlewares?.forEach((item) => app.use(item));

  logger.info(`baseUrl set as ${globalApiBasePath}`);
  controllers.forEach((controller) => {
    app.use(globalApiBasePath || '', controller(router));
  });
  return app;
}

/**
 * Description placeholder
 * @date 13/02/2024 - 13:27:26
 *
 * @export
 * @class Server
 * @typedef {Server}
 */
export class Server {
  app = express();
  middlewares = [];
  controllers = [];
  globalApiBasePath = '';
  router = Router();
  /**
   * Creates an instance of Server.
   * @param {ServerOptions} options
   * @memberof Server
   */
  constructor(
    options = { useMiddlewares: [], globalApiBasePath: '', controllers: [] }
  ) {
    const { controllers, globalApiBasePath } = options;
    let { useMiddlewares } = options;

    this.middlewares.push(json());
    this.middlewares.push(rTracer.expressMiddleware());
    this.middlewares.push(logRequest);

    if (useMiddlewares) {
      this.middlewares.push(...useMiddlewares);
    }
    this.middlewares.forEach((item) => this.app.use(item));
    this.controllers = controllers;
    this.globalApiBasePath = globalApiBasePath;

    return this;
  }

  async start(port) {
    if (!port) {
      throw new Error('Please add a port to start the server');
    }

    logger.info(`baseUrl set as ${this.globalApiBasePath}`);
    this.controllers.forEach((controller) => {
      this.app.use(this.globalApiBasePath || '', controller(this.router));
    });
    return new Promise((resolve, reject) => {
      this.app.listen(port, (err) => {
        if (err) {
          reject(err);
          return;
        }
        logger.info(`Server started @port ${port}`);
        resolve(this);
      });
    });
  }
}

// // eslint-disable-next-line no-unused-vars
// import express, { Router, Application } from 'express';
// import { json } from 'body-parser';
// // eslint-disable-next-line no-unused-vars
// import { ServerOptions } from './typeDefs';
// import * as rTracer from 'cls-rtracer';
// import Logger from './logger';
// import { getDurationInMilliseconds } from './helpers';

// const logger = new Logger('core');

// /**
//  *
//  * @param {import('express').Request} req
//  * @param {*} res
//  * @param {*} next
//  */
// const logRequest = (req, res, next) => {
//   const start = process.hrtime();
//   res.on('close', () => {
//     const durationInMilliseconds = getDurationInMilliseconds(start);
//     logger.http({
//       ip: req.socket.remoteAddress,
//       method: req.method,
//       url: req.url,
//       statusCode: res.statusCode,
//       responseTime: durationInMilliseconds,
//     });
//   });

//   next();
// };

// /**
//  *
//  * @param {ServerOptions} options
//  * @returns {Application}
//  */
// export default function createServer(
//   options = { useMiddlewares: [], globalApiBasePath: '', controllers: [] }
// ) {
//   const app = express();
//   const { controllers, globalApiBasePath } = options;
//   let { useMiddlewares } = options;
//   const router = Router();

//   if (!useMiddlewares) {
//     useMiddlewares = [];
//   }
//   useMiddlewares.push(json());
//   useMiddlewares.push(rTracer.expressMiddleware());
//   useMiddlewares.push(logRequest);

//   useMiddlewares?.forEach((item) => app.use(item));

//   logger.info(`baseUrl set as ${globalApiBasePath}`);
//   controllers.forEach((controller) => {
//     app.use(globalApiBasePath || '', controller(router));
//   });
//   return app;
// }

// /**
//  * Description placeholder
//  * @date 13/02/2024 - 13:27:26
//  *
//  * @export
//  * @class Server
//  * @typedef {Server}
//  */
// export class Server {
//   // Class Properties
//   app = express();
//   middlewares = [];
//   controllers = [];
//   globalApiBasePath = '';
//   router = Router();

//   /**
//    * Creates an instance of Server.
//    * @param {ServerOptions} options
//    * @memberof Server
//    */
//   constructor( options = { useMiddlewares: [], globalApiBasePath: '', controllers: [] }) {
//     const { controllers, globalApiBasePath } = options;
//     let { useMiddlewares } = options;

//     if (!useMiddlewares) {
//       useMiddlewares = [];
//     }

//     this.middlewares.push(json());
//     this.middlewares.push(rTracer.expressMiddleware());
//     this.middlewares.push(logRequest);

//     this.middlewares.push(...useMiddlewares);

//     useMiddlewares?.forEach((item) => this.app.use(item));
//     logger.debug(" .>>>. ", this.middlewares, " .<<<. ")
//     this.controllers = controllers;
//     this.globalApiBasePath = globalApiBasePath;

//     return this;
//   }

//   async start(port) {
//     if (!port) {
//       throw new Error('Please add a port to start the server');
//     }

//     logger.info(`baseUrl set as ${this.globalApiBasePath}`);

//     //registering controller with the Express application using the global API base path
//     this.controllers.forEach((controller) => {
//       // logger.info(`looping on controller currently ->  ${controller}`);
//       this.app.use(this.globalApiBasePath || '', controller(this.router));
//     });
    
//     return new Promise((resolve, reject) => {
//       this.app.listen(port, (err) => {
//         if (err) {
//           reject(err);
//           return;
//         }
//         logger.info(`Server started @port ${port}`);
//         resolve(this);
//       });
//     });
//   }
// }
