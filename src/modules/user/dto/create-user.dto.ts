import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { IsUnique } from '../validation/is-email-unique.validator';

export class CreateUserDTO {
  @IsNotEmpty()
  name: string;

  @IsEmail(undefined, { message: 'This email address is invalid' })
  @IsUnique({ message: 'This email address has already been taken' })
  email: string;

  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W+).{8,30}$/, {
    message: "The password must contain at least a lowercase, an upperCase, a number, a special character and should have between 8 and 30 characters"
  })
  password: string;
}
