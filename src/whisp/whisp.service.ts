import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SequenceService } from '../sequence/sequence.service';
import { IWhisp } from '../interfaces/whisp.interface';
import { DistributionService } from '../distribution/distribution.service';
import { FileService } from '../file/file.service';
import { Event, EventNames } from '../event/event.entity';
import { EventService } from '../event/event.service';
import { WhispInputType } from './whisp.input';
import { WhispAttachment } from './whisp-attachment.entity';
import { WhispAttachmentInput } from './whisp-attachment.input';

@Injectable()
export class WhispService {
  private readonly logger = new Logger(DistributionService.name);

  constructor(
    @InjectModel('Whisp') private readonly whispModel: Model<IWhisp>,
    private readonly distributionService: DistributionService,
    private readonly imageService: FileService,
    private readonly sequenceService: SequenceService,
    private readonly eventService: EventService,
  ) {}

  async create(whispIn: WhispInputType): Promise<IWhisp> {
    const whisp: any = whispIn;
    if (!whisp.timestamp) {
      whisp.timestamp = new Date().toISOString();
    }
    this.logger.debug({ whispIn });
    whisp.readableID = await this.sequenceService.getNextWhispID(whisp);
    whisp.attachments = await this.replaceFiles(whisp.attachments, whisp.readableID);
    whisp.updated = new Date().toISOString();
    const createdWhisp = await this.whispModel.create(whisp as any);
    await this.eventService.triggerEvent(new Event(EventNames.WHISP_CREATED, createdWhisp));
    this.logger.log(createdWhisp, 'New Whisp');
    this.distributionService.distributeWhisp(createdWhisp);

    return createdWhisp;
  }

  async replaceFiles(
    attachments: WhispAttachmentInput[],
    readableId: string,
  ): Promise<WhispAttachment[]> {
    this.logger.debug({ attachments });
    if (!attachments || !Array.isArray(attachments)) {
      return undefined;
    }
    return Promise.all(
      attachments
        .map((attachment) => ({
          dataMappingPath: attachment.dataMappingPath,
          file: attachment.file.newFile || attachment.file.oldFile,
        }))
        .map(async (attachment) => {
          let filePath: string;
          if (attachment.file instanceof Promise) {
            const file = await attachment.file;
            let s3Path = readableId;
            if (attachment.dataMappingPath) {
              s3Path += `/${attachment.dataMappingPath}`;
            }
            filePath = await this.imageService.saveFile(file, s3Path);
          } else {
            filePath = attachment.file;
          }
          return {
            dataMappingPath: attachment.dataMappingPath,
            file: filePath,
          };
        }),
    );
  }

  async findAll(filter?: any, sort: string | any = {}, limit: number = null): Promise<IWhisp[]> {
    return this.whispModel.find(filter).sort(sort).limit(limit).exec();
  }

  async findOne(id: string): Promise<IWhisp> {
    return this.whispModel.findById(id).exec();
  }

  async countWhisps(filter?: any): Promise<number> {
    return this.whispModel.countDocuments(filter).exec();
  }

  async update(id: string, whispIn: any): Promise<IWhisp> {
    const whisp = whispIn;
    whisp.updated = new Date().toISOString();
    if (whisp.attachments) {
      whisp.attachments = await this.replaceFiles(whisp.attachments, whisp.readableID);
    }
    const updatedWhisp = await this.whispModel
      .findOneAndUpdate({ _id: id }, whisp, { new: true })
      .exec();
    await this.eventService.triggerEvent(new Event(EventNames.WHISP_UPDATED, updatedWhisp));
    this.logger.log(updatedWhisp, 'Updated Whisp');
    this.distributionService.distributeWhisp(updatedWhisp);

    return updatedWhisp;
  }

  async replace(id: string, whisp: any): Promise<any> {
    const replacedWhisp = await this.whispModel.replaceOne({ _id: id }, whisp).exec();
    await this.eventService.triggerEvent(new Event(EventNames.WHISP_REPLACED, replacedWhisp));

    return replacedWhisp;
  }

  async delete(id: string) {
    const { n: countOfDeletedWhisp } = await this.whispModel.deleteOne({ _id: id }).exec();
    if (countOfDeletedWhisp <= 0) {
      return false;
    }
    await this.eventService.triggerEvent(new Event(EventNames.WHISP_DELETED, id));

    return true;
  }
}
