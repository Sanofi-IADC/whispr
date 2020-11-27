import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
  HttpCode,
  Patch,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { TagInputType } from './tag.input';
import { ITag } from '../interfaces/tag.interface';

@Controller('Tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createTag(@Body() tag: TagInputType): Promise<ITag> {
    return this.tagService.create(tag);
  }

  @Get()
  async findAllTags(): Promise<ITag[]> {
    return this.tagService.findAll();
  }

  @Get(':id')
  async findTagById(@Param('id') id: string): Promise<ITag> {
    return this.tagService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(204)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateTag(
    @Param('id') id: string,
    @Body() tag: TagInputType,
  ): Promise<ITag> {
    return this.tagService.update(id, tag);
  }

  @Put(':id')
  @HttpCode(204)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async replaceTag(
    @Param('id') id: string,
    @Body() tag: TagInputType,
  ): Promise<ITag> {
    return this.tagService.replace(id, tag);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteTag(@Param('id') id: string): Promise<boolean> {
    return this.tagService.delete(id);
  }
}
