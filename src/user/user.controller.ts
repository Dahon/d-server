import {
  ClassSerializerInterceptor,
  Controller,
  Req,
  UseGuards,
  UseInterceptors,
  Put,
  Body,
  Inject, Get, Query, Param, Post
} from "@nestjs/common";
import { Request } from 'express';
import { UpdateNameDto } from './user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { JwtAuthGuard } from './auth/auth.guard';
import { Profile } from "./profile.entity";
import { Company } from "./company.entity";

@Controller('user')
export class UserController {
  @Inject(UserService)
  private readonly service: UserService;

  @Put('name')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  private updateName(@Body() body: UpdateNameDto, @Req() req: Request): Promise<User> {
    return this.service.updateName(body, req);
  }

  @Get('profiles')
  private getProfiles(@Req() req: Request): Promise<Profile[]> {
    return this.service.getProfiles();
  }

  @Get('profile/search')
  private searchProfile(@Query() query): Promise<Profile[]> {
    return this.service.getProfile(query);
  }

  @Post('profile')
  private storeProfiles(@Body() body: any, @Req() req: Request) {
    return this.service.storeProfile(body, req);
  }

  @Get('profile/:id')
  private getProfileById(@Param('id') id): Promise<Profile> {
    return this.service.getProfileById(id);
  }

  @Get('companies')
  private getCompanies(): Promise<Company[]> {
    return this.service.getCompanies();
  }

  @Get('company/:id')
  private getCompanyById(@Param('id') id): Promise<Company> {
    return this.service.getCompanyById(id);
  }

  @Post('company')
  private storeCompany(@Body() body: any, @Req() req: Request) {
    return this.service.storeCompany(body, req);
  }

  @Get('profile/search')
  private searchCompany(@Query() query): Promise<Company[]> {
    return this.service.getCompany(query);
  }


}
