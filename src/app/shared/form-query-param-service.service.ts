import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { startWith, take, takeUntil } from 'rxjs/operators';
import { Observable, ObservableInput, Subject } from 'rxjs';
import { falsyRemover, getLeafValuePairs } from './utils';
import { throttledControlValueChange } from './abstract-control';

@Injectable({
  providedIn: 'root',
})
export class FormQueryParamService {
  constructor(private router: Router) {}

  initializeFormChangesAsQueryParam(param: {form: FormGroup; unsubscribe$: ObservableInput<void>}) {
    const form = param.form;
    throttledControlValueChange(form)
      .pipe(startWith(form.value))
      .pipe(takeUntil(param.unsubscribe$))
      .subscribe((changedValue: Record<string, any>) => {
        const onlyValidValues = falsyRemover(changedValue);

        const leafTuples: {
          [key: string]: string;
        } = getLeafValuePairs(onlyValidValues).reduce((previousValue: any, currentValue: any) => {
          previousValue[currentValue[0]] = currentValue[1];
          return previousValue;
        }, {});

        this.router.navigate([], {queryParams: leafTuples});
      });
  }

  extractQueryParams(activatedRoute: ActivatedRoute): Observable<object> {
    // TODO: arrays
    // TODO: boolean
    // TODO: dates ?
    // TODO: anything else ?
    return activatedRoute.queryParams.pipe(take(1));
  }
}