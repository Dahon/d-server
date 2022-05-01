import { Trim } from 'class-sanitizer';
import { IsBoolean, IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @Trim()
  @IsEmail()
  public readonly email: string;

  @IsString()
  @MinLength(8)
  public readonly password: string;

  @IsBoolean()
  public readonly is_company: boolean;

  @IsString()
  @IsOptional()
  public readonly name?: string;

  @IsString()
  @IsOptional()
  public readonly lastName?: string;

}

export class LoginDto {
  @Trim()
  @IsEmail()
  public readonly email: string;

  @IsString()
  public readonly password: string;
}
