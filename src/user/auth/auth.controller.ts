import {
  Body,
  Controller,
  Inject,
  Post,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
  Req,
  Res, HttpCode, HttpStatus
} from "@nestjs/common";
import { User } from '../user.entity';
import { RegisterDto, LoginDto } from './auth.dto';
import { JwtAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  @Inject(AuthService)
  private readonly service: AuthService;

  @Post('register')
  @UseInterceptors(ClassSerializerInterceptor)
  private register(@Body() body: RegisterDto): Promise<User | never> {
    return this.service.register(body);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  private login(@Body() body: LoginDto): Promise<{ user: User; token: string }> {
    return this.service.login(body);
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  private refresh(@Req() { user }: any): Promise<string | never> {
    return this.service.refresh(<User>user);
  }
}
