import {
  Controller, Post, Body, Get, Patch, Put, Delete, Param, HttpCode,
} from '@nestjs/common';
import { WhispService } from './whisp.service';
import { IWhisp } from '../interfaces/whisp.interface';

@Controller('whisp')
export class WhispController {
  constructor(private readonly whispService: WhispService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() whisp: IWhisp) {
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
  async update(@Param('id') id: string, @Body() whisp: IWhisp) {
    await this.whispService.update(id, whisp);
  }

  @Put(':id')
  @HttpCode(204)
  async replace(@Param('id') id: string, @Body() whisp: IWhisp) {
    await this.whispService.replace(id, whisp);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    await this.whispService.delete(id);
  }
}
