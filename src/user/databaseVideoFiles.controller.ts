import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
  StreamableFile,
  Res,
  ParseIntPipe,
} from '@nestjs/common';
import { Readable } from 'stream';
import { Response } from 'express';
import DatabaseFilesService from "./databaseFilesService";
import DatabaseVideoFilesService from "./databaseVideoFilesService";

@Controller('database-video-files')
@UseInterceptors(ClassSerializerInterceptor)
export default class DatabaseVideoFilesController {
  constructor(
    private readonly databaseFilesService: DatabaseVideoFilesService
  ) {}

  @Get(':id')
  async getDatabaseFileById(@Param('id', ParseIntPipe) id: number, @Res({ passthrough: true }) response: Response) {
    const file = await this.databaseFilesService.getFileById(id);
    console.log('file', file);
    const stream = Readable.from(file.data);

    response.set({
      'Content-Disposition': `inline; filename="${file.filename}"`,
      'Content-Type': 'video/mp4'
    })

    return new StreamableFile(stream);
  }
}