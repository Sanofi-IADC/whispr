import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Put,
  Delete,
  Param,
  HttpCode,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { WhispService } from './whisp.service';
import { WhispInputType } from './whisp.input';

@Controller('whisp')
export class WhispController {
  constructor(private readonly whispService: WhispService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() whisp: WhispInputType) {
    return this.whispService.create(whisp);
  }

  @Get()
  async findAll() {
    return this.whispService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.whispService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(204)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(@Param('id') id: string, @Body() whisp: WhispInputType) {
    await this.whispService.update(id, whisp);
  }

  @Put(':id')
  @HttpCode(204)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async replace(@Param('id') id: string, @Body() whisp: WhispInputType) {
    await this.whispService.replace(id, whisp);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    await this.whispService.delete(id);
  }
}
