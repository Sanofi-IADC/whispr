import {
  Controller, Post, Body, Get, Put, Delete, Param, HttpCode, Patch,
} from '@nestjs/common';
import { TagGroupService } from './tagGroup.service';
import { ITagGroup } from '../interfaces/tagGroup.interface';

@Controller('TagGroup')
export class TagGroupController {
  constructor(private readonly tagGroupService: TagGroupService) {}

  @Post()
  @HttpCode(201)
  async createTagGroup(@Body() tagGroup: ITagGroup) {
    return this.tagGroupService.create(tagGroup);
  }

  @Get()
  async findAllTagGroups() {
    return this.tagGroupService.findAll();
  }

  @Get(':id')
  async findTagGroupById(@Param('id') id: string) {
    return this.tagGroupService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(204)
  async updateTagGroup(@Param('id') id: string, @Body() tagGroup: ITagGroup) {
    await this.tagGroupService.update(id, tagGroup);
  }

  @Put(':id')
  @HttpCode(204)
  async replaceTagGroup(@Param('id') id: string, @Body() tagGroup: ITagGroup) {
    await this.tagGroupService.replace(id, tagGroup);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteTagGroup(@Param('id') id: string) {
    await this.tagGroupService.delete(id);
  }
}
