import { BadRequestError, createController, HttpStatusCode, Logger } from '@/lib';

const logger = new Logger('hello.controller');

const helloController = createController({
  basePath: 'hello',
  handlers: [
    {
      path: 'world',
      GET: {
        status: HttpStatusCode.CREATED,
        execute: ({ headers,query }) => {
          logger.info('Logs are working', headers);
          if(!query) {
            throw new BadRequestError("Query param not provided")
          }
          return {message: 'Hello World testing... '};
        },
      },
      POST: {
        execute: ({ headers, body }) => {
          logger.info('Logs are working', body);
          return body;
        },
      },
    },
    {
      path: 'world2',
      GET: {
        execute: () => {
        }
      },
      POST: {

      } 
    }
  ],
});


export default helloController;
