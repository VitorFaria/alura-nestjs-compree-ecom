import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ListUserDTO } from './dto/ListUser.dto';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDTO } from './dto/UpdateUser.dto';
import { CreateUserDTO } from './dto/CreateUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly UserRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDTO) {
    const userEntity = new UserEntity();

    userEntity.email = createUserDto.email;
    userEntity.password = createUserDto.password;
    userEntity.name = createUserDto.name;

    return this.UserRepository.save(userEntity);
  }

  async listUsers() {
    const users = await this.UserRepository.find();
    const mappedUsers = users.map(
      (user) => new ListUserDTO(user.id, user.name),
    );
    return mappedUsers;
  }

  async findByEmail(email: string) {
    const checkEmail = await this.UserRepository.findOne({
      where: { email },
    });
    return checkEmail;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDTO) {
    await this.UserRepository.update(id, updateUserDto);
  }

  async deleteUser(id: string) {
    await this.UserRepository.delete(id);
  }
}
