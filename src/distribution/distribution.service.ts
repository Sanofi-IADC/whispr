import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IWhisp } from '../interfaces/whisp.interface';

@Injectable()
export class DistributionService {
  private readonly WHISP_SUBJECT = new Subject();

  constructor(
    @InjectModel('Whisp') private readonly whispModel: Model<IWhisp>,
  ) {}

  public get whispSubject() {
    return this.WHISP_SUBJECT;
  }

  public distributeWhisp(newWhisp) {
    this.whispSubject.next(newWhisp);
  }
}
