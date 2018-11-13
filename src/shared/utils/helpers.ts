import { AxiosError } from 'axios';
import { OperatorFunction, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export class Helpers {
  static catchObservableError: OperatorFunction<any, any> = catchError((err: AxiosError) => throwError(err));

  static toBuffer(str: string): Buffer {
    return Buffer.from(str, 'utf-8');
  }
}
