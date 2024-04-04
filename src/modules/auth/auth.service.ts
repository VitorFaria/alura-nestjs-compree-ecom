import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

export interface UserPayload {
  sub: string;
  username: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(authDto: AuthDto): Promise<{ accessToken: string}> {
    const user = await this.userService.findByEmail(authDto.email);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const credentials = await bcrypt.compare(authDto.password, user?.password)

    if (!credentials) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload: UserPayload = { sub: user.id, username: user.name, email: user.email }

    return {
      accessToken: await this.jwtService.signAsync(payload)
    };
  }
}
