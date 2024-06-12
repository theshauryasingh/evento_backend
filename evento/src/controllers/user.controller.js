import { BadRequestError, CustomError, createController, HttpStatusCode, Logger } from '@/lib';
import { userService, tokenService } from '@/services';
import { verifyTokenMiddleware } from '@/middlewares';

const logger = new Logger('user.controller');


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

const userController = createController({
  basePath: 'user',
  middlewares: [verifyTokenMiddleware],
  handlers: [
    {
      path: 'listall',
      POST: {},
      GET: {
        status: HttpStatusCode.OK,
        execute: async () => {
            console.log(" ..user..listall.. ")
            try {
                const users = await userService.getUsers();
                return users;
            }
            catch(err){
                logger.error(" .. login error .. ", err)
                const errors = handleErrors(err)
                throw new BadRequestError("'Login failed ", errors)
            }
        },
      },
    }
  ],
});

export default userController;
