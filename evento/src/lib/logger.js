import * as rTracer from 'cls-rtracer';
import * as _ from 'lodash';
import { createLogger, format, transports, config } from 'winston';

const { combine, timestamp, printf, splat } = format;

format.colorize().addColors({
  component: 'bold cyan',
  serverName: 'bold yellow',
  timestamp: 'blue',
  requestId: 'gray',
});

function getRequestId(rId) {
  if (!rId) {
    return '';
  }
  return format.colorize().colorize('requestId', ` [requestId: ${rId}]`);
}

function getComponentName(name) {
  if (!name) {
    return '';
  }
  return format.colorize().colorize('component', ` [${name}]`);
}

const suppress = format((info) => {
  info.level = info.level.toUpperCase();
  return info;
});

let instance = null;

export default class Logger {
  constructor(componentName, singleton = false) {
    if (singleton && instance) {
      return instance;
    }
    this.logger = createLogger({
      levels: config.npm.levels,
      format: combine(
        suppress(),
        format.colorize(),
        timestamp(),
        splat(),
        printf((info) => {
          const rId = rTracer.id();
          return `${format
            .colorize()
            .colorize('serverName', `[SERVER]`)} ${format
            .colorize()
            .colorize('timestamp', `[${info.timestamp}]`)} [${
            info.level
          }]${getComponentName(componentName)}${getRequestId(rId)} ${
            info.message
          }`;
        })
      ),
      transports: [new transports.Console({ level: 'debug' })],
    });
    instance = this;
  }

  transformDataToString = (data) => {
    if (!data) {
      return '';
    }

    if (data instanceof Error) {
      if (typeof data.message === 'object') {
        return _.isEmpty(data.message) ? '' : JSON.stringify(data.message);
      }
      return data.message + data.stack? `${data.stack}` : ``;
    }

    if (typeof data === 'object') {
      return _.isEmpty(data) ? '' : JSON.stringify(data);
    }

    return data.toString();
  };

  info = (message, data) => {
    this.logger.info(`${message} ${this.transformDataToString(data)}`);
  };

  error = (message, data) => {
    this.logger.error(`${message} ${this.transformDataToString(data)}`);
  };

  debug = (message, data) => {
    this.logger.debug(`${message} ${this.transformDataToString(data)}`);
  };

  warn = (message, data) => {
    this.logger.warn(`${message} ${this.transformDataToString(data)}`);
  };

  http = (options) => {
    this.logger.http(
      `${options.ip} ${options.method} ${options.url} ${options.statusCode} ${options.responseTime}`
    );
  };
}
