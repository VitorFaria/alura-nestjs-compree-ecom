import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UpdateUserDTO } from './dto/update-user.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { ListUserDTO } from './dto/list-user.dto';
import { UserService } from './user.service';

@Controller('/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDTO) {
    const user = await this.userService.createUser(createUserDto);

    return {
      user: new ListUserDTO(user.id, user.name),
      message: 'usuário criado com sucesso',
    };
  }

  @Get()
  async listUsers() {
    const users = await this.userService.listUsers();

    return users;
  }

  @Put('/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDTO,
  ) {
    const user = await this.userService.updateUser(
      id,
      updateUserDto,
    );

    return {
      user: user,
      message: 'usuário atualizado com sucesso',
    };
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    await this.userService.deleteUser(id);

    return 'usuário removido com suceso'
  }
}
