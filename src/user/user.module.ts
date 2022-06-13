import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';
import { AuthModule } from './auth/auth.module';
import { Company } from "./company.entity";
import { Profile } from "./profile.entity";
import DatabaseFilesService from "./databaseFilesService";
import { DatabaseFileEntity } from "./databaseFile.entity";
import DatabaseFilesController from "./databaseFiles.controller";
import { DatabaseVideoFileEntity } from "./databaseVideoFile.entity";
import DatabaseVideoFilesService from "./databaseVideoFilesService";
import DatabaseVideoFilesController from "./databaseVideoFiles.controller";

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile, Company, DatabaseFileEntity, DatabaseVideoFileEntity]), AuthModule],
  controllers: [UserController, DatabaseFilesController, DatabaseVideoFilesController],
  providers: [UserService, DatabaseFilesService, DatabaseVideoFilesService],
})
export class UserModule {}
