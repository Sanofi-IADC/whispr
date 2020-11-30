import {
  Controller, Post, Body, Get, Put, Delete, Param, HttpCode, Patch, UsePipes, ValidationPipe,
} from '@nestjs/common';
import { ITagGroup } from '../interfaces/tagGroup.interface';
import { TagGroupService } from './tagGroup.service';
import { TagGroupInputType } from './tagGroup.input';

@Controller('TagGroup')
export class TagGroupController {
  constructor(private readonly tagGroupService: TagGroupService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createTagGroup(@Body() tagGroup: TagGroupInputType): Promise<ITagGroup> {
    return this.tagGroupService.create(tagGroup);
  }

  @Get()
  async findAllTagGroups(): Promise<ITagGroup[]> {
    return this.tagGroupService.findAll();
  }

  @Get(':id')
  async findTagGroupById(@Param('id') id: string): Promise<ITagGroup> {
    return this.tagGroupService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(204)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateTagGroup(@Param('id') id: string, @Body() tagGroup: TagGroupInputType): Promise<ITagGroup> {
    return this.tagGroupService.update(id, tagGroup);
  }

  @Put(':id')
  @HttpCode(204)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async replaceTagGroup(@Param('id') id: string, @Body() tagGroup: TagGroupInputType): Promise<ITagGroup> {
    return this.tagGroupService.replace(id, tagGroup);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteTagGroup(@Param('id') id: string): Promise<boolean> {
    return this.tagGroupService.delete(id);
  }
}
