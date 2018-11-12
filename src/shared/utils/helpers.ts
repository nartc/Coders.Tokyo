import { AxiosError } from 'axios';
import { OperatorFunction, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GoogleSearchResponse } from '../google-search';

export class Helpers {
  static catchObservableError: OperatorFunction<GoogleSearchResponse, any> = catchError((err: AxiosError) => throwError(err));
}
