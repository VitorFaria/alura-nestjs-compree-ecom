import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ListUserDTO } from './dto/list-user.dto';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDTO } from './dto/update-user.dto';
import { CreateUserDTO } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly UserRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDTO) {
    try {
      const userEntity = new UserEntity();
  
      Object.assign(userEntity, createUserDto as UserEntity);
  
      return this.UserRepository.save(userEntity);
    } catch (err) {
      throw err;
    }
  }

  async listUsers() {
    const users = await this.UserRepository.find();
    const mappedUsers = users.map(
      (user) => new ListUserDTO(user.id, user.name),
    );
    return mappedUsers;
  }

  async findUserById(id: string) {
    const user = await this.UserRepository.findOneBy({ id })

    if (!user) throw new NotFoundException(`Usuário com id ${id} não encontrado`);

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.UserRepository.findOne({
      where: { email },
    });

    // if (!user) throw new NotFoundException(`User with email ${email} not found`);

    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDTO) {
    try {
      const user = await this.findUserById(id);

      Object.assign(user, updateUserDto as UserEntity)
  
      return await this.UserRepository.save(user);
    } catch (err) {
      throw err;
    }
  }

  async deleteUser(id: string) {
    try {
      await this.findUserById(id);
  
      await this.UserRepository.delete(id);
    } catch (err) {
      throw err;
    }
  }
}
