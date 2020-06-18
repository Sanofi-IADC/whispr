import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { IWhisp } from '../interfaces/whisp.interface';

@Injectable()
export class DistributionService {
  private readonly WHISP_SUBJECT = new Subject();

  public get whispSubject() {
    return this.WHISP_SUBJECT;
  }

  public distributeWhisp(newWhisp: IWhisp) {
    this.whispSubject.next(newWhisp);
  }
}
