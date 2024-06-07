import { BadRequestError, CustomError, createController, HttpStatusCode, Logger } from '@/lib';
import { userService, tokenService } from '@/services';

import jwt from 'jsonwebtoken';
// import { query } from 'express';

const logger = new Logger('auth.controller');

// const maxAge  = 3 * 24 * 60 * 60 ;
// const createToken = (id, secret_text) => {
//     return jwt.sign({id}, secret_text, {expiresIn : maxAge});
// }

const handleErrors = (err) => {
    // console.log(err.message, err.code);
    let errors = {'email':'', 'password':''};

    if(err.message === 'incorrect email'){
        errors.email = 'The email is not registered';
    }

    if(err.message === 'incorrect password'){
        errors.password = 'The password is not registered';
    }

    if (err.code === 11000){
        errors.email = "Email is already registered";
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

// {
//     params: req.params,
//     query: req.query,
//     body: req.body,
//     ctx: req.ctx,
//     cookies: req.cookies,
//     headers: req.headers,
//     files: req.files,
//     file: req.file,
//   };

// {
//     "email":"shauryasingh96@gmail.com",
//     "password":"qwer@4321",
//     "full_name":"shaurya singh",
//     "contact_number":8802245897,
//     "role_id":1
// }

// "email":"shauryasingh96@gmail.com",
// "password":"qwer@4321",
// "full_name":"shaurya singh",
// "contact_number":8802245897,
// "role_id":1

// for validation
// joi , zod

const authController = createController({
  basePath: 'auth',
  handlers: [
    {
      path: 'login',
      GET: {},
      POST: {
        status: HttpStatusCode.OK,
        execute: async ({body} , res) => {
            // logger.debug('.. ', body);
            const  {email, password} = body;
            // console.log(' .. ', email, password)
            try {
                const { user, tokens } = await userService.login(email, password);
                // const userid =  userdet.user_id
                // throw new Error("error testing  ");
                // return {user: {userid}, refreshToken:refreshToken, accessToken:accessToken};
                return { user, tokens };
            }
            catch(err){
                logger.error(" .. login error .. ", err)
                const errors = handleErrors(err)
                throw new BadRequestError("'Login failed ", errors)
            }
        },
      },
    },
    {
      path: 'signup',
      GET: {
        execute: () => {
        }
      },
      POST: {
        status : HttpStatusCode.CREATED,
        execute: async({body}, res) => {
            let { email, password, full_name, contact_number, role_id } = body;
            // console.log(" post signup ... ", email, password)
            role_id = Number(role_id)
            try{
                const { user, tokens } = await userService.createUser({email, password, full_name, contact_number, role_id});
                console.log(" post signup ... ", user, tokens)
                if (user['status'] == false) {
                  throw new BadRequestError("User already exists");
                } else {
                  console.log(" post signup userdet... ", userdet)
                  const userid =  user.user_id
                  return { user, tokens };
                }
            }
            catch(err){
              logger.error(" .. signup error .. ", err);
              const errors = handleErrors(err);
              throw new BadRequestError("Failed", errors); // Assuming BadRequestError is a custom error class
          }
        }

      } 
    },
    {
      path: 'refresh',
      GET: {
        execute: () => {
        }
      },
      POST: {
        status : HttpStatusCode.CREATED,
        execute: async({body}, res) => {
            const { refreshToken } = body;
            try{
                const tokens = await tokenService.refreshAccessToken(refreshToken);
                return { tokens };
            }
            catch(err){
              logger.error('Token refresh error', err);
              const errors = handleErrors(err);
              throw new BadRequestError('Token refresh failed',  errors); // Assuming BadRequestError is a custom error class
          }
        }

      } 
    }
  ],
});

export default authController;
