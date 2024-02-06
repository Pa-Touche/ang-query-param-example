import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError, timer } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

/**
 * Meant as recover mechanism
 * 
 * @implNote: Was generated with help of ChatGPT.
 * 
 * TODO: could be enhanced by doing some kind of "same call check":
 * - same URL 
 * - same request body
 * 
 * TODO: create a "backup url" => use query params stuff? 
 * requires to identify the FormGroup ? 
 */
@Injectable()
export class MultiplePostFailureInterceptor implements HttpInterceptor {
    private consecutiveErrors = 0;
    private errorTimer$ = new Subject<void>();

    /**
     * Range in milliseconds that defines "how quickly" the same error must be triggered again to be taken into account.
     */
    private static readonly ERROR_TIMER_RANGE_MILLIS = 15_000;

    private static readonly SUPPORTED_HTTP_CODE = 422;


    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((error: any) => {
                if (error instanceof HttpErrorResponse && error.status === MultiplePostFailureInterceptor.SUPPORTED_HTTP_CODE) {
                    this.handleHttpError(error);
                }
                return throwError(() => error);
            })
        );
    }

    private handleHttpError(error: HttpErrorResponse): void {
        this.consecutiveErrors++;

        if (this.consecutiveErrors === 1) {
            timer(MultiplePostFailureInterceptor.ERROR_TIMER_RANGE_MILLIS)
                .pipe(takeUntil(this.errorTimer$)).subscribe(() => {
                    this.consecutiveErrors = 0;
                });
        }

        if (this.consecutiveErrors === 3) {
            this.showConfirmationDialog(error);
            this.consecutiveErrors = 0; // Reset counter after user confirmation
            this.errorTimer$.next(); // Stop the timer after user confirmation
        }
    }

    private showConfirmationDialog(error: HttpErrorResponse): void {
        const userConfirmation = confirm('Do you want to download an error report?');
        if (userConfirmation) {
            this.downloadErrorReport(error);
        }
    }

    private downloadErrorReport(error: HttpErrorResponse): void {
        // Implement logic to download error report
        const errorReport = {
            request: {
                body: error.error.requestBody,
                method: error.error.requestMethod,
                url: error.url
            },
            response: {
                body: error.error.responseBody,
                code: error.status
            }
        };

        downloadJsonFile(errorReport, `error-report-${new Date().valueOf()}.json`);
    }


}

/**
 * Triggers the download of a json-file from the passed data.
 * Prefer a more robust solutation than this one that was made to make the interceptor 'standalone'
 * @param data actual object that must be serialized into JSON 
 * @param fileName name of the produced file
 */
function downloadJsonFile(data: Record<any, any>, fileName: string) {
    // Convert JSON data to a Blob
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });

    // Create a download link
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;

    // Append the link to the document
    document.body.appendChild(link);

    // Trigger a click on the link to start the download
    link.click();

    // Remove the link from the document
    document.body.removeChild(link);
}
