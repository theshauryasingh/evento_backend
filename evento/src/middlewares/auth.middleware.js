import jwt from 'jsonwebtoken';
import { createMiddleware } from '@/lib';
const { promisify } = require('util');

require('dotenv').config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

// const verifyToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ message: 'Access Token Required' });
//   }

//   jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
//     if (err) {
//       return res.status(403).json({ message: 'Invalid Access Token' });
//     }

//     req.user = user;
//     next();
//   });
// };

const verifyToken = async (token) => {
  const decoded = await promisify(jwt.verify)(token.headers.accesstoken, process.env.ACCESS_TOKEN_SECRET);
  // console.log(" .. Ba Ba Ba Ba Ba 7 crore .. verifyToken accessed ", decoded.id)
  // res = { userId: decoded.id };
  return decoded.id;
};

const extractContext = ( id ) => ( id );

const verifyTokenMiddleware = createMiddleware(verifyToken, extractContext);

export default verifyTokenMiddleware;
// module.exports = verifyToken;
