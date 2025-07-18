import { UserService } from './services/user.service';
import { CreateUserDTO, UpdateUserDTO } from './types/user';

async function main() {
  const userService = new UserService();

  try {
    // Example: Create a new user
    const newUser: CreateUserDTO = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'securepassword123',
      role: 'user'
    };
    const createdUser = await userService.createUser(newUser);
    console.log('Created User:', createdUser);

    // Example: Get all users
    const users = await userService.getUsers();
    console.log('All Users:', users);

    if (createdUser) {
      // Example: Update user
      const updateData: UpdateUserDTO = {
        name: 'John Updated'
      };
      const updatedUser = await userService.updateUser(createdUser.id, updateData);
      console.log('Updated User:', updatedUser);

      // Example: Get user by ID
      const user = await userService.getUserById(createdUser.id);
      console.log('User by ID:', user);

      // Example: Delete user
      const deleted = await userService.deleteUser(createdUser.id);
      console.log('User deleted:', deleted);
    }
  } catch (error) {
    console.error('Error in main:', error);
  }
}

main();
