import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  SERVER: {
    PORT: process.env.SERVER_PORT,
    CORS: process.env.CORS.split("|") 
  },
  DB: {
    
  }
};
