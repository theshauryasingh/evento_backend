import { PrismaClient } from '@prisma/client';
import tokenService from './token.service';
// import {generateTokens}  from '@/services';


const prisma = new PrismaClient();

const userService = {
  async login(email, password) {
    // console.log(prisma)
    const user = await prisma.user.findUnique({
        where: {
            email: email,
            },
        });

    if (!user) {
        throw new Error('User not found');
    }
    let isValidPassword

    // const isValidPassword = await bcrypt.compare(password, user.password);
    if (password == user.password){
        isValidPassword = true
    }
    else{
        isValidPassword = false
    }
    
    if (!isValidPassword) {
        throw new Error('Incorrect password');
    }
    const tokens = await tokenService.getToken(user.user_id);
    console.log('tokens ', tokens);

    return { user, tokens };
  },

  // Get all users
  async getUsers() {
    return prisma.user.findMany();
  },

  // Get user by ID
  async createUser(userData) {
    // console.log("==>>", typeof tokenService);
    try {
      const newUser = await prisma.user.create({
        data: userData,
      });
      newUser['status'] = true;
  
      console.log('createUser done');
      return { user: newUser };

    } catch (error) {
      console.error('fail', error);
      return { error, status: false };
    }
  },

  // Update user by ID
  async updateUser(userId, userData) {
    return prisma.user.update({
      where: {
        user_id: userId,
      },
      data: userData,
    });
  },

  // Delete user by ID
  async deleteUser(userId) {
    await tokenService.deleteUserRefreshTokens(userId);
    return prisma.user.delete({
      where: {
        user_id: userId,
      },
    });
  },
};

export default userService;
