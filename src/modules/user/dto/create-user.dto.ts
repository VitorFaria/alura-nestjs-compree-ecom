import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { IsUnique } from '../validation/is-email-unique.validator';

export class CreateUserDTO {
  @IsNotEmpty({ message: 'O nome não pode ser vazio' })
  name: string;

  @IsEmail(undefined, { message: 'O e-mail informado é inválido' })
  @IsUnique({ message: 'Já existe um usuário com este e-mail' })
  email: string;

  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W+).{8,30}$/, {
    message: "A senha deve conter pelo menos uma letra minúscula, uma letra maiúscula, um dígito, um caractere especial e ter entre 8 e 30 caracteres"
  })
  password: string;
}
