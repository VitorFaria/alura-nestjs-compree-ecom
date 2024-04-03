import { IsEmail, IsNotEmpty } from "class-validator";

export class AuthDto {
  @IsNotEmpty({message: "Campo email é obrigatório"})
  @IsEmail()
  email: string;

  @IsNotEmpty({message: "Campo senha é obrigatório"})
  password: string;
}
