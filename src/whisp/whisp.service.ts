import {
  HttpException, HttpStatus, Injectable, Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import parse from 'parse-duration';
import { SequenceService } from '../sequence/sequence.service';
import { IWhisp } from '../interfaces/whisp.interface';
import { DistributionService } from '../distribution/distribution.service';
import { FileService } from '../file/file.service';
import { Event, EventNames } from '../event/event.entity';
import { EventService } from '../event/event.service';
import { WhispInputType } from './whisp.input';
import { WhispAttachment } from './whisp-attachment.entity';
import { WhispAttachmentInput } from './whisp-attachment.input';
import { TagInputType } from '../tag/tag.input';
import { WhispCount } from './whispCount.entity';
import { Whisp } from './whisp.entity';

@Injectable()
export class WhispService {
  private readonly logger = new Logger(WhispService.name);

  constructor(
    @InjectModel('Whisp') private readonly whispModel: Model<IWhisp>,
    private readonly distributionService: DistributionService,
    private readonly imageService: FileService,
    private readonly sequenceService: SequenceService,
    private readonly eventService: EventService,
  ) {}

  async create(whispIn: WhispInputType): Promise<IWhisp> {
    const whisp = new Whisp();
    // fill whisp with inputType with same name
    Object.keys(whispIn).forEach((key) => {
      whisp[key] = whispIn[key];
    });
    whisp.readableID = await this.sequenceService.getNextWhispID(whisp);
    whisp.timestamp = whisp.timestamp || new Date();
    whisp.attachments = await this.replaceFiles(whispIn.attachments, whispIn.readableID);
    const now = new Date();
    whisp.updated = now;
    const { timeToLiveSec, expirationDate } = WhispService.fillTTL(whispIn, now);
    whisp.timeToLiveSec = timeToLiveSec;
    whisp.expirationDate = expirationDate;
    const createdWhisp = await this.whispModel.create(whisp);
    await this.eventService.triggerEvent(new Event(EventNames.WHISP_CREATED, createdWhisp));
    this.distributionService.distributeWhisp(createdWhisp);

    return createdWhisp;
  }

  private static fillTTL(
    whisp: WhispInputType,
    updated: Date,
  ): { timeToLiveSec: number; expirationDate: Date } {
    const expDate = new Date(updated);
    if (whisp.expirationDate) {
      return { timeToLiveSec: null, expirationDate: whisp.expirationDate };
    }

    if (whisp.timeToLive) {
      let ttl = Number(whisp.timeToLive);

      if (Number.isNaN(ttl)) {
        ttl = parse(whisp.timeToLive, 's');
      }

      if (!ttl || ttl < 1) {
        throw new HttpException(
          'time to live must be positive number of seconds or a parsable time string like 2min,1hour',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        expDate.setSeconds(expDate.getSeconds() + ttl);
        return { timeToLiveSec: ttl, expirationDate: expDate };
      }
    } else {
      return { timeToLiveSec: null, expirationDate: null };
    }
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

  async findAll(
    filter?: Record<string, unknown>,
    sort: string | any = {},
    limit: number = null,
  ): Promise<IWhisp[]> {
    return this.whispModel.find(filter).sort(sort).limit(limit).exec();
  }

  async findOne(id: string): Promise<IWhisp> {
    return this.whispModel.findById(id).exec();
  }

  async findTagsByWhispId(whispId: string): Promise<TagInputType[]> {
    const query = this.whispModel.findById(whispId).populate('tags');
    const whisps = await query.exec();
    return whisps.tags;
  }

  async countWhisps(filter?: Record<string, unknown>): Promise<number> {
    return this.whispModel.countDocuments(filter).exec();
  }

  async countWhispsGroup(filter?: Record<string, unknown>[], group?: any): Promise<WhispCount[]> {
    // match and group code simulates mongo countDocuments but allows custom group
    const mongoMatch = { $match: filter ? { $or: filter } : {} };
    const mongoGroup = { $group: { _id: group, count: { $sum: 1 } } };

    return this.whispModel.aggregate([mongoMatch, mongoGroup]).allowDiskUse(true).exec();
  }

  async update(id: string, whispIn: WhispInputType): Promise<IWhisp> {
    const whisp: Partial<IWhisp> = {
      ...whispIn,
      updated: new Date(),
    } as Partial<IWhisp>;
    if (whispIn.attachments) {
      whisp.attachments = await this.replaceFiles(whispIn.attachments, whispIn.readableID);
    }
    const { timeToLiveSec, expirationDate } = WhispService.fillTTL(whispIn, whisp.updated);
    whisp.timeToLiveSec = timeToLiveSec;
    whisp.expirationDate = expirationDate;

    const updatedWhisp = await this.whispModel
      .findOneAndUpdate({ _id: id }, whisp, { new: true })
      .exec();
    await this.eventService.triggerEvent(new Event(EventNames.WHISP_UPDATED, updatedWhisp));
    this.logger.log(updatedWhisp, 'Updated Whisp');
    this.distributionService.distributeWhisp(updatedWhisp);

    return updatedWhisp;
  }

  async replace(id: string, whisp: WhispInputType): Promise<any> {
    const replacedWhisp = await this.whispModel.replaceOne({ _id: id }, whisp).exec();
    await this.eventService.triggerEvent(new Event(EventNames.WHISP_REPLACED, replacedWhisp));

    return replacedWhisp;
  }

  async delete(id: string): Promise<boolean> {
    const whisp = await this.whispModel.findById(id).exec();
    const { deletedCount: countOfDeletedWhisp } = await this.whispModel
      .deleteOne({ _id: id })
      .exec();
    if (countOfDeletedWhisp <= 0) {
      return false;
    }
    await this.eventService.triggerEvent(new Event(EventNames.WHISP_DELETED, whisp));

    return true;
  }
}
