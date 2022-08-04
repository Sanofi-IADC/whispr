import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ISequence } from './sequence.entity';
import { Whisp } from '../whisp/whisp.entity';

@Injectable()
export class SequenceService {
  constructor(@InjectModel('Sequence') private sequenceModel: Model<ISequence>) {}

  /**
   * Get next ID for a Whisp
   *
   * ID has format <ApplicationID>-<Type>-<SequenceID>
   *
   * Every combination of <ApplicationID> & <Type> has its own <SequenceID> counter
   * @param whisp
   */
  async getNextWhispID(whisp: Whisp): Promise<string> {
    const sequencePrefix = `${whisp.applicationID}-${whisp.type}`;
    const nextSequence = await this.getNextSequence(sequencePrefix);
    return `${sequencePrefix}-${nextSequence}`;
  }

  /**
   * Get next value of a sequence
   * @param sequenceName
   */
  async getNextSequence(sequenceName: string): Promise<number> {
    const sequence = await this.sequenceModel
      .findOneAndUpdate(
        { sequenceName },
        { $inc: { sequenceValue: 1 } },
        { new: true, upsert: true },
      )
      .exec();
    return sequence.sequenceValue;
  }
}
