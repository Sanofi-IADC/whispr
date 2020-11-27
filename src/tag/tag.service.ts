import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TagGroup } from '../tagGroup/tagGroup.entity';
import { ITag } from '../interfaces/tag.interface';
import { Tag } from './tag.entity';
import { TagInputType } from './tag.input';

@Injectable()
export class TagService {
  private readonly logger = new Logger('Tag');

  constructor(@InjectModel('Tag') private readonly tagModel: Model<ITag>) {}

  async create(tagIn: TagInputType): Promise<ITag> {
    const tag = new Tag();
    tag.status = tagIn.status;
    tag.tagGroup = new TagGroup();
    tag.tagGroup._id = tagIn.tagGroup._id;
    tag.title = tagIn.title;

    const createdTag = await this.tagModel.create(tag);
    this.logger.log(createdTag, 'New Tag');
    return createdTag;
  }

  async findAll(filter?: Partial<TagInputType>): Promise<ITag[]> {
    return this.tagModel.find(filter).exec();
  }

  async findOne(id: string): Promise<ITag> {
    return this.tagModel.findById(id).exec();
  }

  async update(id: string, tagIn: TagInputType): Promise<ITag> {
    const updatedTag = await this.tagModel
      .findOneAndUpdate({ _id: id }, tagIn, { new: true })
      .exec();
    this.logger.log(updatedTag, 'Updated Tag');
    return updatedTag;
  }

  async replace(id: string, tag: TagInputType): Promise<ITag> {
    return this.tagModel.replaceOne({ _id: id }, tag).exec();
  }

  async delete(id: string): Promise<boolean> {
    const { n: countOfDeletedTagGroups } = await this.tagModel
      .deleteOne({ _id: id })
      .exec();

    return countOfDeletedTagGroups === 1;
  }
}
