import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const userService = {
  async login(email, password) {
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

    return user;
  },
  // Get all users
  async getUsers() {
    return prisma.user.findMany();
  },

  // Get user by ID
  async getUserById(userId) {
    return prisma.user.findUnique({
      where: {
        user_id: userId,
      },
    });
  },

  // Create a new user
  async createUser(userData) {
    return prisma.user
    .create({
      data: userData,
    })
    .then(newUser => {
      console.log('done')
      newUser['status'] = true;
      return newUser;
    }) //need to do error handling more properly
    .catch(error => {
      console.log('fail')
      // error instanceof prisma.PrismaClientKnownRequestError
      return {error, status: false};
    });
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
    return prisma.user.delete({
      where: {
        user_id: userId,
      },
    });
  },
};

export default userService;
