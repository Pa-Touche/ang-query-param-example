import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { map, startWith, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { Observable, ObservableInput, Subject, of } from 'rxjs';
import { falsyRemover, getLeafValuePairs, objectWithNestedPropertzToNestedObject } from './utils';
import { throttledControlValueChange } from './abstract-control';

@Injectable({
  providedIn: 'root',
})
export class FormQueryParamService {
  constructor(private router: Router) { }

  initializeFormChangesAsQueryParam(param: { form: FormGroup; unsubscribe$: ObservableInput<void> }) {
    const form = param.form;
    throttledControlValueChange(form)
      .pipe(takeUntil(param.unsubscribe$))
      .subscribe((changedValue: Record<string, any>) => {
        const onlyValidValues = falsyRemover(changedValue);

        const leafTuples: {
          [key: string]: string;
        } = getLeafValuePairs(onlyValidValues).reduce((previousValue: any, currentValue: any) => {
          previousValue[currentValue[0]] = currentValue[1];
          return previousValue;
        }, {});

        this.router.navigate([], { queryParams: leafTuples });
      });
  }

  extractQueryParams(param: { activatedRoute: ActivatedRoute }): Observable<object> {
    // TODO: arrays
    // TODO: boolean
    // TODO: dates ?
    // TODO: anything else ?
    return this.extractObjectFromQueryParams(param.activatedRoute);
  }

  applyQueryParams(param: { activatedRoute: ActivatedRoute, form: FormGroup }): Observable<void> {
    // TODO: arrays
    // TODO: boolean
    // TODO: dates ?
    // TODO: anything else ?
    return this.extractObjectFromQueryParams(param.activatedRoute).pipe(
      tap(value => {
        // if event is produced, fields that are not present will be removed (see observable)
        param.form.patchValue(value, { emitEvent: false })
      }),
      switchMap(params => of()))
  }

  private extractObjectFromQueryParams(activatedRoute: ActivatedRoute): Observable<Record<string, any>> {
    return activatedRoute.queryParams.pipe(
      take(1),
      map(value => objectWithNestedPropertzToNestedObject(value))
      );
  }

}