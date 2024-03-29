import {
  Controller, Get, Param, Res, Logger,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('*')
  async getFile(@Param('*') key: string, @Res() response: FastifyReply): Promise<void> {
    try {
      const file = await this.fileService.getFile(key);
      response.type(file.ContentType);
      response.send(file.Body);
    } catch (error) {
      Logger.error(error);
      response.status(404);
      response.send();
    }
  }
}
