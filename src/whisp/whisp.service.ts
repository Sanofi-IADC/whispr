import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SequenceService } from '../sequence/sequence.service';
import { IWhisp } from '../interfaces/whisp.interface';
import { DistributionService } from '../distribution/distribution.service';
import { FileService } from '../file/file.service';

@Injectable()
export class WhispService {
  private readonly logger = new Logger(DistributionService.name);

  constructor(
    @InjectModel('Whisp') private readonly whispModel: Model<IWhisp>,
    private readonly distributionService: DistributionService,
    private readonly imageService: FileService,
    private readonly sequenceService: SequenceService,
  ) {}

  async create(whispIn: any): Promise<IWhisp> {
    let whisp = whispIn;
    if (!whisp.timestamp) {
      whisp.timestamp = new Date().toISOString();
    }
    whisp.readableID = await this.sequenceService.getNextWhispID(whisp);
    whisp = await this.replaceFiles(whisp, whisp.readableID);
    whisp.updated = whisp.timestamp;
    const createdWhisp = await this.whispModel.create(whisp);
    this.logger.log(createdWhisp, 'New Whisp');
    this.distributionService.distributeWhisp(createdWhisp);
    return createdWhisp;
  }

  async replaceFiles<T>(whisp: T, path = ''): Promise<T> {
    let newObj;
    if (Array.isArray(whisp)) {
      newObj = [...whisp];
    } else {
      newObj = { ...whisp };
    }
    const keys = Object.keys(newObj);
    const promises: Promise<any>[] = [];
    const filePromises: { file: Promise<any>; key: string }[] = [];

    for (let i = 0; i < keys.length; i += 1) {
      const value = newObj[keys[i]];
      // Get all potential files from the request
      if (value instanceof Promise) {
        filePromises.push({ file: value, key: keys[i] });
      } else if (typeof value === 'object') {
        if (whisp instanceof Array) {
          const replaceFilePromise = this.replaceFiles(value, path);
          replaceFilePromise.then((obj) => {
            newObj[keys[i]] = obj;
          });
          promises.push(replaceFilePromise);
        } else {
          const replaceFilePromise = this.replaceFiles(value, `${path}/${keys[i]}`);
          replaceFilePromise.then((obj) => {
            newObj[keys[i]] = obj;
          });
          promises.push(replaceFilePromise);
        }
      }
    }
    // For every potential file ...
    for (let i = 0; i < filePromises.length; i += 1) {
      const filePromise = filePromises[i];
      // ... wait until it is loaded ...
      filePromise.file.then((file) => {
        if (
          file
          && file.createReadStream
          && {}.toString.call(file.createReadStream) === '[object Function]'
        ) {
          // ... and save it in s3 ...
          const savePromise = this.imageService.saveFile(file, path);
          savePromise.then((key) => {
            // ... and replace the file with the s3 key
            newObj[filePromise.key] = key;
          });
          promises.push(savePromise);
        }
      });
    }
    // Wait until all files are loaded
    await Promise.all(filePromises.map((data) => data.file));
    // Wait until all files are replaced & complete data is checked for files
    await Promise.all(promises);
    return newObj;
  }

  async findAll(filter?: any, sort: string | any = {}, limit: number = null): Promise<IWhisp[]> {
    return this.whispModel.find(filter).sort(sort).limit(limit).exec();
  }

  async findOne(id: string): Promise<IWhisp> {
    return this.whispModel.findById(id).exec();
  }

  async update(id: string, whispIn: any): Promise<IWhisp> {
    let whisp = whispIn;
    whisp.updated = new Date().toISOString();
    whisp = await this.replaceFiles(whisp);
    const updatedWhisp = await this.whispModel
      .findOneAndUpdate({ _id: id }, whisp, { new: true })
      .exec();
    this.logger.log(updatedWhisp, 'Updated Whisp');
    this.distributionService.distributeWhisp(updatedWhisp);
    return updatedWhisp;
  }

  async replace(id: string, whisp: any): Promise<any> {
    return this.whispModel.replaceOne({ _id: id }, whisp).exec();
  }

  async delete(id: string) {
    const { n: countOfDeletedWhisp } = await this.whispModel.deleteOne({ _id: id }).exec();
    if (countOfDeletedWhisp <= 0) {
      return false;
    }
    return true;
  }
}
