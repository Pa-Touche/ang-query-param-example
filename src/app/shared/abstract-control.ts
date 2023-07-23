import { AbstractControl } from '@angular/forms';
import { isEqual } from 'lodash';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

type ComparisonPredicate = (x: any, y: any) => boolean;

/**
 * Enables throttled valueChanged observable.
 * 
 * @param control AbstractControl on which the value changed throttled value change will be subscribed to. 
 * @param options configuration: comparisonPredicate and throttle interval.
 * @returns piped observable from AbstractControl#valueChanges
 */
export function throttledControlValueChange(control: AbstractControl, options?: { changeDetectionPredicate?: ComparisonPredicate, throttleMillis: number }) {

    const actualChangeComparator: (x: any, y: any) => boolean = options?.changeDetectionPredicate || defaultComparisonPredicate();

    const actualDebounceTimeMillis = options?.throttleMillis || 150;

    return control.valueChanges
        .pipe(debounceTime(actualDebounceTimeMillis))
        .pipe(distinctUntilChanged(actualChangeComparator));
}

function defaultComparisonPredicate() {
    return (x: any, y: any) => isEqual(x, y);
}
