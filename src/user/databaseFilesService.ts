import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from "typeorm";
import { DatabaseFileEntity } from "./databaseFile.entity";

@Injectable()
class DatabaseFilesService {
  constructor(
    @InjectRepository(DatabaseFileEntity)
    private databaseFilesRepository: Repository<DatabaseFileEntity>,
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
    const newFile = await queryRunner.manager.create(DatabaseFileEntity, {
      filename,
      data: dataBuffer
    })
    await queryRunner.manager.save(DatabaseFileEntity, newFile);
    return newFile;
  }

  async deleteFileWithQueryRunner(fileId: number, queryRunner: QueryRunner) {
    const deleteResponse = await queryRunner.manager.delete(DatabaseFileEntity, fileId);
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

export default DatabaseFilesService;