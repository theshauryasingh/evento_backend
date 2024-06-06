import { BadRequestError, CustomError, createController, HttpStatusCode, Logger } from '@/lib';
import { eventService } from '@/services';

import { query } from 'express';

const logger = new Logger('auth.controller');

const handleErrors = (err) => {
    // console.log(err.message, err.code);
    let errors = {'email':'', 'password':''};

    if(err.message === 'incorrect email'){
        errors.email = 'that email is not registered';
    }

    if(err.message === 'incorrect password'){
        errors.password = 'that password is not registered';
    }

    if (err.code === 11000){
        errors.email = "email is already registered";
        console.log(errors);
        return errors;
    }

    if (err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }
    console.log(errors);
    return errors;
}


const eventController = createController({
  basePath: 'events',
  handlers: [
    {
      path: 'categories',
      GET: {
        status: HttpStatusCode.OK,
        execute: async (_, res) => {
          try {
            const categories = await eventService.getAllEventCategories();
            return categories;
          } catch (err) {
            logger.error("Error fetching event categories", err);
            throw new Error("Failed to fetch event categories");
          }
        }
      }
    }
  ],
});

export default eventController;
