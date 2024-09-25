import prisma from "../db"
import bcrypt from 'bcryptjs'

interface CreateUserRequest {
    name: string;
    store_name: string;
    email: string;
    password: string;
  }
  
  export async function createUser({
    name, store_name, email, password
  }: CreateUserRequest) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await prisma.user.create({
      data: { name, store_name, email, password: hashedPassword }
    })
    
    return {
      result,
    };
  }