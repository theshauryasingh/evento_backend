import { BadRequestError, CustomError, createController, HttpStatusCode, Logger } from '@/lib';
import { userService } from '@/services';
import jwt from 'jsonwebtoken';
// import { query } from 'express';

const logger = new Logger('auth.controller');

const maxAge  = 3 * 24 * 60 * 60 ;
const createToken = (id, secret_text) => {
    return jwt.sign({id}, secret_text, {expiresIn : maxAge});
}

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
                const userdet = await userService.login(email, password);
                const userid =  userdet.user_id
                // throw new Error("error testing  ");
                const refreshToken = createToken(userid, 'refresh-token');
                const accessToken = createToken(userid, 'access-token');
                // res.cookie('refresh-token', token, {maxAge: maxAge * 1000, secure: true})
                return {user: {userid}, refreshToken:refreshToken, accessToken:accessToken};
            }
            catch(err){
                logger.error(" .. error .. ", err)
                const errors = handleErrors(err)
                throw new BadRequestError("failed ", errors)
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
            console.log(" post signup ... ", email, password)
            role_id = Number(role_id)
            try{
                const userdet = await userService.createUser({email, password, full_name, contact_number, role_id});
                if (userdet['status'] == false) {
                  throw new BadRequestError("User already exists");
                } else {
                  console.log(" post signup userdet... ", userdet)
                  const userid =  userdet.user_id
                  return {user: {userid}};
                }
            }
            catch(err){
              logger.error(" .. error .. ", err);
              const errors = handleErrors(err);
              throw new BadRequestError("Failed", errors); // Assuming BadRequestError is a custom error class
          }
        }

      } 
    }
  ],
});

export default authController;
