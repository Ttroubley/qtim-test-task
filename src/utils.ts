import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (userPassword: string, currentPassword: string): Promise<boolean> => {
  return await bcrypt.compare(currentPassword, userPassword);
};
