import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ITagGroup } from '../interfaces/tagGroup.interface';
import { TagGroupInputType } from './tagGroup.input';

@Injectable()
export class TagGroupService {
  private readonly logger = new Logger('TagGroup');

  constructor(@InjectModel('TagGroup') private readonly tagGroupModel: Model<ITagGroup>) {}

  async create(tagGroupIn: any): Promise<ITagGroup> {
    const createdTagGroup = await this.tagGroupModel.create(tagGroupIn);
    this.logger.log(createdTagGroup, 'New TagGroup');
    return createdTagGroup;
  }

  async findAll(filter?: Partial<TagGroupInputType>): Promise<ITagGroup[]> {
    return this.tagGroupModel.find(filter).exec();
  }

  async findOne(id: string): Promise<ITagGroup> {
    return this.tagGroupModel.findById(id).exec();
  }

  async update(id: string, tagGroupIn: TagGroupInputType): Promise<ITagGroup> {
    const updatedTagGroup = await this.tagGroupModel
      .findOneAndUpdate({ _id: id }, tagGroupIn, { new: true })
      .exec();
    this.logger.log(updatedTagGroup, 'Updated TagGroup');
    return updatedTagGroup;
  }

  async replace(id: string, tagGroup: TagGroupInputType): Promise<ITagGroup> {
    return this.tagGroupModel.replaceOne({ _id: id }, tagGroup).exec();
  }

  async delete(id: string) {
    return this.tagGroupModel.deleteOne({ _id: id }).exec();
  }
}
