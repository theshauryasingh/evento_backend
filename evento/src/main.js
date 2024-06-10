import { config } from '@/config';
import { helloController, authController, eventController, userController } from '@/controllers';
import { Logger, Server, createServer } from '@/lib';

const logger = new Logger('main');

const server = new Server({
  globalApiBasePath: '/',
  controllers: [helloController, authController, eventController, userController],
});

// logger.debug(" .>>>. ", helloController, " .<<<. ")

async function run() {
  try {
    await server.start(config.SERVER.PORT);
  } catch (error) {
    logger.error('Error while starting the server', error);
  }
}

run();

// const app = createServer({
//   globalApiBasePath: '/api',
//   controllers: [helloController, authController],
// });

// app.listen(config.SERVER.PORT, () => {
//   logger.info(`Server started @port ${config.SERVER.PORT}`);
// });