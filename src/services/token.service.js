import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
require('dotenv').config();
// import { config } from '@/config';

const prisma = new PrismaClient();
const maxAge = 3 * 24 * 60 * 60; // 3 days

const createToken = (id, secret, expiresIn) => {
  return jwt.sign({ id }, secret, { expiresIn });
};

const tokenService = {
  // getTokenName: async (user_id) =>  {
  //   console.log("I am working")
  // },
  async getToken(userId) {
    try {
      const accessToken = createToken(userId, process.env.ACCESS_TOKEN_SECRET, '15m');
      const refreshToken = uuidv4();
      await prisma.refreshToken.create({
        data: {token: refreshToken,
          userId: userId,
          expiresAt: new Date(Date.now() + maxAge * 1000),
        },
      });
      console.log("tokenService test ", accessToken, refreshToken);
      return { accessToken, refreshToken };
    } catch (error) {
      console.log("From Inside", error)
    }
  },

  async refreshAccessToken(refreshToken) {
    const storedToken = await prisma.refreshToken.findUnique({
      where: {
        token: refreshToken,
      },
      include: {
        user: true,
      },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new Error('Invalid or expired refresh token');
    }

    const accessToken = createToken(storedToken.user.user_id, config.ACCESS_TOKEN_SECRET, '15m');

    return { accessToken };
  },

  async deleteRefreshToken(refreshToken) {
    await prisma.refreshToken.delete({
      where: {
        token: refreshToken,
      },
    });
  },

  async deleteUserRefreshTokens(userId) {
    await prisma.refreshToken.deleteMany({
      where: {
        userId: userId,
      },
    });
  },
};

export default tokenService;
