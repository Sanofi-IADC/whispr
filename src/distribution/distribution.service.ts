import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { IWhisp } from '../interfaces/whisp.interface';

@Injectable()
export class DistributionService {
  private readonly WHISP_SUBJECT = new Subject();

  public get whispSubject(): Subject<unknown> {
    return this.WHISP_SUBJECT;
  }

  public distributeWhisp(newWhisp: IWhisp): void {
    this.whispSubject.next(newWhisp);
  }
}
