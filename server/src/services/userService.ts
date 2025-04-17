import User, { UserAttributes } from '../models/User';

export async function createUser(data: Omit<UserAttributes, 'UserID'>): Promise<User> {
  try {
    return await User.create(data);
  } catch (error) {
    console.error('Error in userService.createUser:', error); 
    throw error; 
  }
}

export async function getUserById(id: number): Promise<User | null> {
  return await User.findByPk(id);
}

export async function getAllUsers(): Promise<User[]> {
  return await User.findAll();
}

export async function updateUser(id: number, data: Partial<UserAttributes>): Promise<number> {
  const [affectedCount] = await User.update(data, { where: { UserID: id } });
  return affectedCount;
}

export async function deleteUser(id: number): Promise<number> {
  return await User.destroy({ where: { UserID: id } });
}

export async function registerUser(data: Omit<UserAttributes, 'UserID'>): Promise<User> {
  return await User.create(data);
}

export async function findUserByName(UserName: string): Promise<User | null> {
  return await User.findOne({ where: { UserName } });
}

