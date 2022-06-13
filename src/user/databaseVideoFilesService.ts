import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from "typeorm";
import { DatabaseVideoFileEntity } from "./databaseVideoFile.entity";

@Injectable()
class DatabaseVideoFilesService {
  constructor(
    @InjectRepository(DatabaseVideoFileEntity)
    private databaseFilesRepository: Repository<DatabaseVideoFileEntity>,
  ) {}

  async uploadDatabaseFile(dataBuffer: Buffer, filename: string) {
    const newFile = await this.databaseFilesRepository.create({
      filename,
      data: dataBuffer
    })
    await this.databaseFilesRepository.save(newFile);
    return newFile;
  }

  async uploadDatabaseFileWithQueryRunner(dataBuffer: Buffer, filename: string, queryRunner: QueryRunner) {
    const newFile = await queryRunner.manager.create(DatabaseVideoFileEntity, {
      filename,
      data: dataBuffer
    })
    await queryRunner.manager.save(DatabaseVideoFileEntity, newFile);
    return newFile;
  }

  async deleteFileWithQueryRunner(fileId: number, queryRunner: QueryRunner) {
    const deleteResponse = await queryRunner.manager.delete(DatabaseVideoFileEntity, fileId);
    if (!deleteResponse.affected) {
      throw new NotFoundException();
    }
  }

  async getFileById(fileId: number) {
    // @ts-ignore
    const file = await this.databaseFilesRepository.findOne({where: {id: fileId}});
    if (!file) {
      throw new NotFoundException();
    }
    return file;
  }
}

export default DatabaseVideoFilesService;